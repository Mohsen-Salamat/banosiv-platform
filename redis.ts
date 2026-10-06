import { createClient, type RedisClientType } from "redis";
import { logger } from "./logging";
let client: RedisClientType | null = null;
export async function redisClient() {
  if (!process.env.REDIS_URL) throw new Error("REDIS_URL is required");
  if (!client) { client = createClient({ url: process.env.REDIS_URL }); client.on("error", (error) => logger.warn({ err: error, event: "redis_error" })); }
  if (!client.isOpen) await client.connect();
  return client;
}
