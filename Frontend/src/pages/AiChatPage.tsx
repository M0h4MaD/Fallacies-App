import { useEffect, useState, type FormEvent } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { apiClient } from "../lib/apiClient";
import LoadingTip from "../components/LoadingTip";
import StreamText from "../components/StreamText";
import { tapScale } from "../lib/motion";
import type { Fallacy } from "../types";

interface ChatMessage {
  role: "user" | "assistant";
  text: string;
  fallacySlug?: string;
}
interface DetectResult {
  hasFallacy: boolean;
  fallacySlug: string;
  explanation: string;
}
const SUGGESTED_KEYS = ["everyday", "spot", "why"] as const;
const SUGGESTED: Record<
  (typeof SUGGESTED_KEYS)[number],
  { ar: string; en: string }
> = {
  everyday: {
    ar: "وين ممكن أشوفها بحياتي اليومية؟",
    en: "Where might I see this in everyday life?",
  },
  spot: { ar: "كيف أميّزها بسرعة؟", en: "How do I spot it quickly?" },
  why: {
    ar: "ليش الناس بتقع فيها بسهولة؟",
    en: "Why do people fall for it so easily?",
  },
};

export default function AiChatPage() {
  const { fallacySlug } = useParams<{ fallacySlug?: string }>();
  const { i18n } = useTranslation();
  const lang = i18n.language === "en" ? "en" : "ar";
  const [fallacy, setFallacy] = useState<Fallacy | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMessages([]);
    setFallacy(null);
    if (fallacySlug) {
      apiClient
        .get<Fallacy>(`/api/fallacies/${fallacySlug}`)
        .then((r) => setFallacy(r.data))
        .catch((err) => setError(err instanceof Error ? err.message : "Error"));
    }
  }, [fallacySlug]);

  async function sendExplainer(text: string) {
    if (!text.trim() || isSending || !fallacySlug) return;
    setMessages((m) => [...m, { role: "user", text: text.trim() }]);
    setInput("");
    setIsSending(true);
    setError(null);
    try {
      const { data } = await apiClient.post<{ answer: string }>(
        "/api/explainer",
        { fallacySlug, question: text.trim(), lang },
      );
      setMessages((m) => [...m, { role: "assistant", text: data.answer }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setIsSending(false);
    }
  }

  async function sendAnalyze(text: string) {
    if (!text.trim() || isSending) return;
    setMessages((m) => [...m, { role: "user", text: text.trim() }]);
    setInput("");
    setIsSending(true);
    setError(null);
    try {
      const { data } = await apiClient.post<DetectResult>("/api/detector", {
        text: text.trim(),
        lang,
      });
      const replyText = data.hasFallacy
        ? lang === "ar"
          ? `⚠️ في مغالطة محتملة. ${data.explanation}`
          : `⚠️ Possible fallacy. ${data.explanation}`
        : lang === "ar"
          ? `✓ ما في مغالطة واضحة. ${data.explanation}`
          : `✓ No clear fallacy. ${data.explanation}`;
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          text: replyText,
          fallacySlug:
            data.hasFallacy && data.fallacySlug !== "none"
              ? data.fallacySlug
              : undefined,
        },
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setIsSending(false);
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (fallacySlug) {
      sendExplainer(input);
    } else {
      sendAnalyze(input);
    }
  }

  return (
    <div>
      <h1 className="mb-1 font-heading text-2xl font-extrabold text-text">
        {fallacySlug
          ? `${lang === "ar" ? "اسأل عن" : "Ask about"}: ${fallacy ? (lang === "ar" ? fallacy.nameAr : fallacy.nameEn) : "..."}`
          : lang === "ar"
            ? "محادثة الذكاء الاصطناعي"
            : "AI Chat"}
      </h1>
      {!fallacySlug && (
        <p className="mb-4 text-sm text-text-muted">
          {lang === "ar"
            ? "الصق جملة أو حجة، ومنقلّك إذا فيها مغالطة منطقية وليش."
            : "Paste a sentence or argument, and we'll tell you if it contains a logical fallacy and why."}
        </p>
      )}

      <div className="mb-4 min-h-[40vh] max-h-[55vh] space-y-4 overflow-y-auto rounded-xl border border-border bg-bg p-4">
        {messages.length === 0 &&
          (fallacySlug ? (
            <div>
              <p className="mb-4 text-text-muted">
                {lang === "ar"
                  ? "اسأل أي سؤال عن هالمغالطة، وين بتظهر، وكيف تميّزها."
                  : "Ask anything about this fallacy — where it shows up, how to spot it."}
              </p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_KEYS.map((key) => (
                  <motion.button
                    key={key}
                    whileTap={tapScale}
                    whileHover={{ y: -2 }}
                    onClick={() => sendExplainer(SUGGESTED[key][lang])}
                    className="rounded-full border border-border bg-surface px-3 py-1.5 text-sm text-text shadow-sm transition-shadow duration-200 hover:shadow-[var(--shadow-elevated)]"
                  >
                    {SUGGESTED[key][lang]}
                  </motion.button>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-text-muted">
              {lang === "ar"
                ? 'مثلاً: "كل الناس يلي بيعرفهم بيوافقوني، فلازم أكون محق."'
                : 'e.g. "Everyone I know agrees with me, so I must be right."'}
            </p>
          ))}
        <AnimatePresence initial={false}>
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={m.role === "user" ? "text-end" : "text-start"}
            >
              <p
                className={[
                  "inline-block max-w-[85%] rounded-xl px-4 py-2 shadow-sm",
                  m.role === "user"
                    ? "bg-brand text-white"
                    : "border border-border bg-surface text-text",
                ].join(" ")}
              >
                {m.role === "assistant" && i === messages.length - 1 ? (
                  <StreamText text={m.text} />
                ) : (
                  m.text
                )}
              </p>
              {m.fallacySlug && (
                <Link
                  to={`/quiz/${m.fallacySlug}`}
                  className="mt-1 block text-sm font-medium text-brand hover:text-brand-hover"
                >
                  {lang === "ar"
                    ? "تمرّن على هالمغالطة →"
                    : "Practice this fallacy →"}
                </Link>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        {isSending && <LoadingTip fallacySlug={fallacySlug} />}
      </div>

      {error && <p className="mt-2 text-flag">{error}</p>}
      <form onSubmit={onSubmit} className="mt-4 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            fallacySlug
              ? lang === "ar"
                ? "اكتب سؤالك..."
                : "Type your question..."
              : lang === "ar"
                ? "الصق نص هون..."
                : "Paste text here..."
          }
          className="min-w-0 flex-1 rounded-lg border border-border bg-surface px-4 py-2 text-text shadow-sm outline-none focus:border-brand"
        />
        <motion.button
          whileTap={tapScale}
          type="submit"
          disabled={isSending}
          className="rounded-lg bg-brand px-5 py-2 font-medium text-white shadow-[var(--shadow-brand)] hover:bg-brand-hover disabled:opacity-50 disabled:shadow-none"
        >
          {lang === "ar" ? "إرسال" : "Send"}
        </motion.button>
      </form>
    </div>
  );
}
