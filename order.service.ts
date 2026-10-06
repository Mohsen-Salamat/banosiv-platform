import { db } from "../db";
import { ApiError } from "../errors";
import { audit } from "../audit";
import { assertTransition } from "../order-state";
import { calcTotal } from "../money";
import { releaseIdempotency, reserveIdempotency } from "../idempotency";
import { OrderStatus } from "@prisma/client";

export async function createOrder(userId: string, items: { productId: string; quantity: number }[], requestId: string, traceId: string, idempotencyKey: string) {
  const existing = await db.order.findUnique({ where: { idempotencyKey } });
  if (existing) return existing;
  const reserved = await reserveIdempotency(`order:${idempotencyKey}`);
  if (!reserved) throw new ApiError(409, "DUPLICATE_MUTATION", "This order operation is already being processed.");
  try {
    const products = await db.product.findMany({ where: { id: { in: items.map((x) => x.productId) }, active: true } });
    if (products.length !== new Set(items.map((x) => x.productId)).size) throw new ApiError(400, "PRODUCT_UNAVAILABLE", "One or more products are unavailable.");
    const byId = new Map(products.map((p) => [p.id, p]));
    const orderItems = items.map((i) => {
      const product = byId.get(i.productId);
      if (!product || product.stock < i.quantity) throw new ApiError(409, "INSUFFICIENT_STOCK", `Insufficient stock for ${product?.name ?? i.productId}.`);
      return { productId: product.id, sku: product.sku, name: product.name, quantity: i.quantity, unitPriceMinor: product.priceMinor, totalMinor: product.priceMinor * i.quantity };
    });
    const subtotalMinor = orderItems.reduce((sum, item) => sum + item.totalMinor, 0);
    const totalMinor = calcTotal(subtotalMinor, 0, 0, 0);
    return await db.$transaction(async (tx) => {
      const order = await tx.order.create({ data: { idempotencyKey, userId, currency: products[0]?.currency ?? "GBP", subtotalMinor, totalMinor, expiresAt: new Date(Date.now() + 30 * 60 * 1000), items: { create: orderItems } } });
      for (const item of items) {
        const updated = await tx.product.updateMany({ where: { id: item.productId, stock: { gte: item.quantity } }, data: { stock: { decrement: item.quantity } } });
        if (updated.count !== 1) throw new ApiError(409, "INVENTORY_CONFLICT", "Inventory changed during checkout.");
      }
      await tx.auditLog.create({ data: { userId, action: "order.created", entity: "Order", entityId: order.id, requestId, traceId, newValueJson: JSON.stringify({ status: order.status, totalMinor: order.totalMinor }) } });
      return order;
    });
  } catch (error) {
    await releaseIdempotency(`order:${idempotencyKey}`).catch(() => undefined);
    throw error;
  }
}

export async function transitionOrder(orderId: string, to: OrderStatus, expectedVersion: number, actorId: string, requestId: string, traceId: string) {
  const current = await db.order.findUnique({ where: { id: orderId } });
  if (!current) throw new ApiError(404, "ORDER_NOT_FOUND", "Order not found.");
  if (current.version !== expectedVersion) throw new ApiError(409, "ORDER_VERSION_CONFLICT", "The order was modified by another operation.");
  assertTransition(current.status, to);
  const result = await db.order.updateMany({ where: { id: orderId, version: expectedVersion }, data: { status: to, version: { increment: 1 } } });
  if (result.count !== 1) throw new ApiError(409, "ORDER_VERSION_CONFLICT", "The order was modified by another operation.");
  await audit({ userId: actorId, action: "order.transition", entity: "Order", entityId: orderId, requestId, traceId, oldValue: { status: current.status, version: current.version }, newValue: { status: to, version: expectedVersion + 1 } });
  return db.order.findUniqueOrThrow({ where: { id: orderId } });
}
