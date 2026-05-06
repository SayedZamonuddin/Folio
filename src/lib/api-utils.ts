import { NextResponse } from "next/server";
import { rateLimit, getRateLimitHeaders } from "./rate-limit";

export function rateLimitedResponse(ip: string, endpoint: string, limit = 30, windowMs = 60_000) {
  const key = `${endpoint}:${ip}`;
  const { success, remaining } = rateLimit(key, limit, windowMs);

  if (!success) {
    return NextResponse.json(
      { data: null, error: { message: "Too many requests. Please try again later.", code: "RATE_LIMITED" } },
      { status: 429, headers: getRateLimitHeaders(remaining, limit) }
    );
  }

  return null;
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return "127.0.0.1";
}
