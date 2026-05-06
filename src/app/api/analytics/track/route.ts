import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rateLimitedResponse, getClientIp } from "@/lib/api-utils";

export async function POST(request: Request) {
  try {
    const rateLimited = rateLimitedResponse(getClientIp(request), "analytics-track", 60, 60_000);
    if (rateLimited) return rateLimited;

    const body = await request.json();
    const { userId, referrer, path, sessionId } = body;

    if (!userId) {
      return NextResponse.json({ error: "userId required" }, { status: 400 });
    }

    const userAgent = request.headers.get("user-agent") || "";
    const device = /mobile/i.test(userAgent) ? "mobile" : /tablet/i.test(userAgent) ? "tablet" : "desktop";
    const browser = /firefox/i.test(userAgent)
      ? "Firefox"
      : /chrome/i.test(userAgent)
      ? "Chrome"
      : /safari/i.test(userAgent)
      ? "Safari"
      : "Other";

    await prisma.portfolioView.create({
      data: {
        userId,
        referrer: referrer || "direct",
        device,
        browser,
        path: path || "/",
        sessionId: sessionId || null,
      },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to track" }, { status: 500 });
  }
}
