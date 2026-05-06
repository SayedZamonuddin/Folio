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

export async function GET() {
  const user = await getUser();
  if (!user) {
    return NextResponse.json<ApiResponse<null>>(
      { data: null, error: { message: "Unauthorized", code: "UNAUTHORIZED" } },
      { status: 401 }
    );
  }

  const education = await prisma.education.findMany({
    where: { userId: user.id },
    orderBy: { sortOrder: "asc" },
  });

  return NextResponse.json<ApiResponse<typeof education>>({ data: education, error: null });
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
  const result = educationSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json<ApiResponse<null>>(
      { data: null, error: { message: "Validation failed", code: "VALIDATION_ERROR" } },
      { status: 400 }
    );
  }

  const { startDate, endDate, ...rest } = result.data;

  const education = await prisma.education.create({
    data: {
      ...rest,
      userId: user.id,
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : null,
    },
  });

  return NextResponse.json<ApiResponse<typeof education>>({ data: education, error: null }, { status: 201 });
}
