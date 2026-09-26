// frontend/src/hooks/useQuizSession.ts (استبدله كامل — موحّد: مغالطة وحدة أو عدة، مع كل ميزات الفاز الغنية)
import { useEffect, useState } from "react";
import { apiClient } from "../lib/apiClient";
import { useAuthStore, applyQuizResult } from "../store/authStore";
import type { Fallacy } from "../types";

interface LiveQuestion {
  text: { ar: string; en: string };
  embeddedFallacyId: string;
  difficultyTier: "beginner" | "intermediate" | "advanced";
  contextType?: string;
  explanation?: { ar: string; en: string } | null;
}
interface SubmitResult {
  scorePercent: number;
  xpAwarded: number;
  newLevel: number;
  previousLevel: number;
  xpToNextLevel: number;
  streakCurrent: number;
  badgeIds: string[];
  newlyUnlockedBadgeIds: string[];
  perFallacyBreakdown: Record<string, { correct: number; total: number }>;
}
const QUESTIONS_PER_SESSION = 5;

export function useQuizSession(pool: Fallacy[], contexts: string[]) {
  const level = useAuthStore((s) => s.appUser?.level ?? 1);
  const [round, setRound] = useState(0);
  const [question, setQuestion] = useState<LiveQuestion | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<
    {
      fallacyId: string;
      difficultyTier: LiveQuestion["difficultyTier"];
      wasCorrect: boolean;
      hintUsed: boolean;
    }[]
  >([]);
  const [revealed, setRevealed] = useState(false);
  const [wasCorrectLast, setWasCorrectLast] = useState(false);
  const [hintUsedThisQuestion, setHintUsedThisQuestion] = useState(false);
  const [reportSent, setReportSent] = useState(false);
  const [result, setResult] = useState<SubmitResult | null>(null);
  const [startTime] = useState(() => Date.now());

  const isFinished = round >= QUESTIONS_PER_SESSION;
  const difficulty =
    level >= 8 ? "advanced" : level >= 4 ? "intermediate" : "beginner";
  let combo = 0;
  for (let i = answers.length - 1; i >= 0 && answers[i].wasCorrect; i--)
    combo++;

  useEffect(() => {
    if (isFinished || pool.length === 0) return;
    const picked = pool[Math.floor(Math.random() * pool.length)];
    if (!picked) return;
    let cancelled = false;
    const params: Record<string, string> = { difficulty };
    if (contexts.length > 0)
      params.context = contexts[Math.floor(Math.random() * contexts.length)];
    apiClient
      .get<LiveQuestion>(`/api/questions/${picked.slug}/next`, { params })
      .then((res) => {
        if (!cancelled) setQuestion(res.data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round, isFinished, difficulty]);

  useEffect(() => {
    if (!isFinished || result) return;
    apiClient
      .post<SubmitResult>(
        "/api/quiz/submit",
        {
          mode: "scenario",
          timeSpentSec: Math.round((Date.now() - startTime) / 1000),
          answers,
        },
        { headers: { "Idempotency-Key": `quiz-${startTime}` } },
      )
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
  }
  function markHintUsed() {
    setHintUsedThisQuestion(true);
  }
  function reportQuestion() {
    if (!question || reportSent) return;
    apiClient
      .post("/api/reports", {
        contentType: "question",
        contentText: question.text.ar,
      })
      .then(() => setReportSent(true));
  }
  function next() {
    setRevealed(false);
    setHintUsedThisQuestion(false);
    setReportSent(false);
    setIsLoading(true);
    setRound((r) => r + 1);
  }

  const fallacyHint = question
    ? pool.find((f) => f.id === question.embeddedFallacyId)
    : undefined;

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
    combo,
    answeredCount: round,
    totalQuestions: QUESTIONS_PER_SESSION,
    fallacyHint: fallacyHint
      ? { ar: fallacyHint.definitionAr, en: fallacyHint.definitionEn }
      : null,
    hintUsedThisQuestion,
    markHintUsed,
    reportSent,
    reportQuestion,
  };
}
