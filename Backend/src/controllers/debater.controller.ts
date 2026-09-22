// backend/src/controllers/debater.controller.ts (ملف جديد)
import type { Response } from "express";
import { prisma } from "../config/prisma.js";
import type { IdentifiedRequest } from "../middleware/identify.js";
import { generateDebaterTurn } from "../services/debater.js";
import { unlockedFallacyCount } from "../services/unlock.js";
import { ExampleContext } from "@prisma/client";

export async function debaterTurn(req: IdentifiedRequest, res: Response) {
  const { history, lang, preferredContext } = req.body as {
    history: Array<{ speaker: "user" | "opponent"; text: string }>;
    lang: "ar" | "en";
    preferredContext?: ExampleContext;
  };
  const user = req.currentUser!;
  const all = await prisma.fallacy.findMany({
    orderBy: [{ difficulty: "asc" }, { nameEn: "asc" }],
  });
  const unlocked = all.slice(0, unlockedFallacyCount(user.level, all.length));
  res.json(
    await generateDebaterTurn(
      user.id,
      unlocked,
      history,
      lang,
      preferredContext,
    ),
  );
}
