import { AnimatePresence, motion } from "framer-motion";
import { Flame } from "lucide-react";

export default function StreakFlame({ streak }: { streak: number }) {
  if (streak <= 0) return null;
  return (
    <div
      className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-sm font-semibold text-white shadow-[var(--shadow-brand)]"
      style={{
        background:
          "linear-gradient(135deg, var(--color-reward), var(--color-flag))",
      }}
    >
      <Flame size={14} fill="white" strokeWidth={0} />
      <AnimatePresence mode="popLayout">
        <motion.span
          key={streak}
          initial={{ y: -6, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 22 }}
        >
          {streak}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}
