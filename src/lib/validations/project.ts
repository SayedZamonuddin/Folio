import { z } from "zod";

export const projectSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  summary: z.string().max(500).optional().nullable(),
  role: z.string().max(100).optional().nullable(),
  category: z.string().max(50).optional().nullable(),
  teamSize: z.string().max(20).optional().nullable(),
  duration: z.string().max(50).optional().nullable(),
  startDate: z.string().optional().nullable(),
  endDate: z.string().optional().nullable(),
  liveUrl: z.string().url().optional().nullable().or(z.literal("")),
  sourceUrl: z.string().url().optional().nullable().or(z.literal("")),
  caseStudyUrl: z.string().url().optional().nullable().or(z.literal("")),
  tags: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  status: z.enum(["draft", "published"]).default("published"),
  problemStatement: z.string().max(10000).optional().nullable(),
  process: z.string().max(10000).optional().nullable(),
  outcome: z.string().max(10000).optional().nullable(),
  content: z.string().max(50000).optional().nullable(),
});

export const projectReorderSchema = z.object({
  ids: z.array(z.string().uuid()),
});
