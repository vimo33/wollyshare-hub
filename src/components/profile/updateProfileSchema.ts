
import * as z from "zod";

export const updateProfileSchema = z.object({
  username: z.string().min(3, { message: "Username must be at least 3 characters" }),
  fullName: z.string().min(2, { message: "Full name is required" }),
  location: z.string().optional(),
  telegram_id: z.string().optional(),
});

export type UpdateProfileFormValues = z.infer<typeof updateProfileSchema>;
