import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { educationSchema } from "@/lib/validations/education";
import type { ApiResponse } from "@/types";

async function getUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  return prisma.user.findUnique({ where: { supabaseId: user.id }, select: { id: true } });
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
  const result = educationSchema.partial().safeParse(body);

  if (!result.success) {
    return NextResponse.json<ApiResponse<null>>(
      { data: null, error: { message: "Validation failed", code: "VALIDATION_ERROR" } },
      { status: 400 }
    );
  }

  const { startDate, endDate, ...rest } = result.data;
  const updateData: Record<string, unknown> = { ...rest };
  if (startDate !== undefined) updateData.startDate = new Date(startDate);
  if (endDate !== undefined) updateData.endDate = endDate ? new Date(endDate) : null;

  const updated = await prisma.education.updateMany({
    where: { id, userId: user.id },
    data: updateData,
  });

  if (updated.count === 0) {
    return NextResponse.json<ApiResponse<null>>(
      { data: null, error: { message: "Not found", code: "NOT_FOUND" } },
      { status: 404 }
    );
  }

  const education = await prisma.education.findUnique({ where: { id } });
  return NextResponse.json<ApiResponse<typeof education>>({ data: education, error: null });
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
  const deleted = await prisma.education.deleteMany({ where: { id, userId: user.id } });

  if (deleted.count === 0) {
    return NextResponse.json<ApiResponse<null>>(
      { data: null, error: { message: "Not found", code: "NOT_FOUND" } },
      { status: 404 }
    );
  }

  return NextResponse.json<ApiResponse<{ success: true }>>({ data: { success: true }, error: null });
}
