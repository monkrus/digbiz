// lib/validators/profile.ts
import { z } from "zod";

/**
 * Schema for user profile / business card
 */
export const profileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  title: z.string().optional(),
  company: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email("Invalid email address").optional(),
  website: z.string().url("Invalid URL").optional().or(z.literal("")),
  linkedin: z.string().url("Invalid LinkedIn URL").optional().or(z.literal("")),
  twitter: z.string().url("Invalid Twitter URL").optional().or(z.literal("")),
  logoUrl: z.string().url("Invalid logo URL").optional().or(z.literal("")),
});

export type ProfileInput = z.infer<typeof profileSchema>;
