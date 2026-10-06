import { NextResponse } from "next/server";
import { ApiError, problem } from "./errors";

export function jsonError(error: unknown, request: Request) {
  const p = problem(error, new URL(request.url).pathname);
  return NextResponse.json(p, { status: p.status, headers: { "Content-Type": "application/problem+json" } });
}

export function requestIds(request: Request) {
  return {
    requestId: request.headers.get("x-request-id") ?? crypto.randomUUID(),
    traceId: request.headers.get("x-trace-id") ?? crypto.randomUUID(),
  };
}

export function assertSameOrigin(request: Request) {
  const expected = process.env.NEXT_PUBLIC_APP_URL;
  const origin = request.headers.get("origin");
  if (origin && expected && new URL(origin).origin !== new URL(expected).origin) {
    throw new ApiError(403, "ORIGIN_FORBIDDEN", "Request origin is not allowed.");
  }
}
