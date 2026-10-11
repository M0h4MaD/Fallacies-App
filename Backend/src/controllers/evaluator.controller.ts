import type { Response } from 'express'
import { prisma } from '../config/prisma.js'
import type { IdentifiedRequest } from '../middleware/identify.js'
import { evaluateCorrection } from '../services/evaluator.js'
import { AppError } from '../middleware/errorHandler.js'

export async function submitCorrection(req: IdentifiedRequest, res: Response) {
  const { fallacySlug, originalText, identifiedFallacySlug, rewrittenText, lang } = req.body as {
    fallacySlug: string; originalText: string; identifiedFallacySlug: string; rewrittenText: string; lang: 'ar' | 'en'
  }
  const fallacy = await prisma.fallacy.findUnique({ where: { slug: fallacySlug } })
  if (!fallacy) throw new AppError('Fallacy not found', 404)

  const identifiedCorrectFallacy = identifiedFallacySlug === fallacySlug
  const result = await evaluateCorrection(req.currentUser!.id, fallacy.nameEn, identifiedCorrectFallacy, lang, originalText, rewrittenText)
  res.json({ identifiedCorrectFallacy, ...result })
}
