// backend/src/validation/debater.schema.ts (استبدله كامل)
import { z } from "zod";
export const debaterTurnSchema = z.object({
  history: z
    .array(
      z.object({
        speaker: z.enum(["user", "opponent"]),
        text: z.string().min(1).max(1000),
      }),
    )
    .max(20),
  lang: z.enum(["ar", "en"]).default("ar"),
  preferredContext: z
    .enum(["political", "religious", "media", "everyday"])
    .optional(),
  difficulty: z
    .enum(["beginner", "intermediate", "advanced"])
    .default("beginner"),
  usedFallacySlugs: z.array(z.string()).max(50).default([]),
});
