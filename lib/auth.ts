import argon2 from "argon2";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { db } from "./db";
import { ApiError } from "./errors";
import { randomToken, sha256 } from "./security";
import { CONSTANTS } from "./constants";

const COOKIE = "banosiv_session";
function secret() { const value = process.env.JWT_SECRET; if (!value || value.length < 32) throw new Error("JWT_SECRET must be at least 32 characters"); return new TextEncoder().encode(value); }
function clientIp(request: Request) { return (request.headers.get("x-forwarded-for") ?? "unknown").split(",")[0].trim() || "unknown"; }

export async function createSession(userId: string) {
  const raw = randomToken();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const session = await db.session.create({ data: { userId, tokenHash: sha256(raw), expiresAt } });
  const jwt = await new SignJWT({ sid: session.id, uid: userId }).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("7d").sign(secret());
  const c = await cookies();
  c.set(COOKIE, jwt, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", expires: expiresAt });
  return session;
}

export async function requireUser() {
  const c = await cookies(), jwt = c.get(COOKIE)?.value;
  if (!jwt) throw new ApiError(401, "AUTH_REQUIRED", "Authentication required.");
  try {
    const { payload } = await jwtVerify(jwt, secret(), { algorithms: ["HS256"] });
    const sid = String(payload.sid), uid = String(payload.uid);
    const session = await db.session.findFirst({ where: { id: sid, userId: uid, expiresAt: { gt: new Date() } }, include: { user: true } });
    if (!session || session.user.deletedAt) throw new ApiError(401, "SESSION_INVALID", "Session is invalid.");
    return session.user;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(401, "SESSION_INVALID", "Session is invalid.");
  }
}

export async function destroySession() {
  const c = await cookies(), jwt = c.get(COOKIE)?.value;
  if (jwt) { try { const { payload } = await jwtVerify(jwt, secret()); if (payload.sid) await db.session.deleteMany({ where: { id: String(payload.sid) } }); } catch {} }
  c.delete(COOKIE);
}

export async function hashPassword(password: string) { return argon2.hash(password, { type: argon2.argon2id }); }
export async function verifyPassword(hash: string, password: string) { return argon2.verify(hash, password); }
export function assertRole(user: { role: string }, roles: string[]) { if (!roles.includes(user.role)) throw new ApiError(403, "FORBIDDEN", "You do not have permission for this action."); }
export const lockoutLimit = CONSTANTS.security.lockoutAttempts;
export async function checkIpBan(request: Request) { const ipHash = sha256(clientIp(request)); const record = await db.ipBan.findUnique({ where: { ipHash } }); if (record?.blockedUntil && record.blockedUntil > new Date()) throw new ApiError(423, "IP_TEMPORARILY_BLOCKED", "Too many failed login attempts from this IP."); return ipHash; }
export async function recordFailedIpLogin(ipHash: string) { const record = await db.ipBan.upsert({ where: { ipHash }, create: { ipHash, failedLoginCount: 1 }, update: { failedLoginCount: { increment: 1 } } }); if (record.failedLoginCount >= 10) await db.ipBan.update({ where: { ipHash }, data: { blockedUntil: new Date(Date.now() + 60 * 60 * 1000), failedLoginCount: 0 } }); }
