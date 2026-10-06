import { requireUser } from "@/lib/auth";
import { createOrder } from "@/lib/services/order.service";
import { createOrderSchema } from "@/lib/validation";
import { ApiError } from "@/lib/errors";
import { assertSameOrigin, jsonError, requestIds } from "@/lib/http";

export async function POST(req: Request) {
  try {
    assertSameOrigin(req);
    const idempotencyKey = req.headers.get("idempotency-key");
    if (!idempotencyKey || idempotencyKey.length < 8) throw new ApiError(400, "IDEMPOTENCY_KEY_REQUIRED", "Idempotency-Key header is required.");
    const user = await requireUser();
    const body = createOrderSchema.parse(await req.json());
    const ids = requestIds(req);
    return Response.json(await createOrder(user.id, body.items, ids.requestId, ids.traceId, idempotencyKey), { status: 201 });
  } catch (error) { return jsonError(error, req); }
}
