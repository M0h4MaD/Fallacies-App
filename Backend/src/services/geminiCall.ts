// backend/src/services/geminiCall.ts (ملف جديد)
// Every Gemini call goes through here: quota-checked, retried with exponential backoff on rate
// limits. Per-function caching (e.g. the question pool) is layered on top by each caller.
import { ai, GEMINI_MODEL, GEMINI_SAFETY_SETTINGS } from "../config/gemini.js";
import { checkAndIncrementQuota } from "./geminiQuota.js";
import { AppError } from "../middleware/errorHandler.js";
import { containsFlaggedContent } from "./profanityCheck.js";

interface CallGeminiOptions {
  userId: string | null;
  prompt: string;
  responseSchema?: object;
  maxRetries?: number;
  timeoutMs?: number; // مهلة زمنية مخصصة للملف (افتراضياً 30 ثانية)
}

export async function callGemini({
  userId,
  prompt,
  responseSchema,
  maxRetries = 3,
}: CallGeminiOptions): Promise<string> {
  if (userId) await checkAndIncrementQuota(userId);

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: prompt,
        config: {
          safetySettings: GEMINI_SAFETY_SETTINGS,
          ...(responseSchema
            ? { responseMimeType: "application/json", responseSchema }
            : {}),
        },
      });
      if (!response.text)
        throw new AppError("Gemini returned an empty response", 502);
      if (containsFlaggedContent(response.text))
        throw new AppError(
          "Generated content failed a safety check — try again.",
          502,
        );
      return response.text;
    } catch (err) {
      const isRateLimit =
        err instanceof Error && /429|rate.?limit/i.test(err.message);
      if (!isRateLimit || attempt === maxRetries) throw err;
      await new Promise((r) => setTimeout(r, 2 ** attempt * 1000)); // 1s, 2s, 4s...
    }
  }
  throw new AppError("Gemini call failed after retries", 502);
}
