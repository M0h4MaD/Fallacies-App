// frontend/src/pages/CorrectionPage.tsx (استبدله كامل)
import { useTranslation } from "react-i18next";
import { useUnlockedFallacies } from "../hooks/useUnlockedFallacies";
import { useCorrectionSession } from "../hooks/useCorrectionSession";
import ExampleDisclaimer from "../components/ExampleDisclaimer";
import LoadingTip from "../components/LoadingTip";

export default function CorrectionPage() {
  const { i18n } = useTranslation();
  const lang = i18n.language === "en" ? "en" : "ar";
  const { fallacies } = useUnlockedFallacies();
  const {
    question,
    isLoading,
    error,
    guessedSlug,
    guess,
    rewriteText,
    setRewriteText,
    submit,
    isSubmitting,
    result,
    loadNext,
  } = useCorrectionSession(fallacies, lang);

  if (error) return <p className="text-flag">{error}</p>;
  if (isLoading || !question) return <LoadingTip />

  if (result) {
    return (
      <div>
        <h1 className="mb-6 font-heading text-3xl font-bold text-text">
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
        <button
          onClick={loadNext}
          className="mt-8 rounded-lg bg-brand px-6 py-3 font-medium text-white transition-colors hover:bg-brand-hover"
        >
          {lang === "ar" ? "مثال تاني" : "Another example"}
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-6 font-heading text-2xl font-bold text-text">
        {lang === "ar" ? "صحّح الجملة" : "Fix the Sentence"}
      </h1>
      <p className="mb-8 font-heading text-xl font-bold text-text whitespace-pre-line">
        “{lang === "ar" ? question.text.ar : question.text.en}”
      </p>

      <ExampleDisclaimer contextType={question.contextType} />

      {!guessedSlug ? (
        <div>
          <p className="mb-3 text-sm text-text-muted">
            {lang === "ar" ? "شو المغالطة هون؟" : "What fallacy is this?"}
          </p>
          <div className="flex flex-wrap gap-2">
            {fallacies.map((f) => (
              <button
                key={f.slug}
                onClick={() => guess(f.slug)}
                className="rounded-lg border border-border px-3 py-1.5 text-sm text-text hover:bg-surface"
              >
                {lang === "ar" ? f.nameAr : f.nameEn}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <label className="mb-2 block text-sm text-text-muted">
            {lang === "ar"
              ? "أعد صياغتها بدون المغالطة:"
              : "Rewrite it without the fallacy:"}
          </label>
          <textarea
            value={rewriteText}
            onChange={(e) => setRewriteText(e.target.value)}
            rows={4}
            className="w-full rounded-lg border border-border bg-surface p-3 text-text outline-none focus:border-brand"
          />
          <button
            onClick={submit}
            disabled={isSubmitting || !rewriteText.trim()}
            className="mt-4 rounded-lg bg-brand px-6 py-3 font-medium text-white hover:bg-brand-hover disabled:opacity-50"
          >
            {isSubmitting
              ? lang === "ar"
                ? "عم نقيّم..."
                : "Grading..."
              : lang === "ar"
                ? "إرسال"
                : "Submit"}
          </button>
        </div>
      )}
    </div>
  );
}
