"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, Monitor, Smartphone, Tablet } from "lucide-react";

interface Stats {
  totalViews: number;
  topReferrers: { name: string; count: number }[];
  devices: { name: string; count: number }[];
  chartData: { date: string; views: number }[];
}

export default function AnalyticsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState("30");

  useEffect(() => {
    setLoading(true);
    fetch(`/api/analytics/stats?days=${days}`)
      .then((res) => res.json())
      .then(({ data }) => setStats(data))
      .finally(() => setLoading(false));
  }, [days]);

  if (loading) return <div className="py-12 text-center text-muted-foreground">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Analytics</h1>
        <Select value={days} onValueChange={(val) => { if (val) setDays(val); }}>
          <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="90">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalViews || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Top Referrer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.topReferrers[0]?.name || "—"}</div>
            <p className="text-xs text-muted-foreground">{stats?.topReferrers[0]?.count || 0} views</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Primary Device</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">{stats?.devices[0]?.name || "—"}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Views Over Time</CardTitle></CardHeader>
          <CardContent>
            {stats?.chartData && stats.chartData.length > 0 ? (
              <div className="flex h-40 items-end gap-1">
                {stats.chartData.map((d) => {
                  const maxViews = Math.max(...stats.chartData.map((x) => x.views));
                  const height = maxViews > 0 ? (d.views / maxViews) * 100 : 0;
                  return (
                    <div key={d.date} className="flex-1 flex flex-col items-center">
                      <div
                        className="w-full rounded-t bg-primary/80"
                        style={{ height: `${Math.max(height, 2)}%` }}
                        title={`${d.date}: ${d.views} views`}
                      />
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground py-8 text-center">
                No view data yet. Share your portfolio to start tracking!
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Top Referrers</CardTitle></CardHeader>
          <CardContent>
            {stats?.topReferrers && stats.topReferrers.length > 0 ? (
              <div className="space-y-3">
                {stats.topReferrers.map((r) => (
                  <div key={r.name} className="flex items-center justify-between">
                    <span className="text-sm">{r.name}</span>
                    <span className="text-sm font-medium">{r.count}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground py-4 text-center">No referrer data yet</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Devices</CardTitle></CardHeader>
          <CardContent>
            {stats?.devices && stats.devices.length > 0 ? (
              <div className="space-y-3">
                {stats.devices.map((d) => (
                  <div key={d.name} className="flex items-center gap-3">
                    {d.name === "desktop" && <Monitor className="h-4 w-4" />}
                    {d.name === "mobile" && <Smartphone className="h-4 w-4" />}
                    {d.name === "tablet" && <Tablet className="h-4 w-4" />}
                    <span className="text-sm capitalize flex-1">{d.name}</span>
                    <span className="text-sm font-medium">{d.count}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground py-4 text-center">No device data yet</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
