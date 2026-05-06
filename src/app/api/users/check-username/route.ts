import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { USERNAME_REGEX, RESERVED_USERNAMES } from "@/lib/constants";
import { rateLimitedResponse, getClientIp } from "@/lib/api-utils";

export async function GET(request: Request) {
  const rateLimited = rateLimitedResponse(getClientIp(request), "check-username", 20, 60_000);
  if (rateLimited) return rateLimited;
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("q")?.toLowerCase().trim();

  if (!username) {
    return NextResponse.json({ available: false, reason: "Username is required" });
  }

  if (!USERNAME_REGEX.test(username)) {
    return NextResponse.json({
      available: false,
      reason: "Username can only contain lowercase letters, numbers, and hyphens (3-30 chars)",
    });
  }

  if (RESERVED_USERNAMES.includes(username as (typeof RESERVED_USERNAMES)[number])) {
    return NextResponse.json({ available: false, reason: "This username is reserved" });
  }

  const existing = await prisma.user.findUnique({
    where: { username },
    select: { id: true },
  });

  return NextResponse.json({ available: !existing });
}
