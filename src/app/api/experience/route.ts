import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { experienceSchema } from "@/lib/validations/experience";
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

  const experiences = await prisma.experience.findMany({
    where: { userId: user.id },
    orderBy: { sortOrder: "asc" },
  });

  return NextResponse.json<ApiResponse<typeof experiences>>({ data: experiences, error: null });
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
  const result = experienceSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json<ApiResponse<null>>(
      { data: null, error: { message: "Validation failed", code: "VALIDATION_ERROR" } },
      { status: 400 }
    );
  }

  const { startDate, endDate, ...rest } = result.data;

  const experience = await prisma.experience.create({
    data: {
      ...rest,
      userId: user.id,
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : null,
    },
  });

  return NextResponse.json<ApiResponse<typeof experience>>({ data: experience, error: null }, { status: 201 });
}
