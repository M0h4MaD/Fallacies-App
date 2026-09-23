// backend/src/controllers/auth.controller.ts (استبدله كامل)
import type { Response } from "express";
import { prisma } from "../config/prisma.js";
import type { AuthedRequest } from "../middleware/auth.js";
import type { IdentifiedRequest } from "../middleware/identify.js";
import { randomUUID } from "node:crypto";
import { randomGuestName } from "../lib/guestNames.js";
import { Prisma } from '@prisma/client'
import { AppError } from "../middleware/errorHandler.js";

export async function continueAsGuest(req: AuthedRequest, res: Response) {
  const { guestId, displayName, lang } = req.body as { guestId?: string; displayName?: string; lang?: 'ar' | 'en' }
  const finalGuestId = guestId ?? randomUUID()
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      const user = await prisma.user.upsert({
        where: { guestId: finalGuestId },
        update: {},
        create: { guestId: finalGuestId, isGuest: true, displayName: displayName ?? randomGuestName(lang ?? 'ar') },
      })
      res.json(user)
      return
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002' && attempt < 4) continue
      throw err
    }
  }
}

export async function updateDisplayName(req: IdentifiedRequest, res: Response) {
  const { displayName } = req.body as { displayName: string }
  try {
    const user = await prisma.user.update({ where: { id: req.currentUser!.id }, data: { displayName } })
    res.json(user)
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') throw new AppError('This name is already taken', 409)
    throw err
  }
}

export async function registerOrMerge(req: AuthedRequest, res: Response) {
  const supabaseUserId = req.supabaseUser!.id;
  const { guestId } = req.body as { guestId?: string };

  let user = await prisma.user.findUnique({ where: { supabaseUserId } });
  const guest = guestId
    ? await prisma.user.findUnique({ where: { guestId } })
    : null;

  if (!user && guest && !guest.supabaseUserId) {
    user = await prisma.user.update({
      where: { id: guest.id },
      data: {
        supabaseUserId,
        isGuest: false,
        email: req.supabaseUser!.email,
        displayName: req.supabaseUser!.name ?? guest.displayName,
      },
    });
  } else if (!user) {
    user = await prisma.user.create({
      data: {
        supabaseUserId,
        isGuest: false,
        email: req.supabaseUser!.email,
        displayName: req.supabaseUser!.name ?? "User",
      },
    });
  } else if (guest && guest.id !== user.id) {
    user = await prisma.user.update({
      where: { id: user.id },
      data: {
        xp: user.xp + guest.xp,
        badgeIds: Array.from(new Set([...user.badgeIds, ...guest.badgeIds])),
        streakCurrent: Math.max(user.streakCurrent, guest.streakCurrent),
        streakLongest: Math.max(user.streakLongest, guest.streakLongest),
      },
    });
    await prisma.user.delete({ where: { id: guest.id } });
  }
  res.json(user);
}

export async function getMe(req: IdentifiedRequest, res: Response) {
  res.json(req.currentUser);
}
