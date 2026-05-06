import { z } from "zod";

export const educationSchema = z.object({
  institution: z.string().min(1, "Institution is required").max(200),
  institutionUrl: z.string().url().optional().nullable().or(z.literal("")),
  degree: z.string().min(1, "Degree is required").max(100),
  field: z.string().max(100).optional().nullable(),
  description: z.string().max(5000).optional().nullable(),
  grade: z.string().max(50).optional().nullable(),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional().nullable(),
  activities: z.array(z.string()).default([]),
});
