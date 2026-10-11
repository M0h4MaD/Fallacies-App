import type { Response } from "express";
import { prisma } from "../config/prisma.js";
import type { IdentifiedRequest } from "../middleware/identify.js";
import { AppError } from "../middleware/errorHandler.js";
import { asString } from "../lib/params.js";

export async function listUsers(_req: IdentifiedRequest, res: Response) {
  res.json(
    await prisma.user.findMany({
      select: {
        id: true,
        displayName: true,
        email: true,
        isSuspended: true,
        isGuest: true,
        xp: true,
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    }),
  );
}
export async function setUserSuspension(req: IdentifiedRequest, res: Response) {
  const { isSuspended } = req.body as { isSuspended: boolean };
  const user = await prisma.user
    .update({
      where: { id: asString(req.params.userId) },
      data: { isSuspended },
    })
    .catch(() => null);
  if (!user) throw new AppError("User not found", 404);
  res.json(user);
}
