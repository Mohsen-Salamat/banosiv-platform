import { destroySession } from "@/lib/auth";
import { assertSameOrigin, jsonError } from "@/lib/http";

export async function POST(req: Request) {
  try { assertSameOrigin(req); await destroySession(); return Response.json({ ok: true }); }
  catch (error) { return jsonError(error, req); }
}
