// frontend/src/components/StreakFlame.tsx (ملف جديد)
import { motion, AnimatePresence } from 'framer-motion'
import { Flame } from 'lucide-react'

export default function StreakFlame({ streak }: { streak: number }) {
  if (streak <= 0) return null
  return (
    <div className="flex items-center gap-1 text-sm text-reward">
      <Flame size={16} fill="currentColor" strokeWidth={0} />
      <AnimatePresence mode="popLayout">
        <motion.span key={streak} initial={{ y: -6, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: 'spring', stiffness: 400, damping: 22 }}>{streak}</motion.span>
      </AnimatePresence>
    </div>
  )
}