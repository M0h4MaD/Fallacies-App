export function asString(value: unknown): string {
  if (typeof value !== 'string') throw new Error('Expected a single string value')
  return value
}
export function asOptionalString(value: unknown): string | undefined {
  return typeof value === 'string' ? value : undefined
}
