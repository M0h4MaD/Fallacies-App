// frontend/src/hooks/useDebaterSession.ts (ملف جديد)
import { useEffect, useState } from 'react'
import { apiClient } from '../lib/apiClient'

interface Turn { speaker: 'user' | 'opponent'; text: string }
interface DebaterResponse { message: string; fallacyUsedSlug: string }

export function useDebaterSession(lang: 'ar' | 'en') {
  const [history, setHistory] = useState<Turn[]>([])
  const [hiddenFallacySlug, setHiddenFallacySlug] = useState<string | null>(null)
  const [guessResult, setGuessResult] = useState<{ correct: boolean; actualSlug: string } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  function fetchOpponentTurn(nextHistory: Turn[]) {
    setIsLoading(true)
    setError(null)
    apiClient.post<DebaterResponse>('/api/debater/turn', { history: nextHistory, lang })
      .then((res) => {
        setHistory([...nextHistory, { speaker: 'opponent', text: res.data.message }])
        setHiddenFallacySlug(res.data.fallacyUsedSlug)
        setGuessResult(null)
      })
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false))
  }

  useEffect(() => { fetchOpponentTurn([]) }, []) // eslint-disable-line react-hooks/exhaustive-deps

  function guess(slug: string) {
    if (!hiddenFallacySlug || guessResult) return
    setGuessResult({ correct: slug === hiddenFallacySlug, actualSlug: hiddenFallacySlug })
  }

  function reply(text: string) {
    if (!text.trim() || isLoading) return
    fetchOpponentTurn([...history, { speaker: 'user', text }])
  }

  return { history, guessResult, isLoading, error, guess, reply, canGuess: hiddenFallacySlug !== null && !guessResult }
}