import { db } from "@/lib/db";
import { registerSchema } from "@/lib/validation";
import { createSession, hashPassword } from "@/lib/auth";
import { ApiError } from "@/lib/errors";
import { assertSameOrigin, jsonError } from "@/lib/http";
import { enforceRateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  try {
    assertSameOrigin(req);
    await enforceRateLimit(`auth:register:${req.headers.get("x-forwarded-for") ?? "unknown"}`, 5, 60);
    const body = registerSchema.parse(await req.json());
    if (await db.user.findUnique({ where: { email: body.email } })) throw new ApiError(409, "ACCOUNT_EXISTS", "An account already exists.");
    const user = await db.user.create({ data: { email: body.email, name: body.name, passwordHash: await hashPassword(body.password) } });
    await createSession(user.id);
    return Response.json({ id: user.id, email: user.email }, { status: 201 });
  } catch (error) { return jsonError(error, req); }
}
