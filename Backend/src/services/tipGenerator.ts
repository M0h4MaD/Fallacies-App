import { z } from "zod";
import { prisma } from "../config/prisma.js";
import { callGemini } from "./geminiCall.js";

const responseSchema = {
  type: "OBJECT",
  properties: { textAr: { type: "STRING" }, textEn: { type: "STRING" } },
  required: ["textAr", "textEn"],
};
const tipOutputSchema = z.object({
  textAr: z.string().min(1),
  textEn: z.string().min(1),
});

const TYPE_INSTRUCTION: Record<string, string> = {
  pro_tip:
    "Write a short, practical one-sentence tip for spotting or avoiding a specific type of flawed reasoning in everyday conversation. Do not name the fallacy explicitly — describe the practical habit.",
  mini_challenge:
    'Write a short example statement that clearly commits a specific logical fallacy, followed by a one-line reveal, format: "<statement>" — fallacy or not? (Yes/No — <short reason>)',
  spot_it:
    "Write ONE short quoted example statement (no reveal, no explanation) that clearly commits a specific logical fallacy — just the quoted line.",
};

export async function generateTipBatch(type: string, count: number) {
  const fallacies = await prisma.fallacy.findMany({
    select: { id: true, nameEn: true, definitionEn: true },
  });
  const created = [];
  for (let i = 0; i < count; i++) {
    const fallacy = fallacies[Math.floor(Math.random() * fallacies.length)];
    const prompt = [
      "You write short reference content for a logic-education app, in both Arabic and English.",
      TYPE_INSTRUCTION[type] ?? TYPE_INSTRUCTION.pro_tip,
      fallacy
        ? `Base it on this fallacy: "${fallacy.nameEn}" — ${fallacy.definitionEn}`
        : "",
      "Rules: entirely fictional/composite if it involves a scenario. Never name or imply a real, identifiable public figure. Never take a real-world political or religious side.",
      "Return natural Arabic (textAr) and natural English (textEn) — equivalent in meaning, not a literal translation.",
    ].join("\n");
    const raw = await callGemini({ userId: null, prompt, responseSchema });
    const parsed = tipOutputSchema.parse(JSON.parse(raw));
    created.push(
      await prisma.tip.create({
        data: {
          type,
          textAr: parsed.textAr,
          textEn: parsed.textEn,
          fallacyId: fallacy?.id,
          isGenerated: true,
        },
      }),
    );
  }
  return created;
}
