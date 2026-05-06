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

  try {
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
  } catch (err: unknown) {
    console.error("[POST /api/users/profile]", err);

    let message = "Something went wrong. Please try again.";
    let status = 500;

    if (err && typeof err === "object" && "code" in err) {
      const prismaErr = err as { code: string; meta?: { target?: string[] } };
      if (prismaErr.code === "P2002") {
        const field = prismaErr.meta?.target?.[0];
        if (field === "username") {
          message = "This username is already taken. Please choose a different one.";
        } else if (field === "email") {
          message = "An account with this email already exists.";
        } else {
          message = "This information is already in use. Please try different values.";
        }
        status = 409;
      }
    }

    return NextResponse.json<ApiResponse<null>>(
      { data: null, error: { message, code: "CREATE_FAILED" } },
      { status }
    );
  }
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

  try {
    const user = await prisma.user.update({
      where: { supabaseId: authUser.id },
      data: updateData,
    });

    return NextResponse.json<ApiResponse<typeof user>>({ data: user, error: null });
  } catch (err: unknown) {
    console.error("[PATCH /api/users/profile]", err);
    return NextResponse.json<ApiResponse<null>>(
      { data: null, error: { message: "Failed to update profile. Please try again.", code: "UPDATE_FAILED" } },
      { status: 500 }
    );
  }
}
