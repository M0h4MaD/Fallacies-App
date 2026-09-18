// backend/src/services/questionGenerator.ts (ملف جديد)
import { z } from "zod";
import { prisma } from "../config/prisma.js";
import { callGemini } from "./geminiCall.js";
import type { Difficulty, QuizMode } from "@prisma/client";

const responseSchema = {
  type: "OBJECT",
  properties: {
    textAr: { type: "STRING" },
    textEn: { type: "STRING" },
    contextType: {
      type: "STRING",
      enum: ["political", "religious", "media", "everyday"],
    },
  },
  required: ["textAr", "textEn", "contextType"],
};

// Validate Gemini's output before it ever reaches the DB — an LLM's JSON is still untrusted
// external input, structured-output mode reduces malformed responses but doesn't guarantee them.
const geminiOutputSchema = z.object({
  textAr: z.string().min(1),
  textEn: z.string().min(1),
  contextType: z.enum(["political", "religious", "media", "everyday"]),
});

function buildPrompt(
  nameEn: string,
  definitionEn: string,
  difficulty: Difficulty,
  mode: QuizMode,
): string {
  const difficultyInstruction: Record<Difficulty, string> = {
    beginner:
      "Make the fallacy explicit and easy to spot — clear, textbook phrasing.",
    intermediate:
      "Make the fallacy present but slightly less obvious, with more surrounding context.",
    advanced:
      "Make the fallacy subtle — mixed with otherwise-valid reasoning, longer context, natural non-textbook phrasing.",
  };
  const modeInstruction: Record<QuizMode, string> = {
    scenario:
      'Write a short two-line dialogue between "Speaker A" and "Speaker B" (never a real named person) where one of them commits the fallacy.',
    correction:
      "Write a single flawed sentence or short paragraph, as if written by an anonymous person, that commits the fallacy and needs correcting.",
  };
  return [
    "You write short, original example content for a logic-education app, in both Arabic and English.",
    `Target fallacy: "${nameEn}" — ${definitionEn}`,
    `Difficulty: ${difficulty}. ${difficultyInstruction[difficulty]}`,
    `Format: ${modeInstruction[mode]}`,
    "Rules: entirely fictional and composite. NEVER name or clearly imply a real, identifiable public figure, politician, or organization. Keep the topic generically political/religious/media/everyday, never taking a real-world side.",
    "Return natural, idiomatic Arabic (textAr) and natural English (textEn) — equivalent in meaning and fallacy content, not a literal translation.",
    "Also return contextType matching what you wrote.",
  ].join("\n");
}

export async function generateQuestionBatch(
  fallacyId: string,
  difficultyTier: Difficulty,
  mode: QuizMode,
  count = 3,
) {
  const fallacy = await prisma.fallacy.findUniqueOrThrow({
    where: { id: fallacyId },
  });
  const created = [];
  for (let i = 0; i < count; i++) {
    const prompt = buildPrompt(
      fallacy.nameEn,
      fallacy.definitionEn,
      difficultyTier,
      mode,
    );
    const raw = await callGemini({ userId: null, prompt, responseSchema });
    const parsed = geminiOutputSchema.parse(JSON.parse(raw));
    created.push(
      await prisma.generatedQuestion.create({
        data: { fallacyId, difficultyTier, mode, ...parsed },
      }),
    );
    if (i < count - 1) await new Promise((r) => setTimeout(r, 6500)) // نضل تحت سقف 10 طلبات/دقيقة
  }
  return created;
}
