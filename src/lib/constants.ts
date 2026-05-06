export const RESERVED_USERNAMES = [
  "api",
  "admin",
  "dashboard",
  "settings",
  "login",
  "signup",
  "app",
  "www",
  "help",
  "support",
  "about",
  "blog",
  "pricing",
  "docs",
  "status",
  "null",
  "undefined",
  "onboarding",
  "features",
  "export",
  "import",
  "analytics",
  "media",
  "projects",
  "experience",
  "education",
  "skills",
  "certifications",
  "publications",
  "testimonials",
  "sections",
  "appearance",
  "preview",
] as const;

export const USERNAME_REGEX = /^[a-z0-9][a-z0-9-]{1,28}[a-z0-9]$/;

export const FILE_LIMITS = {
  image: 10 * 1024 * 1024, // 10 MB
  document: 15 * 1024 * 1024, // 15 MB
  video: 50 * 1024 * 1024, // 50 MB
  audio: 20 * 1024 * 1024, // 20 MB
  other: 20 * 1024 * 1024, // 20 MB
} as const;

export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
] as const;

export const THEMES = ["default", "minimal", "bold", "editorial"] as const;
export const FONT_FAMILIES = ["inter", "playfair", "jetbrains-mono", "dm-sans"] as const;

export const AVAILABILITY_STATUSES = [
  "open_to_work",
  "freelancing",
  "employed",
  "not_specified",
] as const;

export const EMPLOYMENT_TYPES = [
  "Full-time",
  "Part-time",
  "Contract",
  "Freelance",
  "Internship",
] as const;

export const PROJECT_CATEGORIES = [
  "Web App",
  "Mobile App",
  "Design System",
  "Research Paper",
  "Open Source",
  "Other",
] as const;
