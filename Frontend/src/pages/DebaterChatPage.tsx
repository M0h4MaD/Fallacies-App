// frontend/src/pages/DebaterChatPage.tsx (استبدله كامل)
import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { useDebaterSession } from '../hooks/useDebaterSession'
import { useUnlockedFallacies } from '../hooks/useUnlockedFallacies'

export default function DebaterChatPage() {
  const { i18n } = useTranslation()
  const lang = i18n.language === 'en' ? 'en' : 'ar'
  const { history, guessResult, isLoading, error, guess, reply, canGuess } = useDebaterSession(lang)
  const { fallacies } = useUnlockedFallacies()
  const [input, setInput] = useState('')

  function submitReply(e: FormEvent) {
    e.preventDefault()
    reply(input.trim())
    setInput('')
  }

  return (
    <div className="flex h-[calc(100vh-10rem)] flex-col">
      <h1 className="mb-4 font-heading text-2xl font-bold text-text">{lang === 'ar' ? 'ناظر خصمك' : 'Debate the Opponent'}</h1>

      <div className="flex-1 space-y-4 overflow-y-auto">
        {history.map((turn, i) => (
          <div key={i} className={turn.speaker === 'user' ? 'text-end' : 'text-start'}>
            <p className={['inline-block max-w-[85%] rounded-lg px-4 py-2', turn.speaker === 'user' ? 'bg-brand text-white' : 'border border-border bg-surface text-text'].join(' ')}>
              {turn.text}
            </p>
          </div>
        ))}
        {isLoading && <p className="text-text-muted">{lang === 'ar' ? '...عم يفكر الخصم' : 'Opponent is thinking...'}</p>}
      </div>

      {error && <p className="mt-2 text-flag">{error}</p>}

      {canGuess && !isLoading && (
        <div className="mt-4 border-t border-border pt-4">
          <p className="mb-3 text-sm text-text-muted">{lang === 'ar' ? 'شو المغالطة يلي استخدمها هلق؟' : 'What fallacy did they just use?'}</p>
          <div className="flex flex-wrap gap-2">
            {fallacies.map((f) => (
              <button key={f.slug} onClick={() => guess(f.slug)} className="rounded-lg border border-border px-3 py-1.5 text-sm text-text hover:bg-surface">
                {lang === 'ar' ? f.nameAr : f.nameEn}
              </button>
            ))}
          </div>
        </div>
      )}

      {guessResult && (
        <p className={['mt-4', guessResult.correct ? 'text-brand' : 'text-flag'].join(' ')}>
          {guessResult.correct
            ? (lang === 'ar' ? 'صح! لاحظتها.' : 'Correct — nice catch.')
            : (lang === 'ar' ? `مش هي — كانت "${fallacies.find((f) => f.slug === guessResult.actualSlug)?.nameAr ?? guessResult.actualSlug}".` : `Not quite — it was "${fallacies.find((f) => f.slug === guessResult.actualSlug)?.nameEn ?? guessResult.actualSlug}".`)}
        </p>
      )}

      {guessResult && (
        <form onSubmit={submitReply} className="mt-4 flex gap-2">
          <input value={input} onChange={(e) => setInput(e.target.value)} placeholder={lang === 'ar' ? 'ردّك...' : 'Your reply...'} className="flex-1 rounded-lg border border-border bg-surface px-4 py-2 text-text outline-none focus:border-brand" />
          <button type="submit" className="rounded-lg bg-brand px-5 py-2 font-medium text-white hover:bg-brand-hover">{lang === 'ar' ? 'إرسال' : 'Send'}</button>
        </form>
      )}
    </div>
  )
}