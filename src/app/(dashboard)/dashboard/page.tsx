import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, FolderKanban, CheckCircle2, Circle } from "lucide-react";

export const metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();
  if (!authUser) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { supabaseId: authUser.id },
    include: {
      projects: { select: { id: true } },
      experiences: { select: { id: true } },
      testimonials: { select: { id: true } },
      _count: { select: { analytics: true } },
    },
  });

  if (!user) redirect("/onboarding");

  const checks = [
    { label: "Upload an avatar", done: !!user.avatarUrl },
    { label: "Write your bio", done: !!user.bio },
    { label: "Add your first project", done: user.projects.length > 0 },
    { label: "Add work experience", done: user.experiences.length > 0 },
    { label: "Get a testimonial", done: user.testimonials.length > 0 },
  ];

  const completedCount = checks.filter((c) => c.done).length;
  const completionPercent = Math.round((completedCount / checks.length) * 100);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Welcome back, {user.fullName.split(" ")[0]}</h1>
        <p className="text-muted-foreground">Here&apos;s how your portfolio is doing.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user._count.analytics}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Projects</CardTitle>
            <FolderKanban className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user.projects.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Profile Complete</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completionPercent}%</div>
            <div className="mt-2 h-2 w-full rounded-full bg-muted">
              <div
                className="h-2 rounded-full bg-primary transition-all"
                style={{ width: `${completionPercent}%` }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Completion Checklist</CardTitle>
            <CardDescription>Complete these to make your portfolio shine</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {checks.map((check) => (
                <li key={check.label} className="flex items-center gap-3">
                  {check.done ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground" />
                  )}
                  <span className={check.done ? "text-muted-foreground line-through" : ""}>
                    {check.label}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Jump to common tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="outline" asChild>
              <Link href="/dashboard/projects/new">Add a Project</Link>
            </Button>
            <Button className="w-full justify-start" variant="outline" asChild>
              <Link href="/dashboard/settings">Edit Profile</Link>
            </Button>
            <Button className="w-full justify-start" variant="outline" asChild>
              <Link href="/dashboard/appearance">Customize Appearance</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
