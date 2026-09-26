// frontend/src/hooks/useDebaterSession.ts (استبدله كامل)
import { useMemo, useState } from "react";
import { apiClient } from "../lib/apiClient";
import { pickGuessOptions } from "../lib/pickGuessOptions";
import type { Fallacy } from "../types";

interface Turn {
  speaker: "user" | "opponent";
  text: string;
}
interface DebaterResponse {
  message: string;
  fallacyUsedSlug: string;
}
export type DebaterContext = "political" | "religious" | "media" | "everyday";
export type DebaterDifficulty = "beginner" | "intermediate" | "advanced";

export function useDebaterSession(lang: "ar" | "en", allFallacies: Fallacy[]) {
  const [context, setContext] = useState<DebaterContext | null>(null);
  const [difficulty, setDifficulty] = useState<DebaterDifficulty>("beginner");
  const [history, setHistory] = useState<Turn[]>([]);
  const [usedSlugs, setUsedSlugs] = useState<string[]>([]);
  const [hiddenFallacySlug, setHiddenFallacySlug] = useState<string | null>(
    null,
  );
  const [guessResult, setGuessResult] = useState<{
    correct: boolean;
    actualSlug: string;
  } | null>(null);
  const [calloutStreak, setCalloutStreak] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const guessOptions = useMemo(
    () =>
      hiddenFallacySlug
        ? pickGuessOptions(allFallacies, hiddenFallacySlug)
        : [],
    [hiddenFallacySlug, allFallacies],
  );

  function fetchOpponentTurn(
    currentHistory: Turn[],
    ctx: DebaterContext,
    diff: DebaterDifficulty,
    used: string[],
  ) {
    setIsLoading(true);
    setError(null);
    apiClient
      .post<DebaterResponse>("/api/debater/turn", {
        history: currentHistory,
        lang,
        preferredContext: ctx,
        difficulty: diff,
        usedFallacySlugs: used,
      })
      .then((res) => {
        setHistory((h) => [
          ...h,
          { speaker: "opponent", text: res.data.message },
        ]);
        setHiddenFallacySlug(res.data.fallacyUsedSlug);
        setUsedSlugs((prev) => [...prev, res.data.fallacyUsedSlug]);
        setGuessResult(null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }

  function start(ctx: DebaterContext, diff: DebaterDifficulty) {
    setContext(ctx);
    setDifficulty(diff);
    fetchOpponentTurn([], ctx, diff, []);
  }

  function guess(slug: string) {
    if (!hiddenFallacySlug || guessResult) return;
    const correct = slug === hiddenFallacySlug;
    setGuessResult({ correct, actualSlug: hiddenFallacySlug });
    setCalloutStreak((s) => (correct ? s + 1 : 0));
  }

  function reply(text: string) {
    if (!text.trim() || isLoading || !context) return;
    const next = [...history, { speaker: "user" as const, text }];
    setHistory(next);
    fetchOpponentTurn(next, context, difficulty, usedSlugs);
  }

  return {
    context,
    start,
    history,
    guessResult,
    calloutStreak,
    isLoading,
    error,
    guess,
    reply,
    canGuess: hiddenFallacySlug !== null && !guessResult,
    guessOptions,
  };
}
