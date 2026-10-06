import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { ApiError } from "@/lib/errors";
import { jsonError } from "@/lib/http";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireUser();
    const { id } = await params;
    const order = await db.order.findFirst({ where: { id, userId: user.id }, include: { items: true, transactions: true, refunds: true } });
    if (!order) throw new ApiError(404, "ORDER_NOT_FOUND", "Order not found.");
    return Response.json(order);
  } catch (error) {
    return jsonError(error, req);
  }
}
