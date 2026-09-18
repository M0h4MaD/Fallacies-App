// backend/src/controllers/report.controller.ts (ملف جديد)
import type { Response } from 'express'
import { prisma } from '../config/prisma.js'
import type { IdentifiedRequest } from '../middleware/identify.js'

export async function submitReport(req: IdentifiedRequest, res: Response) {
  const { contentType, contentText, reason } = req.body as { contentType: string; contentText: string; reason?: string }
  await prisma.report.create({ data: { reporterId: req.currentUser!.id, contentType, contentText, reason } })
  res.status(201).json({ status: 'received' })
}
export async function listReports(_req: IdentifiedRequest, res: Response) {
  res.json(await prisma.report.findMany({ orderBy: { createdAt: 'desc' }, include: { reporter: { select: { displayName: true } } } }))
}