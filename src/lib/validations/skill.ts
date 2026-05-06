import { z } from "zod";

export const skillSchema = z.object({
  name: z.string().min(1, "Skill name is required").max(100),
  category: z.string().min(1, "Category is required").max(50),
  proficiency: z.number().min(1).max(5).optional().nullable(),
  yearsOfExp: z.number().min(0).max(50).optional().nullable(),
});
