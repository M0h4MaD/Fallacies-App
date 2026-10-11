import type { Request, Response } from 'express'
import { prisma } from '../config/prisma.js'

let cache: { data: unknown[]; expiresAt: number } | null = null
const TTL_MS = 60_000

export async function getLeaderboard(req: Request, res: Response) {
  const page = Math.max(1, Number(req.query.page) || 1)
  const pageSize = 20

  if (!cache || cache.expiresAt < Date.now()) {
    const users = await prisma.user.findMany({
      orderBy: { xp: 'desc' },
      take: 100,
      select: { id: true, displayName: true, xp: true, level: true, streakCurrent: true },
    })
    cache = { data: users, expiresAt: Date.now() + TTL_MS }
  }

  const start = (page - 1) * pageSize
  res.json({ page, pageSize, total: cache.data.length, results: cache.data.slice(start, start + pageSize) })
}
