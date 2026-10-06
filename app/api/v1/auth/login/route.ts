import { db } from "@/lib/db";
import { loginSchema } from "@/lib/validation";
import { checkIpBan, createSession, recordFailedIpLogin, verifyPassword } from "@/lib/auth";
import { ApiError } from "@/lib/errors";
import { assertSameOrigin, jsonError } from "@/lib/http";
import { enforceRateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  try {
    assertSameOrigin(req);
    const ipHash = await checkIpBan(req);
    await enforceRateLimit(`auth:login:${ipHash}`, 5, 60);
    const body = loginSchema.parse(await req.json());
    const user = await db.user.findUnique({ where: { email: body.email } });
    if (!user?.passwordHash) { await recordFailedIpLogin(ipHash); throw new ApiError(401, "INVALID_CREDENTIALS", "Invalid email or password."); }
    if (user.lockoutUntil && user.lockoutUntil > new Date()) throw new ApiError(423, "ACCOUNT_LOCKED", "Account temporarily locked.");
    const ok = await verifyPassword(user.passwordHash, body.password);
    if (!ok) {
      const failed = user.failedLoginCount + 1;
      await db.user.update({ where: { id: user.id }, data: { failedLoginCount: failed, lockoutUntil: failed >= 5 ? new Date(Date.now() + 15 * 60 * 1000) : null } });
      await recordFailedIpLogin(ipHash);
      throw new ApiError(401, "INVALID_CREDENTIALS", "Invalid email or password.");
    }
    await db.user.update({ where: { id: user.id }, data: { failedLoginCount: 0, lockoutUntil: null } });
    await createSession(user.id);
    return Response.json({ id: user.id, email: user.email, role: user.role });
  } catch (error) { return jsonError(error, req); }
}
