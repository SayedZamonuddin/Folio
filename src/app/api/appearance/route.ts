import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { appearanceSchema } from "@/lib/validations/user";
import type { ApiResponse } from "@/types";

export async function PATCH(request: Request) {
  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();

  if (!authUser) {
    return NextResponse.json<ApiResponse<null>>(
      { data: null, error: { message: "Unauthorized", code: "UNAUTHORIZED" } },
      { status: 401 }
    );
  }

  const body = await request.json();
  const result = appearanceSchema.partial().safeParse(body);

  if (!result.success) {
    return NextResponse.json<ApiResponse<null>>(
      { data: null, error: { message: "Validation failed", code: "VALIDATION_ERROR" } },
      { status: 400 }
    );
  }

  try {
    const user = await prisma.user.update({
      where: { supabaseId: authUser.id },
      data: result.data,
    });

    return NextResponse.json<ApiResponse<typeof user>>({ data: user, error: null });
  } catch (err) {
    console.error("[PATCH /api/appearance]", err);
    return NextResponse.json<ApiResponse<null>>(
      { data: null, error: { message: "Failed to save appearance. Please try again.", code: "UPDATE_FAILED" } },
      { status: 500 }
    );
  }
}
