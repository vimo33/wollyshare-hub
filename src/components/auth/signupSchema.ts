import * as z from "zod";

export const signupSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
  username: z
    .string()
    .min(2, { message: "Username must be at least 2 characters" }),
  fullName: z
    .string()
    .min(2, { message: "Full name must be at least 2 characters" }),
  location: z.string().optional(),
  telegramId: z.string().optional(),
  telegramUsername: z.string().optional(),
});

export type SignupFormValues = z.infer<typeof signupSchema>;
