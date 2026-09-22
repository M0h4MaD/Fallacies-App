// frontend/src/pages/ReviewQueuePage.tsx (استبدله كامل)
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { PartyPopper, RotateCcw } from "lucide-react";
import { useReviewQueue } from "../hooks/useReviewQueue";
import LoadingTip from "../components/LoadingTip";

const listVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

export default function ReviewQueuePage() {
  const { i18n } = useTranslation();
  const lang = i18n.language === "en" ? "en" : "ar";
  const { items, isLoading } = useReviewQueue();

  return (
    <div>
      <h1 className="mb-1 font-heading text-3xl font-bold text-text">
        {lang === "ar" ? "قائمة المراجعة" : "Review Queue"}
      </h1>
      <p className="mb-8 text-text-muted">
        {lang === "ar"
          ? "مغالطات حان وقت مراجعتها"
          : "Fallacies due for review"}
      </p>

      {isLoading ? (
        <LoadingTip />
      ) : items.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-3 rounded-xl border border-border bg-surface py-14 text-center shadow-[var(--shadow-elevated)]"
        >
          <PartyPopper size={32} className="text-reward" strokeWidth={1.75} />
          <p className="font-heading text-lg font-bold text-text">
            {lang === "ar" ? "كلشي محدّث!" : "You're all caught up!"}
          </p>
          <p className="max-w-xs text-sm text-text-muted">
            {lang === "ar"
              ? "ما في مغالطات بانتظار المراجعة هلق. ارجع بعدين."
              : "Nothing due for review right now. Check back later."}
          </p>
        </motion.div>
      ) : (
        <motion.div
          variants={listVariants}
          initial="hidden"
          animate="show"
          className="divide-y divide-border border-t border-border"
        >
          {items.map(({ fallacy, timesIncorrect }) => (
            <motion.div
              key={fallacy.slug}
              variants={itemVariants}
              className="flex items-center justify-between py-4"
            >
              <div className="flex items-center gap-3">
                <RotateCcw size={16} className="text-flag" strokeWidth={1.75} />
                <div>
                  <p className="font-heading font-bold text-text">
                    {lang === "ar" ? fallacy.nameAr : fallacy.nameEn}
                  </p>
                  <p className="text-xs text-text-muted">
                    {lang === "ar"
                      ? `أخطأت فيها ${timesIncorrect} مرة`
                      : `Missed ${timesIncorrect} time${timesIncorrect === 1 ? "" : "s"}`}
                  </p>
                </div>
              </div>
              <Link
                to={`/quiz/${fallacy.slug}`}
                className="cursor-pointer text-sm font-medium text-brand hover:text-brand-hover"
              >
                {lang === "ar" ? "راجع الآن" : "Review now"}
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
