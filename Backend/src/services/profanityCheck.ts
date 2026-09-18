// backend/src/services/profanityCheck.ts (ملف جديد)
// Defense-in-depth (spec 5) خلف فلاتر Gemini نفسها — كشف بسيط بالكلمات المفتاحية، مش بديل
// عن الـ safety settings، طبقة إضافية بس على مخرجات AI قبل ما توصل للمستخدم.
const BLOCKED_PATTERNS = [/\bkill\b/i, /\bviolence\b/i] // placeholder — وسّعها بقائمة حقيقية أعمق حسب لغتين

export function containsFlaggedContent(text: string): boolean {
  return BLOCKED_PATTERNS.some((p) => p.test(text))
}