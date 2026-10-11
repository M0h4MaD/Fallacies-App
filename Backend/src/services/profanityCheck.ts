const BLOCKED_PATTERNS = [/\bkill\b/i, /\bviolence\b/i]

export function containsFlaggedContent(text: string): boolean {
  return BLOCKED_PATTERNS.some((p) => p.test(text))
}
