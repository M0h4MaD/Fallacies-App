// backend/src/services/debater.ts (ملف جديد)
import { z } from 'zod'
import { callGemini } from './geminiCall.js'
import { wrapUserText } from './promptSafety.js'

interface DebaterTurn { speaker: 'user' | 'opponent'; text: string }

const responseSchema = {
  type: 'OBJECT',
  properties: { message: { type: 'STRING' }, fallacyUsedSlug: { type: 'STRING' } },
  required: ['message', 'fallacyUsedSlug'],
}
const debaterOutputSchema = z.object({ message: z.string().min(1), fallacyUsedSlug: z.string().min(1) })

export async function generateDebaterTurn(
  userId: string,
  availableFallacies: { slug: string; nameEn: string; definitionEn: string }[],
  history: DebaterTurn[],
  lang: 'ar' | 'en',
) {
  const fallacyList = availableFallacies.map((f) => `- ${f.slug}: ${f.nameEn} (${f.definitionEn})`).join('\n')
  const transcript = history.map((h) => `${h.speaker === 'user' ? 'User' : 'Opponent'}: ${h.text}`).join('\n')

  const prompt = [
    'You are "Opponent" in a friendly debate-practice chat — a fictional generic persona, never a real named public figure.',
    'On this turn, deliberately commit exactly one fallacy from this list, favoring one you have not used recently in this conversation:',
    fallacyList,
    'Keep your message short (2-3 sentences), on a generic everyday/political/media/religious topic — never taking a real-world side or naming real entities.',
    `Respond in ${lang === 'ar' ? 'Arabic' : 'English'}.`,
    'Return the fallacy slug you used in fallacyUsedSlug — hidden from the user, used only for scoring.',
    transcript ? wrapUserText('the conversation so far', transcript) : '(This is the opening message — start the debate.)',
  ].join('\n')

  const raw = await callGemini({ userId, prompt, responseSchema })
  const parsed = debaterOutputSchema.parse(JSON.parse(raw))
  if (!availableFallacies.some((f) => f.slug === parsed.fallacyUsedSlug)) parsed.fallacyUsedSlug = availableFallacies[0].slug // defends against a hallucinated slug outside our list
  return parsed
}