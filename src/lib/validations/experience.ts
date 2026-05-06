import { z } from "zod";

export const experienceSchema = z.object({
  company: z.string().min(1, "Company is required").max(200),
  companyUrl: z.string().url().optional().nullable().or(z.literal("")),
  role: z.string().min(1, "Role is required").max(200),
  employmentType: z.string().optional().nullable(),
  description: z.string().max(5000).optional().nullable(),
  location: z.string().max(100).optional().nullable(),
  locationType: z.enum(["On-site", "Remote", "Hybrid"]).optional().nullable(),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional().nullable(),
  tags: z.array(z.string()).default([]),
});
