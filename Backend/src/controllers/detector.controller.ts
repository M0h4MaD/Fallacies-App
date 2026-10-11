import type { Response } from 'express'
import { prisma } from '../config/prisma.js'
import type { IdentifiedRequest } from '../middleware/identify.js'
import { detectFallacy } from '../services/detector.js'

export async function analyzeText(req: IdentifiedRequest, res: Response) {
  const { text, lang } = req.body as { text: string; lang: 'ar' | 'en' }
  const fallacies = await prisma.fallacy.findMany({ select: { slug: true } })
  res.json(await detectFallacy(req.currentUser!.id, text, lang, fallacies.map((f) => f.slug)))
}
