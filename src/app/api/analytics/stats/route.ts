import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import type { ApiResponse } from "@/types";

export async function GET(request: Request) {
  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();

  if (!authUser) {
    return NextResponse.json<ApiResponse<null>>(
      { data: null, error: { message: "Unauthorized", code: "UNAUTHORIZED" } },
      { status: 401 }
    );
  }

  const user = await prisma.user.findUnique({
    where: { supabaseId: authUser.id },
    select: { id: true },
  });

  if (!user) {
    return NextResponse.json<ApiResponse<null>>(
      { data: null, error: { message: "Not found", code: "NOT_FOUND" } },
      { status: 404 }
    );
  }

  const { searchParams } = new URL(request.url);
  const days = parseInt(searchParams.get("days") || "30");
  const since = new Date();
  since.setDate(since.getDate() - days);

  const views = await prisma.portfolioView.findMany({
    where: { userId: user.id, viewedAt: { gte: since } },
    select: { viewedAt: true, referrer: true, device: true, browser: true, path: true },
  });

  const totalViews = views.length;

  const referrerCounts: Record<string, number> = {};
  const deviceCounts: Record<string, number> = {};
  const dailyViews: Record<string, number> = {};

  views.forEach((view) => {
    const ref = view.referrer || "direct";
    referrerCounts[ref] = (referrerCounts[ref] || 0) + 1;

    const dev = view.device || "desktop";
    deviceCounts[dev] = (deviceCounts[dev] || 0) + 1;

    const day = view.viewedAt.toISOString().split("T")[0];
    dailyViews[day] = (dailyViews[day] || 0) + 1;
  });

  const topReferrers = Object.entries(referrerCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([name, count]) => ({ name, count }));

  const devices = Object.entries(deviceCounts)
    .map(([name, count]) => ({ name, count }));

  const chartData = Object.entries(dailyViews)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, count]) => ({ date, views: count }));

  const stats = { totalViews, topReferrers, devices, chartData };

  return NextResponse.json({ data: stats, error: null });
}
