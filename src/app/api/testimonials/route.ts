import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { testimonialSchema } from "@/lib/validations/testimonial";
import { sendEmail } from "@/lib/email/send";
import { testimonialRequestEmail } from "@/lib/email/templates";
import type { ApiResponse } from "@/types";
import crypto from "crypto";

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

  const testimonials = await prisma.testimonial.findMany({
    where: { userId: user.id },
    orderBy: { sortOrder: "asc" },
  });

  return NextResponse.json<ApiResponse<typeof testimonials>>({ data: testimonials, error: null });
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

  if (body.requestEmail) {
    const token = crypto.randomUUID();
    const testimonial = await prisma.testimonial.create({
      data: {
        userId: user.id,
        authorName: body.recipientName || "Pending",
        content: "",
        requestEmail: body.requestEmail,
        requestStatus: "pending",
        requestToken: token,
      },
    });

    const dbUser = await prisma.user.findUnique({ where: { id: user.id }, select: { fullName: true, username: true } });
    const formUrl = `${process.env.NEXT_PUBLIC_APP_URL}/testimonial/${token}`;
    const emailContent = testimonialRequestEmail(
      dbUser?.fullName || "Someone",
      body.recipientName || "there",
      formUrl
    );
    await sendEmail({ to: body.requestEmail, ...emailContent });

    return NextResponse.json<ApiResponse<typeof testimonial>>({ data: testimonial, error: null }, { status: 201 });
  }

  const result = testimonialSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json<ApiResponse<null>>(
      { data: null, error: { message: "Validation failed", code: "VALIDATION_ERROR" } },
      { status: 400 }
    );
  }

  const testimonial = await prisma.testimonial.create({
    data: {
      ...result.data,
      userId: user.id,
      requestStatus: "received",
    },
  });

  return NextResponse.json<ApiResponse<typeof testimonial>>({ data: testimonial, error: null }, { status: 201 });
}
