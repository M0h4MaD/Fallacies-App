// backend/src/lib/params.ts (استبدله كامل)
// unknown بدل الملاحقة وراء نوع Express المتغيّر (string|string[]|ParsedQs|...) — أي قيمة بتنمرر،
// وفحص typeof وقت التشغيل هو نفسو بغض النظر شو النوع المعلن.
export function asString(value: unknown): string {
  if (typeof value !== 'string') throw new Error('Expected a single string value')
  return value
}
export function asOptionalString(value: unknown): string | undefined {
  return typeof value === 'string' ? value : undefined
}