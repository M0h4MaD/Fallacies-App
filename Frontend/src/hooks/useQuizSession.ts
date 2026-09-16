// frontend/src/hooks/useQuizSession.ts (ملف جديد)
// Owns all quiz-session state so QuizPage stays pure UI. Swapping mock questions for
// live Gemini ones (Phase 5), or persisting results server-side (Phase 4), touches only this file.
import { useMemo, useState } from 'react'
import { mockQuizQuestions } from '../data/quiz.mock'

interface AnsweredQuestion {
  fallacySlug: string
  wasCorrect: boolean
}

export function useQuizSession() {
  const [index, setIndex] = useState(0)
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null)
  const [answers, setAnswers] = useState<AnsweredQuestion[]>([])

  const question = mockQuizQuestions[index]
  const isFinished = index >= mockQuizQuestions.length
  const isLastQuestion = index === mockQuizQuestions.length - 1

  const options = useMemo(() => {
    if (!question) return []
    return [question.correctSlug, ...question.distractorSlugs].sort(() => Math.random() - 0.5)
  }, [question])

  function selectAnswer(slug: string) {
    if (selectedSlug || !question) return
    setSelectedSlug(slug)
    setAnswers((prev) => [...prev, { fallacySlug: question.correctSlug, wasCorrect: slug === question.correctSlug }])
  }

  function next() {
    setSelectedSlug(null)
    setIndex((i) => i + 1)
  }

  const report = useMemo(() => {
    if (!isFinished) return null
    const correct = answers.filter((a) => a.wasCorrect).length
    const perFallacyBreakdown: Record<string, { correct: number; total: number }> = {}
    for (const a of answers) {
      perFallacyBreakdown[a.fallacySlug] ??= { correct: 0, total: 0 }
      perFallacyBreakdown[a.fallacySlug].total += 1
      if (a.wasCorrect) perFallacyBreakdown[a.fallacySlug].correct += 1
    }
    return { scorePercent: Math.round((correct / answers.length) * 100), perFallacyBreakdown }
  }, [isFinished, answers])

  return {
    question, options, selectedSlug, selectAnswer, next, isLastQuestion, isFinished, report,
    totalQuestions: mockQuizQuestions.length, currentNumber: index + 1,
  }
}