import { db } from "@/lib/db";
import { redisClient } from "@/lib/redis";

export async function GET(_: Request, { params }: { params: Promise<{ kind: string }> }) {
  const { kind } = await params;
  if (!["worker", "socket", "jobs"].includes(kind)) return Response.json({ error: "unknown_health_target" }, { status: 404 });
  const redisOk = await redisClient().then((r) => r.ping()).then(() => true).catch(() => false);
  const postgresOk = await db.$queryRaw`SELECT 1`.then(() => true).catch(() => false);
  const checks = kind === "socket" ? { redis: redisOk } : { redis: redisOk, postgres: postgresOk };
  const ok = Object.values(checks).every(Boolean);
  return Response.json({ status: ok ? "ok" : "degraded", dependency: checks }, { status: ok ? 200 : 503 });
}
