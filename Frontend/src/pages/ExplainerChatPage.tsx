// frontend/src/pages/ExplainerChatPage.tsx (استبدله كامل)
import { useState, type FormEvent } from 'react'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { apiClient } from '../lib/apiClient'

interface ChatMessage { role: 'user' | 'assistant'; text: string }

export default function ExplainerChatPage() {
  const { fallacySlug } = useParams<{ fallacySlug: string }>()
  const { i18n } = useTranslation()
  const lang = i18n.language === 'en' ? 'en' : 'ar'
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!fallacySlug) return null

  async function send(e: FormEvent) {
    e.preventDefault()
    const question = input.trim()
    if (!question || isSending) return
    setMessages((m) => [...m, { role: 'user', text: question }])
    setInput('')
    setIsSending(true)
    setError(null)
    try {
      const { data } = await apiClient.post<{ answer: string }>('/api/explainer', { fallacySlug, question, lang })
      setMessages((m) => [...m, { role: 'assistant', text: data.answer }])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error')
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="flex h-[calc(100vh-10rem)] flex-col">
      <h1 className="mb-4 font-heading text-2xl font-bold text-text">{lang === 'ar' ? 'اسأل عن هالمغالطة' : 'Ask about this fallacy'}</h1>
      <div className="flex-1 space-y-4 overflow-y-auto">
        {messages.length === 0 && (
          <p className="text-text-muted">{lang === 'ar' ? 'اسأل أي سؤال عن هالمغالطة، وين بتظهر، وكيف تميّزها.' : 'Ask anything about this fallacy — where it shows up, how to spot it.'}</p>
        )}
        {messages.map((m, i) => (
          <div key={i} className={m.role === 'user' ? 'text-end' : 'text-start'}>
            <p className={['inline-block max-w-[85%] rounded-lg px-4 py-2', m.role === 'user' ? 'bg-brand text-white' : 'border border-border bg-surface text-text'].join(' ')}>
              {m.text}
            </p>
          </div>
        ))}
        {isSending && <p className="text-text-muted">{lang === 'ar' ? '...عم يفكر' : 'Thinking...'}</p>}
      </div>
      {error && <p className="mt-2 text-flag">{error}</p>}
      <form onSubmit={send} className="mt-4 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={lang === 'ar' ? 'اكتب سؤالك...' : 'Type your question...'}
          className="flex-1 rounded-lg border border-border bg-surface px-4 py-2 text-text outline-none focus:border-brand"
        />
        <button type="submit" disabled={isSending} className="rounded-lg bg-brand px-5 py-2 font-medium text-white hover:bg-brand-hover disabled:opacity-50">
          {lang === 'ar' ? 'إرسال' : 'Send'}
        </button>
      </form>
    </div>
  )
}