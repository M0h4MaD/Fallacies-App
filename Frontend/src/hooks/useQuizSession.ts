// frontend/src/hooks/useQuizSession.ts (استبدله كامل)
import { useEffect, useState } from "react";
import { apiClient } from "../lib/apiClient";
import { useAuthStore, applyQuizResult } from "../store/authStore";

interface LiveQuestion {
  text: { ar: string; en: string };
  embeddedFallacyId: string;
  difficultyTier: "beginner" | "intermediate" | "advanced";
  contextType: string;
}
interface SubmitResult {
  scorePercent: number;
  xpAwarded: number;
  newLevel: number;
  streakCurrent: number;
  badgeIds: string[];
  perFallacyBreakdown: Record<string, { correct: number; total: number }>;
}

const QUESTIONS_PER_SESSION = 5;

export function useQuizSession(fallacySlug: string) {
  const level = useAuthStore((s) => s.appUser?.level ?? 1);
  const [round, setRound] = useState(0);
  const [question, setQuestion] = useState<LiveQuestion | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hintUsedThisQuestion, setHintUsedThisQuestion] = useState(false);
  const [answers, setAnswers] = useState<
    {
      fallacyId: string;
      difficultyTier: LiveQuestion["difficultyTier"];
      wasCorrect: boolean;
    }[]
  >([]);
  const [revealed, setRevealed] = useState(false);
  const [wasCorrectLast, setWasCorrectLast] = useState(false);
  const [result, setResult] = useState<SubmitResult | null>(null);
  const [startTime] = useState(() => Date.now());

  const isFinished = round >= QUESTIONS_PER_SESSION;
  const difficulty =
    level >= 8 ? "advanced" : level >= 4 ? "intermediate" : "beginner";

  useEffect(() => {
    if (isFinished) return;
    setIsLoading(true);
    setError(null);
    apiClient
      .get<LiveQuestion>(`/api/questions/${fallacySlug}/next`, {
        params: { difficulty },
      })
      .then((res) => setQuestion(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [round, isFinished, fallacySlug, difficulty]);

  useEffect(() => {
    if (!isFinished || result) return;
    apiClient
      .post<SubmitResult>("/api/quiz/submit", {
        mode: "scenario",
        timeSpentSec: Math.round((Date.now() - startTime) / 1000),
        answers: answers.map((a) => a),
      })
      .then((res) => {
        setResult(res.data);
        applyQuizResult(res.data);
      })
      .catch((err) => setError(err.message));
  }, [isFinished, result, answers, startTime]);

  function answer(saidSpotted: boolean) {
    if (revealed || !question) return;
    setWasCorrectLast(saidSpotted);
    setRevealed(true);
    setAnswers((prev) => [
      ...prev,
      {
        fallacyId: question.embeddedFallacyId,
        difficultyTier: question.difficultyTier,
        wasCorrect: saidSpotted,
        hintUsed: hintUsedThisQuestion,
      },
    ]);
    setHintUsedThisQuestion(false);
  }

  function next() {
    setRevealed(false);
    setRound((r) => r + 1);
  }

function markHintUsed() { setHintUsedThisQuestion(true) }

  return {
    question,
    isLoading,
    error,
    revealed,
    wasCorrectLast,
    answer,
    next,
    isFinished,
    result,
    answeredCount: round,
    totalQuestions: QUESTIONS_PER_SESSION,
    markHintUsed
  };
}
