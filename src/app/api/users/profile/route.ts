import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { profileSchema, socialLinksSchema } from "@/lib/validations/user";
import type { ApiResponse } from "@/types";

async function getAuthUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function GET() {
  const authUser = await getAuthUser();
  if (!authUser) {
    return NextResponse.json<ApiResponse<null>>(
      { data: null, error: { message: "Unauthorized", code: "UNAUTHORIZED" } },
      { status: 401 }
    );
  }

  const user = await prisma.user.findUnique({
    where: { supabaseId: authUser.id },
    include: { socialLinks: true },
  });

  if (!user) {
    return NextResponse.json<ApiResponse<null>>(
      { data: null, error: { message: "User not found", code: "NOT_FOUND" } },
      { status: 404 }
    );
  }

  return NextResponse.json<ApiResponse<typeof user>>({ data: user, error: null });
}

export async function POST(request: Request) {
  const authUser = await getAuthUser();
  if (!authUser) {
    return NextResponse.json<ApiResponse<null>>(
      { data: null, error: { message: "Unauthorized", code: "UNAUTHORIZED" } },
      { status: 401 }
    );
  }

  const body = await request.json();

  const user = await prisma.user.create({
    data: {
      supabaseId: authUser.id,
      email: authUser.email!,
      username: body.username,
      fullName: body.fullName,
      headline: body.headline || null,
      bio: body.bio || null,
      theme: body.theme || "default",
      accentColor: body.accentColor || "#2563eb",
    },
  });

  return NextResponse.json<ApiResponse<typeof user>>({ data: user, error: null }, { status: 201 });
}

export async function PATCH(request: Request) {
  const authUser = await getAuthUser();
  if (!authUser) {
    return NextResponse.json<ApiResponse<null>>(
      { data: null, error: { message: "Unauthorized", code: "UNAUTHORIZED" } },
      { status: 401 }
    );
  }

  const body = await request.json();

  const profileResult = profileSchema.partial().safeParse(body);
  const socialResult = socialLinksSchema.partial().safeParse(body);

  const updateData: Record<string, unknown> = {};

  if (profileResult.success) {
    Object.assign(updateData, profileResult.data);
  }
  if (socialResult.success) {
    Object.assign(updateData, socialResult.data);
  }

  if (body.avatarUrl !== undefined) updateData.avatarUrl = body.avatarUrl;
  if (body.coverImageUrl !== undefined) updateData.coverImageUrl = body.coverImageUrl;
  if (body.resumeUrl !== undefined) updateData.resumeUrl = body.resumeUrl;
  if (body.showResume !== undefined) updateData.showResume = body.showResume;
  if (body.isPublic !== undefined) updateData.isPublic = body.isPublic;

  const user = await prisma.user.update({
    where: { supabaseId: authUser.id },
    data: updateData,
  });

  return NextResponse.json<ApiResponse<typeof user>>({ data: user, error: null });
}
