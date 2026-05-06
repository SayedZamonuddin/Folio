import { z } from "zod";

export const testimonialSchema = z.object({
  authorName: z.string().min(1, "Author name is required").max(100),
  authorRole: z.string().max(200).optional().nullable(),
  authorUrl: z.string().url().optional().nullable().or(z.literal("")),
  content: z.string().min(1, "Content is required").max(2000),
  relationship: z.string().max(50).optional().nullable(),
  featured: z.boolean().default(false),
});

export const testimonialRequestSchema = z.object({
  recipientName: z.string().min(1, "Name is required").max(100),
  recipientEmail: z.string().email("Valid email is required"),
  relationship: z.string().max(100).optional().nullable(),
});

export const testimonialSubmitSchema = z.object({
  content: z.string().min(1, "Please write your testimonial").max(2000),
  authorName: z.string().min(1, "Name is required").max(100),
  authorRole: z.string().max(200).optional().nullable(),
  relationship: z.string().max(50).optional().nullable(),
});
