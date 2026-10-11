import { z } from "zod";

export const guestSchema = z.object({
  guestId: z.string().min(1).optional(),
  displayName: z.string().min(1).max(60).optional(),
  lang: z.enum(["ar", "en"]).optional(),
});

export const registerSchema = z.object({
  guestId: z.string().min(1).optional(),
});

export const updateNameSchema = z.object({ displayName: z.string().min(1).max(60) })
