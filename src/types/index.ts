export type ApiResponse<T> = {
  data: T | null;
  error: { message: string; code: string; details?: Record<string, string[]> } | null;
};

export type Theme = "default" | "minimal" | "bold" | "editorial";
export type FontFamily = "inter" | "playfair" | "jetbrains-mono" | "dm-sans";
export type AvailabilityStatus = "open_to_work" | "freelancing" | "employed" | "not_specified";

export type ProjectStatus = "draft" | "published";
export type TestimonialRequestStatus = "pending" | "received" | "approved" | "rejected";
