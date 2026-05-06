import { z } from "zod";
import { USERNAME_REGEX, RESERVED_USERNAMES, AVAILABILITY_STATUSES, THEMES, FONT_FAMILIES } from "@/lib/constants";

export const usernameSchema = z
  .string()
  .min(3, "Username must be at least 3 characters")
  .max(30, "Username must be at most 30 characters")
  .regex(USERNAME_REGEX, "Username can only contain lowercase letters, numbers, and hyphens")
  .refine(
    (val) => !RESERVED_USERNAMES.includes(val as (typeof RESERVED_USERNAMES)[number]),
    "This username is reserved"
  );

export const profileSchema = z.object({
  fullName: z.string().min(1, "Name is required").max(100),
  headline: z.string().max(200).optional().nullable(),
  bio: z.string().max(5000).optional().nullable(),
  location: z.string().max(100).optional().nullable(),
  pronouns: z.string().max(50).optional().nullable(),
  availabilityStatus: z.enum(AVAILABILITY_STATUSES).optional(),
  availabilityNote: z.string().max(200).optional().nullable(),
});

export const socialLinksSchema = z.object({
  websiteUrl: z.string().url().optional().nullable().or(z.literal("")),
  linkedinUrl: z.string().url().optional().nullable().or(z.literal("")),
  githubUrl: z.string().url().optional().nullable().or(z.literal("")),
  twitterUrl: z.string().url().optional().nullable().or(z.literal("")),
  dribbbleUrl: z.string().url().optional().nullable().or(z.literal("")),
  behanceUrl: z.string().url().optional().nullable().or(z.literal("")),
  youtubeUrl: z.string().url().optional().nullable().or(z.literal("")),
  mediumUrl: z.string().url().optional().nullable().or(z.literal("")),
  devtoUrl: z.string().url().optional().nullable().or(z.literal("")),
  emailPublic: z.string().email().optional().nullable().or(z.literal("")),
  calendarUrl: z.string().url().optional().nullable().or(z.literal("")),
});

export const appearanceSchema = z.object({
  theme: z.enum(THEMES).default("default"),
  accentColor: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Invalid hex color"),
  fontFamily: z.enum(FONT_FAMILIES).default("inter"),
  darkMode: z.boolean().default(false),
  sectionOrder: z.array(z.string()).optional(),
});

export const signupSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});
