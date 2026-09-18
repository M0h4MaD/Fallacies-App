// frontend/src/hooks/useCorrectionSession.ts (ملف جديد)
import { useCallback, useEffect, useState } from 'react'
import { apiClient } from '../lib/apiClient'
import { useAuthStore } from '../store/authStore'
import type { Fallacy } from '../types'

interface CorrectionQuestion { text: { ar: string; en: string } }
interface EvaluatorResult { identifiedCorrectFallacy: boolean; rewriteRemovesFallacy: boolean; clarityScore: number; feedback: string }

export function useCorrectionSession(unlockedFallacies: Fallacy[], lang: 'ar' | 'en') {
  const level = useAuthStore((s) => s.appUser?.level ?? 1)
  const [targetFallacy, setTargetFallacy] = useState<Fallacy | null>(null)
  const [question, setQuestion] = useState<CorrectionQuestion | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [guessedSlug, setGuessedSlug] = useState<string | null>(null)
  const [rewriteText, setRewriteText] = useState('')
  const [result, setResult] = useState<EvaluatorResult | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const difficulty = level >= 8 ? 'advanced' : level >= 4 ? 'intermediate' : 'beginner'

  const loadNext = useCallback(() => {
    if (unlockedFallacies.length === 0) return
    setGuessedSlug(null); setRewriteText(''); setResult(null); setError(null); setIsLoading(true)
    const picked = unlockedFallacies[Math.floor(Math.random() * unlockedFallacies.length)]
    setTargetFallacy(picked)
    apiClient.get<CorrectionQuestion>(`/api/questions/${picked.slug}/next`, { params: { difficulty, mode: 'correction' } })
      .then((res) => setQuestion(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false))
  }, [unlockedFallacies, difficulty])

  useEffect(() => { loadNext() }, [loadNext])

  function guess(slug: string) { if (!guessedSlug) setGuessedSlug(slug) }

  async function submit() {
    if (!targetFallacy || !guessedSlug || !rewriteText.trim() || !question) return
    setIsSubmitting(true); setError(null)
    try {
      const { data } = await apiClient.post<EvaluatorResult>('/api/evaluator', {
        fallacySlug: targetFallacy.slug,
        originalText: lang === 'ar' ? question.text.ar : question.text.en,
        identifiedFallacySlug: guessedSlug,
        rewrittenText: rewriteText.trim(),
        lang,
      })
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return { question, isLoading, error, guessedSlug, guess, rewriteText, setRewriteText, submit, isSubmitting, result, loadNext }
}