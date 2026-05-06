import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();

  if (!authUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { supabaseId: authUser.id },
    include: {
      projects: { include: { media: true, techStack: true } },
      experiences: true,
      education: true,
      skills: true,
      certifications: true,
      publications: true,
      testimonials: true,
      customSections: { include: { items: true } },
      socialLinks: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({
    exportedAt: new Date().toISOString(),
    version: "1.0",
    data: user,
  });
}
