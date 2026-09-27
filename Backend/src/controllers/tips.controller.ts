// backend/src/controllers/tips.controller.ts (ملف جديد)
import type { Request, Response } from "express";
import { prisma } from "../config/prisma.js";
import { asOptionalString } from "../lib/params.js";

export async function getRandomTip(req: Request, res: Response) {
  const type = asOptionalString(req.query.type);
  const fallacySlug = asOptionalString(req.query.fallacySlug);
  const where: { type?: string; fallacyId?: string } = {};
  if (type) where.type = type;
  if (fallacySlug) {
    const fallacy = await prisma.fallacy.findUnique({
      where: { slug: fallacySlug },
      select: { id: true },
    });
    if (fallacy) where.fallacyId = fallacy.id;
  }

  let count = await prisma.tip.count({ where });
  let finalWhere = where;
  if (count === 0) {
    finalWhere = {};
    count = await prisma.tip.count();
  } // fallback بدل شاشة فاضية

  if (count === 0) {
    res.json(null);
    return;
  }
  const skip = Math.floor(Math.random() * count);
  const [tip] = await prisma.tip.findMany({ where: finalWhere, take: 1, skip });
  res.json(tip);
}
export async function getDailyTip(_req: Request, res: Response) {
  const totalCount = await prisma.tip.count();
  if (totalCount === 0) {
    res.json(null);
    return;
  }
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) /
      86_400_000,
  );
  const [tip] = await prisma.tip.findMany({
    orderBy: { createdAt: "asc" },
    take: 1,
    skip: dayOfYear % totalCount,
  });
  res.json(tip);
}
