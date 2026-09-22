// frontend/src/hooks/useDebaterSession.ts (استبدله كامل)
import { useState } from "react";
import { apiClient } from "../lib/apiClient";

interface Turn {
  speaker: "user" | "opponent";
  text: string;
}
interface DebaterResponse {
  message: string;
  fallacyUsedSlug: string;
}
export type DebaterContext = "political" | "religious" | "media" | "everyday";

export function useDebaterSession(lang: "ar" | "en") {
  const [context, setContext] = useState<DebaterContext | null>(null);
  const [history, setHistory] = useState<Turn[]>([]);
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

  function fetchOpponentTurn(currentHistory: Turn[], ctx: DebaterContext) {
    setIsLoading(true);
    setError(null);
    apiClient
      .post<DebaterResponse>("/api/debater/turn", {
        history: currentHistory,
        lang,
        preferredContext: ctx,
      })
      .then((res) => {
        setHistory((h) => [
          ...h,
          { speaker: "opponent", text: res.data.message },
        ]);
        setHiddenFallacySlug(res.data.fallacyUsedSlug);
        setGuessResult(null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }

  function start(ctx: DebaterContext) {
    setContext(ctx);
    fetchOpponentTurn([], ctx);
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
    setHistory(next); // فوراً — قبل أي انتظار
    fetchOpponentTurn(next, context);
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
  };
}
