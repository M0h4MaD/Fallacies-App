// backend/src/config/gemini.ts (استبدله كامل)
// HarmCategory/HarmBlockThreshold enum حقيقي بالـ SDK — string عادي (حتى لو نفس النص تماماً)
// مش قابل للتعيين لـ enum مباشرة بـ TypeScript، لازم استيراد الرمز نفسو.
// import { GoogleGenAI, HarmCategory, HarmBlockThreshold } from '@google/genai'

// export const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
// export const GEMINI_MODEL = 'gemini-flash-lite-latest'

// export const GEMINI_SAFETY_SETTINGS = [
//   { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
//   { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
//   { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
//   { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
// ]
//? ==================================
// backend/src/config/gemini.ts
import { GoogleGenAI, HarmCategory, HarmBlockThreshold } from '@google/genai'

export const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
 httpOptions: {
    baseUrl: process.env.GEMINI_PROXY_URL, // 👈 التعديل الصحيح للخيارات
  }, // 👈 التعديل هنا لتوجيه الطلبات عبر البروكسي
})

export const GEMINI_MODEL = 'gemini-flash-lite-latest'

export const GEMINI_SAFETY_SETTINGS = [
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
]