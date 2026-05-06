import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import type { ApiResponse } from "@/types";

async function getUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  return prisma.user.findUnique({ where: { supabaseId: user.id }, select: { id: true } });
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
  const deleted = await prisma.customSection.deleteMany({ where: { id, userId: user.id } });

  if (deleted.count === 0) {
    return NextResponse.json<ApiResponse<null>>(
      { data: null, error: { message: "Not found", code: "NOT_FOUND" } },
      { status: 404 }
    );
  }

  return NextResponse.json<ApiResponse<{ success: true }>>({ data: { success: true }, error: null });
}
