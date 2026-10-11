import type { Response } from 'express'
import { prisma } from '../config/prisma.js'
import type { IdentifiedRequest } from '../middleware/identify.js'
import { explainFallacy } from '../services/explainer.js'
import { AppError } from '../middleware/errorHandler.js'

export async function askExplainer(req: IdentifiedRequest, res: Response) {
  const { fallacySlug, question, lang } = req.body as { fallacySlug: string; question: string; lang: 'ar' | 'en' }
  const fallacy = await prisma.fallacy.findUnique({ where: { slug: fallacySlug } })
  if (!fallacy) throw new AppError('Fallacy not found', 404)

  const answer = await explainFallacy(req.currentUser!.id, fallacy.nameEn, fallacy.definitionEn, lang, question)
  res.json({ answer })
}
