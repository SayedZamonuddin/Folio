import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { projectSchema } from "@/lib/validations/project";
import type { ApiResponse } from "@/types";

async function getUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  return prisma.user.findUnique({ where: { supabaseId: user.id }, select: { id: true } });
}

export async function GET() {
  const user = await getUser();
  if (!user) {
    return NextResponse.json<ApiResponse<null>>(
      { data: null, error: { message: "Unauthorized", code: "UNAUTHORIZED" } },
      { status: 401 }
    );
  }

  const projects = await prisma.project.findMany({
    where: { userId: user.id },
    include: { media: true, techStack: true },
    orderBy: { sortOrder: "asc" },
  });

  return NextResponse.json<ApiResponse<typeof projects>>({ data: projects, error: null });
}

export async function POST(request: Request) {
  const user = await getUser();
  if (!user) {
    return NextResponse.json<ApiResponse<null>>(
      { data: null, error: { message: "Unauthorized", code: "UNAUTHORIZED" } },
      { status: 401 }
    );
  }

  const body = await request.json();
  const result = projectSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json<ApiResponse<null>>(
      { data: null, error: { message: "Validation failed", code: "VALIDATION_ERROR" } },
      { status: 400 }
    );
  }

  const { startDate, endDate, ...rest } = result.data;

  const project = await prisma.project.create({
    data: {
      ...rest,
      userId: user.id,
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null,
    },
  });

  return NextResponse.json<ApiResponse<typeof project>>({ data: project, error: null }, { status: 201 });
}
