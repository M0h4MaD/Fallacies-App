import { ai, GEMINI_MODEL, GEMINI_SAFETY_SETTINGS } from "../config/gemini.js";
import { checkAndIncrementQuota } from "./geminiQuota.js";
import { AppError } from "../middleware/errorHandler.js";
import { containsFlaggedContent } from "./profanityCheck.js";

interface CallGeminiOptions {
  userId: string | null;
  prompt: string;
  responseSchema?: object;
  maxRetries?: number;
  timeoutMs?: number;
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
      await new Promise((r) => setTimeout(r, 2 ** attempt * 1000));
    }
  }
  throw new AppError("Gemini call failed after retries", 502);
}
