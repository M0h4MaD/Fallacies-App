// frontend/src/hooks/useCorrectionSession.ts (استبدله كامل)
import { useEffect, useState } from "react";
import { apiClient } from "../lib/apiClient";
import { useAuthStore } from "../store/authStore";
import type { Fallacy } from "../types";

interface CorrectionQuestion {
  text: { ar: string; en: string };
  contextType?: string;
}
interface EvaluatorResult {
  identifiedCorrectFallacy: boolean;
  rewriteRemovesFallacy: boolean;
  clarityScore: number;
  feedback: string;
}
const MAX_ATTEMPTS = 4;

function pickRandom(
  fallacies: Fallacy[],
  excludeSlugs: string[],
): Fallacy | undefined {
  const pool = fallacies.filter((f) => !excludeSlugs.includes(f.slug));
  const from = pool.length > 0 ? pool : fallacies;
  return from[Math.floor(Math.random() * from.length)];
}

export function useCorrectionSession(
  unlockedFallacies: Fallacy[],
  lang: "ar" | "en",
) {
  const level = useAuthStore((s) => s.appUser?.level ?? 1);
  const [targetFallacy, setTargetFallacy] = useState<Fallacy | null>(null);
  const [question, setQuestion] = useState<CorrectionQuestion | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [guessedSlug, setGuessedSlug] = useState<string | null>(null);
  const [rewriteText, setRewriteText] = useState("");
  const [result, setResult] = useState<EvaluatorResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [round, setRound] = useState(0);

  const difficulty =
    level >= 8 ? "advanced" : level >= 4 ? "intermediate" : "beginner";

  useEffect(() => {
    if (unlockedFallacies.length === 0) return;
    let cancelled = false;

    async function tryFetch() {
      const tried: string[] = [];
      for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
        const picked = pickRandom(unlockedFallacies, tried);
        if (!picked) break;
        tried.push(picked.slug);
        try {
          const res = await apiClient.get<CorrectionQuestion>(
            `/api/questions/${picked.slug}/next`,
            { params: { difficulty, mode: "correction" } },
          );
          if (!cancelled) {
            setTargetFallacy(picked);
            setQuestion(res.data);
            setIsLoading(false);
          }
          return;
        } catch {
          // هالمغالطة فاضية بهالصعوبة — جرّب وحدة تانية بدل ما توقف بخطأ فوري
        }
      }
      if (!cancelled) {
        setError("Could not find an example right now — try again in a bit.");
        setIsLoading(false);
      }
    }

    setIsLoading(true);
    setError(null);
    tryFetch();
    return () => {
      cancelled = true;
    };
  }, [unlockedFallacies, difficulty, round]);

  function loadNext() {
    setGuessedSlug(null);
    setRewriteText("");
    setResult(null);
    setError(null);
    setIsLoading(true);
    setRound((r) => r + 1);
  }

  function guess(slug: string) {
    if (!guessedSlug) setGuessedSlug(slug);
  }

  async function submit() {
    if (!targetFallacy || !guessedSlug || !rewriteText.trim() || !question)
      return;
    setIsSubmitting(true);
    setError(null);
    try {
      const { data } = await apiClient.post<EvaluatorResult>("/api/evaluator", {
        fallacySlug: targetFallacy.slug,
        originalText: lang === "ar" ? question.text.ar : question.text.en,
        identifiedFallacySlug: guessedSlug,
        rewrittenText: rewriteText.trim(),
        lang,
      });
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
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
  };
}
