// frontend/src/pages/LibraryPage.tsx (استبدله كامل)
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useFallacies } from "../hooks/useFallacies";
import type { Difficulty } from "../types";

const difficultyLabel: Record<Difficulty, { ar: string; en: string }> = {
  beginner: { ar: "مبتدئ", en: "Beginner" },
  intermediate: { ar: "متوسط", en: "Intermediate" },
  advanced: { ar: "متقدم", en: "Advanced" },
};

export default function LibraryPage() {
  const { i18n } = useTranslation();
  const { fallacies, isLoading, error } = useFallacies();
  const lang = i18n.language === "en" ? "en" : "ar";

  return (
    <div>
      <h1 className="mb-1 font-heading text-3xl font-bold text-text">
        {lang === "ar" ? "مكتبة المغالطات" : "Fallacy Library"}
      </h1>
      <p className="mb-8 text-text-muted">
        {isLoading
          ? lang === "ar"
            ? "عم نجيب المكتبة..."
            : "Loading the library..."
          : `${fallacies.length} ${lang === "ar" ? "مغالطة منطقية شائعة" : "common logical fallacies"}`}
      </p>
      {error && <p className="mb-6 text-flag">{error}</p>}

      <div className="divide-y divide-border border-t border-border">
        {fallacies.map((f) => (
          <article
            key={f.slug}
            className="flex items-baseline justify-between gap-4 py-5 transition-colors hover:bg-surface"
          >
            <div>
              <h2 className="font-heading text-xl font-bold text-text">
                {lang === "ar" ? f.nameAr : f.nameEn}
              </h2>
              <p className="mt-1 text-sm text-text-muted">
                {lang === "ar" ? f.nameEn : f.nameAr}
              </p>
              <p className="mt-2 max-w-prose text-text">
                {lang === "ar" ? f.definitionAr : f.definitionEn}
              </p>
              <div className="mt-2 flex gap-4">
                <Link
                  to={`/quiz/${f.slug}`}
                  className="text-sm font-medium text-brand hover:text-brand-hover"
                >
                  {lang === "ar" ? "تمرّن" : "Practice"}
                </Link>
                <Link
                  to={`/chat/explainer/${f.slug}`}
                  className="text-sm font-medium text-brand hover:text-brand-hover"
                >
                  {lang === "ar" ? "اشرحلي" : "Explain"}
                </Link>
              </div>
            </div>
            <span className="shrink-0 text-sm text-text-muted">
              {difficultyLabel[f.difficulty][lang]}
            </span>
          </article>
        ))}
      </div>
    </div>
  );
}
