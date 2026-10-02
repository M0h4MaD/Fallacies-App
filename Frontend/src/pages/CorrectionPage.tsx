// frontend/src/pages/CorrectionPage.tsx (استبدله كامل)
import { useTranslation } from "react-i18next";
import { useUnlockedFallacies } from "../hooks/useUnlockedFallacies";
import { useCorrectionSession } from "../hooks/useCorrectionSession";
import LoadingTip from "../components/LoadingTip";
import { motion } from "framer-motion";
import { tapScale } from "../lib/motion";
import { useFallacies } from "../hooks/useFallacies";

export default function CorrectionPage() {
  const { i18n } = useTranslation();
  const lang = i18n.language === "en" ? "en" : "ar";
  const { fallacies: unlockedFallacies } = useUnlockedFallacies();
  const { fallacies: allFallacies } = useFallacies();
  const {
    question,
    isLoading,
    error,
    guessedSlug,
    guess,
    guessOptions,
    rewriteText,
    setRewriteText,
    submit,
    isSubmitting,
    result,
    xpResult,
    loadNext,
  } = useCorrectionSession(unlockedFallacies, allFallacies, lang);

  if (error) return <p className="text-flag">{error}</p>;
  if (isLoading || !question) return <LoadingTip />;

  if (result) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-2xl border border-border bg-surface p-8 shadow-[var(--shadow-elevated)]"
      >
        <h1 className="mb-6 font-heading text-2xl font-extrabold text-text">
          {lang === "ar" ? "نتيجة التصحيح" : "Correction Result"}
        </h1>
        <div className="space-y-2">
          <p
            className={
              result.identifiedCorrectFallacy ? "text-brand" : "text-flag"
            }
          >
            {result.identifiedCorrectFallacy ? "✓" : "✗"}{" "}
            {lang === "ar"
              ? "حددت المغالطة صح"
              : "Correctly identified the fallacy"}
          </p>
          <p
            className={
              result.rewriteRemovesFallacy ? "text-brand" : "text-flag"
            }
          >
            {result.rewriteRemovesFallacy ? "✓" : "✗"}{" "}
            {lang === "ar"
              ? "إعادة الصياغة شالت المغالطة"
              : "Rewrite removes the fallacy"}
          </p>
          <p className="text-text">
            {lang === "ar" ? "وضوح الصياغة" : "Clarity"}: {result.clarityScore}
            /5
          </p>
          <p className="text-text-muted">{result.feedback}</p>
        </div>
        <motion.button
          whileTap={tapScale}
          onClick={loadNext}
          className="mt-8 rounded-lg bg-brand px-6 py-3 font-medium text-white shadow-[var(--shadow-brand)] transition-colors hover:bg-brand-hover"
        >
          {lang === "ar" ? "مثال تاني" : "Another example"}
        </motion.button>
        {xpResult && (
          <p className="mt-3 text-sm text-reward">
            +{xpResult.xpAwarded} {lang === "ar" ? "نقطة خبرة" : "XP"}
            {xpResult.newLevel > xpResult.previousLevel
              ? lang === "ar"
                ? ` · مستوى ${xpResult.newLevel}! 🎉`
                : ` · Level ${xpResult.newLevel}! 🎉`
              : ""}
          </p>
        )}
      </motion.div>
    );
  }

  return (
    <div>
      <h1 className="mb-6 font-heading text-2xl font-bold text-text">
        {lang === "ar" ? "صحّح الجملة" : "Fix the Sentence"}
      </h1>
      <p className="mb-1 whitespace-pre-line font-heading text-xl font-bold text-text">
        "{lang === "ar" ? question.text.ar : question.text.en}"
      </p>

      {!guessedSlug ? (
        <div className="mt-6">
          <p className="mb-3 text-sm text-text-muted">
            {lang === "ar" ? "شو المغالطة هون؟" : "What fallacy is this?"}
          </p>
          <div className="flex flex-wrap gap-2">
            {guessOptions.map((f) => (
              <motion.button
                key={f.slug}
                whileTap={tapScale}
                whileHover={{ y: -2 }}
                onClick={() => guess(f.slug)}
                className="rounded-xl border border-border bg-surface px-3 py-1.5 text-sm text-text shadow-sm transition-shadow duration-200 hover:shadow-[var(--shadow-elevated)]"
              >
                {lang === "ar" ? f.nameAr : f.nameEn}
              </motion.button>
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-6">
          <label className="mb-2 block text-sm text-text-muted">
            {lang === "ar"
              ? "أعد صياغتها بدون المغالطة:"
              : "Rewrite it without the fallacy:"}
          </label>
          <textarea
            value={rewriteText}
            onChange={(e) => setRewriteText(e.target.value)}
            rows={4}
            className="w-full rounded-xl border border-border bg-surface p-3 text-text shadow-sm outline-none focus:border-brand focus:shadow-[var(--shadow-elevated)]"
          />
          <motion.button
            whileTap={tapScale}
            onClick={submit}
            disabled={isSubmitting || !rewriteText.trim()}
            className="mt-4 rounded-lg bg-brand px-6 py-3 font-medium text-white shadow-[var(--shadow-brand)] transition-colors hover:bg-brand-hover disabled:opacity-50 disabled:shadow-none"
          >
            {isSubmitting
              ? lang === "ar"
                ? "عم نقيّم..."
                : "Grading..."
              : lang === "ar"
                ? "إرسال"
                : "Submit"}
          </motion.button>
        </div>
      )}
    </div>
  );
}
