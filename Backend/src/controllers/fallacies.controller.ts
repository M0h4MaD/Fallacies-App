// backend/src/controllers/fallacies.controller.ts (استبدله كامل)
import type { Request, Response } from "express";
import { prisma } from "../config/prisma.js";
import { AppError } from "../middleware/errorHandler.js";
import { unlockedFallacyCount } from "../services/unlock.js";
import type { IdentifiedRequest } from '../middleware/identify.js'
import { asString } from '../lib/params.js'

export async function listFallacies(_req: Request, res: Response) {
  res.json(
    await prisma.fallacy.findMany({
      orderBy: [{ difficulty: "asc" }, { nameEn: "asc" }],
    }),
  );
}
export async function getFallacy(req: Request, res: Response) {
  const fallacy = await prisma.fallacy.findUnique({
    where: { slug: asString(req.params.slug) },
    include: { examples: true },
  });
  if (!fallacy) throw new AppError("Fallacy not found", 404);
  res.json(fallacy);
}
export async function createFallacy(req: Request, res: Response) {
  res.status(201).json(await prisma.fallacy.create({ data: req.body }));
}
export async function updateFallacy(req: Request, res: Response) {
  try {
    res.json(
      await prisma.fallacy.update({
        where: { slug: asString(req.params.slug) },
        data: req.body,
      }),
    );
  } catch {
    throw new AppError("Fallacy not found", 404);
  }
}
export async function deleteFallacy(req: Request, res: Response) {
  try {
    await prisma.fallacy.delete({ where: { slug: asString(req.params.slug) } });
    res.status(204).send();
  } catch {
    throw new AppError("Fallacy not found", 404);
  }
}

export async function listUnlockedFallacies(req: IdentifiedRequest, res: Response) {
  const user = req.currentUser!
  if (!user) throw new AppError("User not found", 404);

  const all = await prisma.fallacy.findMany({
    orderBy: [{ difficulty: "asc" }, { nameEn: "asc" }],
  });
  const count = unlockedFallacyCount(user.level, all.length);
  res.json(all.slice(0, count));
}
