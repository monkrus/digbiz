import { z } from "zod";

export const emailSchema = z.string().trim().email("Enter a valid email");
export const passwordSchema = z.string().min(6, "Min 6 characters");

export const signInSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const signUpSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  confirm: z.string().min(6),
}).refine((v) => v.password === v.confirm, {
  message: "Passwords do not match",
  path: ["confirm"],
});

export type SignInInput = z.infer<typeof signInSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
