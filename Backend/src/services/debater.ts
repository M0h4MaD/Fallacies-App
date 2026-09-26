// backend/src/services/debater.ts (استبدله كامل)
import { z } from "zod";
import { callGemini } from "./geminiCall.js";
import { wrapUserText } from "./promptSafety.js";
import type { ExampleContext, Difficulty } from "@prisma/client";

interface DebaterTurn {
  speaker: "user" | "opponent";
  text: string;
}

const responseSchema = {
  type: "OBJECT",
  properties: {
    message: { type: "STRING" },
    fallacyUsedSlug: { type: "STRING" },
  },
  required: ["message", "fallacyUsedSlug"],
};
const debaterOutputSchema = z.object({
  message: z.string().min(1),
  fallacyUsedSlug: z.string().min(1),
});

const SCENE_TEMPLATES: Record<ExampleContext, string> = {
  political:
    "a city/governorate council meeting or a candidates' debate — establish the setting, the general role the user and the opponent hold (e.g. council member, advisor, candidate), the specific policy topic under discussion, and that opinions are split between a supporting and an opposing side",
  religious:
    "a religious study circle or community gathering — establish the setting and the general roles present. Keep it a generic composite scene — never a specific real religion, denomination, sect, cleric, or quoted scripture",
  media:
    "a live TV or radio interview or panel discussion — establish the setting, the roles, and the topic under discussion",
  everyday:
    "a family or friends gathering — establish the setting, who else is present, and the everyday topic being discussed",
};
const DIFFICULTY_INSTRUCTION: Record<Difficulty, string> = {
  beginner: "Make the fallacy explicit and easy to recognize.",
  intermediate:
    "Make the fallacy present but woven into an otherwise-reasonable-sounding argument.",
  advanced:
    "Make the fallacy subtle — buried in a longer, more sophisticated argument that mostly sounds reasonable.",
};

export async function generateDebaterTurn(
  userId: string,
  availableFallacies: { slug: string; nameEn: string; definitionEn: string }[],
  history: DebaterTurn[],
  lang: "ar" | "en",
  preferredContext: ExampleContext | undefined,
  difficulty: Difficulty = "beginner",
  usedFallacySlugs: string[] = [],
) {
  let candidateFallacies = availableFallacies.filter(
    (f) => !usedFallacySlugs.includes(f.slug),
  );
  if (candidateFallacies.length === 0) candidateFallacies = availableFallacies; // كلهن استخدموا — إعادة سماح بدل توقف

  const fallacyList = candidateFallacies
    .map((f) => `- ${f.slug}: ${f.nameEn} (${f.definitionEn})`)
    .join("\n");
  const transcript = history
    .map((h) => `${h.speaker === "user" ? "User" : "Opponent"}: ${h.text}`)
    .join("\n");
  const isOpening = history.length === 0;
  const lastUserMessage = [...history]
    .reverse()
    .find((h) => h.speaker === "user")?.text;

  const openingInstruction = [
    `This is the opening message. First, vividly set a specific scene: ${SCENE_TEMPLATES[preferredContext ?? "everyday"]}.`,
    "Make the narrative concrete — never name a real place, organization, or person.",
    `Then respond with a fallacious statement reacting to the idea you imply the user just presented. ${DIFFICULTY_INSTRUCTION[difficulty]}`,
  ].join(" ");

  const continuingInstruction = [
    "This is a continuing turn. Stay inside the exact same scene, characters, and topic established at the start — never jump to an unrelated scenario.",
    lastUserMessage
      ? `Directly respond to this exact point the user just made: "${lastUserMessage}" — reference or paraphrase it before pivoting to your fallacious rebuttal, so it reads as a real back-and-forth, not a generic reply.`
      : "",
    "Keep a consistent tone and attitude toward the user across turns — never personally attack them in one turn and then flatter them in the next with no narrative reason for the shift.",
    DIFFICULTY_INSTRUCTION[difficulty],
  ]
    .filter(Boolean)
    .join(" ");

  const prompt = [
    'You are "Opponent" in a friendly debate-practice chat — a fictional generic persona, never a real named public figure.',
    "On this turn, commit exactly one fallacy from this list (never one outside it):",
    fallacyList,
    isOpening ? openingInstruction : continuingInstruction,
    "Keep your message to 2-4 sentences, never taking a real-world side or naming real entities.",
    `Respond in ${lang === "ar" ? "Arabic" : "English"}.`,
    "Return the fallacy slug you used in fallacyUsedSlug — hidden from the user, used only for scoring.",
    transcript
      ? wrapUserText("the conversation so far", transcript)
      : "(This is the opening message — start the debate.)",
  ].join("\n");

  const raw = await callGemini({ userId, prompt, responseSchema });
  const parsed = debaterOutputSchema.parse(JSON.parse(raw));
  if (!candidateFallacies.some((f) => f.slug === parsed.fallacyUsedSlug))
    parsed.fallacyUsedSlug = candidateFallacies[0].slug;
  return parsed;
}
