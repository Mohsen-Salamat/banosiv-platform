import { redisClient } from "./redis";

export async function reserveIdempotency(key: string, ttl = 24 * 60 * 60) {
  const r = await redisClient();
  return (await r.set(`idempotency:${key}`, "processing", { NX: true, EX: ttl })) === "OK";
}

export async function releaseIdempotency(key: string) {
  const r = await redisClient();
  await r.del(`idempotency:${key}`);
}
