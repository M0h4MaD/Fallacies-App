// frontend/src/pages/LeaderboardPage.tsx (استبدله كامل)
import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Trophy, Medal } from "lucide-react";
import { useLeaderboard } from "../hooks/useLeaderboard";
import { useAuthStore } from "../store/authStore";
import LoadingTip from "../components/LoadingTip";

const PODIUM_STYLE = [
  { Icon: Trophy, color: "#D4AF37", scale: 1.15 },
  { Icon: Medal, color: "#9CA3AF", scale: 1 },
  { Icon: Medal, color: "#B08D57", scale: 0.92 },
];

export default function LeaderboardPage() {
  const { i18n } = useTranslation();
  const lang = i18n.language === "en" ? "en" : "ar";
  const [page, setPage] = useState(1);
  const { data, isLoading } = useLeaderboard(page);
  const currentUserId = useAuthStore((s) => s.appUser?.id);

  if (isLoading || !data) return <LoadingTip />;

  const top3 = page === 1 ? data.results.slice(0, 3) : [];
  const rest = page === 1 ? data.results.slice(3) : data.results;
  const restStartRank = page === 1 ? 4 : (page - 1) * data.pageSize + 1;

  return (
    <div>
      <h1 className="mb-8 font-heading text-3xl font-bold text-text">
        {lang === "ar" ? "لوحة الصدارة" : "Leaderboard"}
      </h1>

      {top3.length > 0 && (
        <div className="mb-8 flex items-end justify-center gap-3">
          {top3.map((u, i) => {
            const { Icon, color, scale } = PODIUM_STYLE[i];
            return (
              <motion.div
                key={u.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: i * 0.1,
                  type: "spring",
                  stiffness: 260,
                  damping: 22,
                }}
                style={{ transform: `scale(${scale})` }}
                className={[
                  "flex w-28 flex-col items-center rounded-xl border p-4 text-center shadow-[var(--shadow-elevated)]",
                  u.id === currentUserId
                    ? "border-brand bg-brand/5"
                    : "border-border bg-surface",
                ].join(" ")}
              >
                <Icon
                  size={i === 0 ? 30 : 24}
                  style={{ color }}
                  strokeWidth={1.75}
                  className="mb-2"
                />
                <p className="truncate text-sm font-medium text-text">
                  {u.displayName}
                </p>
                <p className="mt-1 text-xs text-text-muted">{u.xp} XP</p>
              </motion.div>
            );
          })}
        </div>
      )}

      {rest.length > 0 && (
        <motion.div
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.03 } },
          }}
          className="divide-y divide-border border-t border-border"
        >
          {rest.map((u, i) => (
            <motion.div
              key={u.id}
              variants={{
                hidden: { opacity: 0, x: 8 },
                show: { opacity: 1, x: 0 },
              }}
              className={[
                "flex items-center justify-between py-3",
                u.id === currentUserId ? "text-brand" : "text-text",
              ].join(" ")}
            >
              <div className="flex items-center gap-4">
                <span className="w-6 text-sm text-text-muted">
                  {restStartRank + i}
                </span>
                <span className="font-medium">{u.displayName}</span>
              </div>
              <div className="flex items-center gap-4 text-sm text-text-muted">
                <span>
                  {lang === "ar" ? `مستوى ${u.level}` : `Lvl ${u.level}`}
                </span>
                <span>{u.xp} XP</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      <div className="mt-6 flex gap-3">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="cursor-pointer rounded-lg border border-border px-4 py-2 text-sm text-text disabled:cursor-default disabled:opacity-40"
        >
          {lang === "ar" ? "السابق" : "Prev"}
        </button>
        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={page * data.pageSize >= data.total}
          className="cursor-pointer rounded-lg border border-border px-4 py-2 text-sm text-text disabled:cursor-default disabled:opacity-40"
        >
          {lang === "ar" ? "التالي" : "Next"}
        </button>
      </div>
    </div>
  );
}
