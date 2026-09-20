// frontend/src/pages/QuizPage.tsx — بدّل الملف كامل (زيد قسم التلميح/الإبلاغ فوق أزرار الإجابة، بس قبل ما ينكشف الجواب)
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useQuizSession } from "../hooks/useQuizSession";

export default function QuizPage() {
  const { fallacySlug } = useParams<{ fallacySlug: string }>();
  const { i18n } = useTranslation();
  const lang = i18n.language === "en" ? "en" : "ar";
  if (!fallacySlug)
    return (
      <p className="text-text-muted">
        {lang === "ar"
          ? "اختر مغالطة من المكتبة أول."
          : "Pick a fallacy from the Library first."}
      </p>
    );
  return <FallacyQuiz slug={fallacySlug} lang={lang} />;
}

function FallacyQuiz({ slug, lang }: { slug: string; lang: "ar" | "en" }) {
  const {
    question,
    isLoading,
    error,
    revealed,
    wasCorrectLast,
    answer,
    next,
    isFinished,
    result,
    answeredCount,
    totalQuestions,
    fallacyHint,
    hintUsedThisQuestion,
    markHintUsed,
    reportSent,
    reportQuestion,
  } = useQuizSession(slug);

  if (isFinished) {
    if (!result)
      return (
        <p className="text-text-muted">
          {lang === "ar" ? "عم نحفظ النتيجة..." : "Saving your result..."}
        </p>
      );
    return (
      <div>
        <h1 className="mb-6 font-heading text-3xl font-bold text-text">
          {lang === "ar" ? "نتيجة الجلسة" : "Session Result"}
        </h1>
        <p className="mb-2 font-heading text-5xl font-bold text-brand">
          {result.scorePercent}%
        </p>
        <p className="mb-8 text-text-muted">
          {lang === "ar"
            ? `+${result.xpAwarded} نقطة خبرة · مستوى ${result.newLevel}`
            : `+${result.xpAwarded} XP · Level ${result.newLevel}`}
        </p>
        <Link
          to="/library"
          className="inline-block rounded-lg bg-brand px-6 py-3 font-medium text-white transition-colors hover:bg-brand-hover"
        >
          {lang === "ar" ? "رجوع للمكتبة" : "Back to Library"}
        </Link>
      </div>
    );
  }

  if (error) return <p className="text-flag">{error}</p>;
  if (isLoading || !question)
    return (
      <p className="text-text-muted">
        {lang === "ar" ? "عم نجهّز مثال..." : "Preparing an example..."}
      </p>
    );

  return (
    <div>
      <p className="mb-6 text-sm text-text-muted">
        {lang === "ar"
          ? `${answeredCount + 1} من ${totalQuestions}`
          : `${answeredCount + 1} of ${totalQuestions}`}
      </p>
      <p className="mb-4 whitespace-pre-line font-heading text-2xl font-bold text-text">
        "{lang === "ar" ? question.text.ar : question.text.en}"
      </p>

      {!revealed && (
        <div className="mb-6 flex gap-4 text-sm text-text-muted">
          <button onClick={markHintUsed} disabled={hintUsedThisQuestion}>
            {hintUsedThisQuestion
              ? "💡"
              : lang === "ar"
                ? "💡 تلميح"
                : "💡 Hint"}
          </button>
          <button onClick={reportQuestion} disabled={reportSent}>
            {reportSent
              ? lang === "ar"
                ? "✓ تم الإبلاغ"
                : "✓ Reported"
              : lang === "ar"
                ? "🚩 إبلاغ"
                : "🚩 Report"}
          </button>
        </div>
      )}
      {hintUsedThisQuestion && fallacyHint && (
        <p className="mb-6 rounded-lg border border-border bg-surface p-3 text-sm text-text-muted">
          {lang === "ar" ? fallacyHint.ar : fallacyHint.en}
        </p>
      )}

      {!revealed ? (
        <div className="flex gap-3">
          <button
            onClick={() => answer(true)}
            className="rounded-lg border border-border px-5 py-3 text-text hover:bg-surface"
          >
            {lang === "ar" ? "لاحظتها" : "I spotted it"}
          </button>
          <button
            onClick={() => answer(false)}
            className="rounded-lg border border-border px-5 py-3 text-text hover:bg-surface"
          >
            {lang === "ar" ? "ما لاحظتها" : "I didn't spot it"}
          </button>
        </div>
      ) : (
        <div>
          <p className={wasCorrectLast ? "text-brand" : "text-flag"}>
            {lang === "ar" ? "تمام، سجّلنا إجابتك." : "Noted."}
          </p>
          <button
            onClick={next}
            className="mt-6 rounded-lg bg-brand px-6 py-3 font-medium text-white transition-colors hover:bg-brand-hover"
          >
            {lang === "ar" ? "التالي" : "Next"}
          </button>
        </div>
      )}
    </div>
  );
}
