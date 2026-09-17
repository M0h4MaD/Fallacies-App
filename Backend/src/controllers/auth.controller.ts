// backend/src/controllers/auth.controller.ts (استبدله كامل)
import type { Response } from "express";
import { prisma } from "../config/prisma.js";
import type { AuthedRequest } from "../middleware/auth.js";
import { AppError } from "../middleware/errorHandler.js";

export async function continueAsGuest(req: AuthedRequest, res: Response) {
  const { guestId, displayName } = req.body as {
    guestId: string;
    displayName?: string;
  };
  const user = await prisma.user.upsert({
    where: { guestId },
    update: {},
    create: { guestId, isGuest: true, displayName: displayName ?? "Guest" },
  });
  res.json(user);
}

// merge-on-register: sums XP, unions badges, keeps the higher streak (spec 4-A)
export async function registerOrMerge(req: AuthedRequest, res: Response) {
  const uid = req.firebaseUser!.uid;
  const { guestId } = req.body as { guestId?: string };

  let user = await prisma.user.findUnique({ where: { firebaseUid: uid } });
  const guest = guestId
    ? await prisma.user.findUnique({ where: { guestId } })
    : null;

  if (!user && guest && !guest.firebaseUid) {
    user = await prisma.user.update({
      where: { id: guest.id },
      data: {
        firebaseUid: uid,
        isGuest: false,
        email: req.firebaseUser!.email,
        displayName: req.firebaseUser!.name ?? guest.displayName,
      },
    });
  } else if (!user) {
    user = await prisma.user.create({
      data: {
        firebaseUid: uid,
        isGuest: false,
        email: req.firebaseUser!.email,
        displayName: req.firebaseUser!.name ?? "User",
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

export async function getMe(req: AuthedRequest, res: Response) {
  const user = await prisma.user.findUnique({
    where: { firebaseUid: req.firebaseUser!.uid },
  });
  if (!user) throw new AppError("User not found", 404);
  res.json(user);
}
