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

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUser();
  if (!user) {
    return NextResponse.json<ApiResponse<null>>(
      { data: null, error: { message: "Unauthorized", code: "UNAUTHORIZED" } },
      { status: 401 }
    );
  }

  const { id } = await params;
  const project = await prisma.project.findFirst({
    where: { id, userId: user.id },
    include: { media: true, techStack: true },
  });

  if (!project) {
    return NextResponse.json<ApiResponse<null>>(
      { data: null, error: { message: "Not found", code: "NOT_FOUND" } },
      { status: 404 }
    );
  }

  return NextResponse.json<ApiResponse<typeof project>>({ data: project, error: null });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUser();
  if (!user) {
    return NextResponse.json<ApiResponse<null>>(
      { data: null, error: { message: "Unauthorized", code: "UNAUTHORIZED" } },
      { status: 401 }
    );
  }

  const { id } = await params;
  const body = await request.json();
  const result = projectSchema.partial().safeParse(body);

  if (!result.success) {
    return NextResponse.json<ApiResponse<null>>(
      { data: null, error: { message: "Validation failed", code: "VALIDATION_ERROR" } },
      { status: 400 }
    );
  }

  const { startDate, endDate, ...rest } = result.data;
  const updateData: Record<string, unknown> = { ...rest };
  if (startDate !== undefined) updateData.startDate = startDate ? new Date(startDate) : null;
  if (endDate !== undefined) updateData.endDate = endDate ? new Date(endDate) : null;

  const project = await prisma.project.updateMany({
    where: { id, userId: user.id },
    data: updateData,
  });

  if (project.count === 0) {
    return NextResponse.json<ApiResponse<null>>(
      { data: null, error: { message: "Not found", code: "NOT_FOUND" } },
      { status: 404 }
    );
  }

  const updated = await prisma.project.findUnique({ where: { id } });
  return NextResponse.json<ApiResponse<typeof updated>>({ data: updated, error: null });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUser();
  if (!user) {
    return NextResponse.json<ApiResponse<null>>(
      { data: null, error: { message: "Unauthorized", code: "UNAUTHORIZED" } },
      { status: 401 }
    );
  }

  const { id } = await params;
  const deleted = await prisma.project.deleteMany({
    where: { id, userId: user.id },
  });

  if (deleted.count === 0) {
    return NextResponse.json<ApiResponse<null>>(
      { data: null, error: { message: "Not found", code: "NOT_FOUND" } },
      { status: 404 }
    );
  }

  return NextResponse.json<ApiResponse<{ success: true }>>({ data: { success: true }, error: null });
}
