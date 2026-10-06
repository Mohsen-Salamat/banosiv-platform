import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { ZarinpalProvider } from "@/lib/payments/zarinpal";
import { db } from "@/lib/db";
import { ApiError } from "@/lib/errors";
import { assertSameOrigin, jsonError } from "@/lib/http";
import { releaseIdempotency, reserveIdempotency } from "@/lib/idempotency";

const schema = z.object({ orderId: z.string().min(1), idempotencyKey: z.string().min(8).max(128) });

export async function POST(req: Request) {
  let lockKey: string | undefined;
  try {
    assertSameOrigin(req);
    const user = await requireUser();
    const body = schema.parse(await req.json());
    lockKey = `payment:${body.idempotencyKey}`;
    const existing = await db.transaction.findUnique({ where: { idempotencyKey: body.idempotencyKey } });
    if (existing?.authority) return Response.json({ authority: existing.authority, providerPaymentId: existing.providerPaymentId, redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/payment/zarinpal/callback?Authority=${existing.authority}&Status=OK` });
    if (!await reserveIdempotency(lockKey)) throw new ApiError(409, "DUPLICATE_MUTATION", "This payment operation is already being processed.");
    const order = await db.order.findFirst({ where: { id: body.orderId, userId: user.id, status: "PENDING" } });
    if (!order) throw new ApiError(404, "ORDER_NOT_FOUND", "Order not found or is not payable.");
    const payment = await new ZarinpalProvider().request({ orderId: order.id, amountMinor: order.totalMinor, callbackUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/payment/zarinpal/callback`, description: `BANOSIV order ${order.id}`, idempotencyKey: body.idempotencyKey });
    await db.transaction.create({ data: { orderId: order.id, provider: "ZARINPAL", amountMinor: order.totalMinor, idempotencyKey: body.idempotencyKey, authority: payment.authority } });
    return Response.json(payment);
  } catch (error) { if (lockKey) await releaseIdempotency(lockKey).catch(() => undefined); return jsonError(error, req); }
}
