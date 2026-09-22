// frontend/src/lib/motion.ts (ملف جديد)
// مصدر واحد للحركة بكل التطبيق — هدوء وفخامة، مش لعبة (قرارك بجلسة سابقة).
import type { Transition, Variants } from 'framer-motion'

export const pageVariants: Variants = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.22, ease: 'easeOut' } },
  exit: { opacity: 0, transition: { duration: 0.12 } },
}
export const tapScale = { scale: 0.97 }