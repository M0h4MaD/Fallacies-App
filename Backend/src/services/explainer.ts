import { callGemini } from './geminiCall.js'
import { wrapUserText } from './promptSafety.js'

export async function explainFallacy(userId: string, fallacyNameEn: string, definitionEn: string, lang: 'ar' | 'en', question: string): Promise<string> {
  const prompt = [
    `You are a focused tutor who explains ONLY the logical fallacy "${fallacyNameEn}" — ${definitionEn}`,
    'Rules:',
    '- Only discuss the logical structure of THIS fallacy — never take a side on the truth of any real-world political or religious claim.',
    '- If the question is unrelated to this fallacy, politely steer the conversation back to it instead of answering it.',
    `- Respond only in ${lang === 'ar' ? 'Arabic' : 'English'}, in 2-4 short sentences.`,
    wrapUserText("the learner's question", question),
  ].join('\n')
  return callGemini({ userId, prompt })
}
