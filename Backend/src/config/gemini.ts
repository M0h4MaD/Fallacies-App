// backend/src/config/gemini.ts (ملف جديد)
import { GoogleGenAI } from '@google/genai'

export const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
export const GEMINI_MODEL = 'gemini-2.5-flash'

// Deliberate, documented choice (spec 4-D): the app analyzes political/religious rhetoric as
// EXAMPLES of flawed reasoning — it never generates or endorses the rhetoric itself, only labels
// why it's fallacious. Default thresholds are appropriate; nothing here needs them loosened.
export const GEMINI_SAFETY_SETTINGS = [
  { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
  { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
  { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
  { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
] as const