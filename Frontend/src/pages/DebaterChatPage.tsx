// frontend/src/pages/DebaterChatPage.tsx (استبدله كامل)
import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  useDebaterSession,
  type DebaterContext,
} from "../hooks/useDebaterSession";
import { useUnlockedFallacies } from "../hooks/useUnlockedFallacies";
import LoadingTip from "../components/LoadingTip";
import { tapScale } from "../lib/motion";
import { Zap, Flame } from 'lucide-react'
const TOPICS: { key: DebaterContext; ar: string; en: string }[] = [
  { key: "everyday", ar: "عام", en: "Everyday" },
  { key: "political", ar: "سياسي", en: "Political" },
  { key: "religious", ar: "ديني", en: "Religious" },
  { key: "media", ar: "إعلامي", en: "Media" },
];

export default function DebaterChatPage() {
  const { i18n } = useTranslation();
  const lang = i18n.language === "en" ? "en" : "ar";
  const {
    context,
    start,
    history,
    guessResult,
    calloutStreak,
    isLoading,
    error,
    guess,
    reply,
    canGuess,
  } = useDebaterSession(lang);
  const { fallacies } = useUnlockedFallacies();
  const [input, setInput] = useState("");

  if (!context) {
    return (
      <div>
        <h1 className="mb-2 font-heading text-2xl font-bold text-text">
          {lang === "ar" ? "ناظر خصمك" : "Debate the Opponent"}
        </h1>
        <p className="mb-6 text-text-muted">
          {lang === "ar" ? "اختر موضوع النقاش:" : "Choose a topic:"}
        </p>
        <div className="flex flex-wrap gap-3">
          {TOPICS.map((t) => (
            <motion.button
              key={t.key}
              whileTap={tapScale}
              whileHover={{ y: -2 }}
              onClick={() => start(t.key)}
              className="rounded-xl border border-border bg-surface px-5 py-3 text-text hover:bg-bg"
            >
              {lang === "ar" ? t.ar : t.en}
            </motion.button>
          ))}
        </div>
        
        <Link
          to="/chat/ai"
          className="mt-8 block text-sm text-brand hover:text-brand-hover"
        >
          {lang === "ar"
            ? "أو حلّل نصّك الخاص بدل النقاش →"
            : "Or analyze your own text instead →"}
        </Link>
      </div>
    );
  }

  function submitReply(e: FormEvent) {
    e.preventDefault();
    reply(input.trim());
    setInput("");
  }

  return (
    <div className="flex h-[70vh] max-h-[42rem] flex-col">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold text-text">
          {lang === "ar" ? "ناظر خصمك" : "Debate the Opponent"}
        </h1>
        {calloutStreak >= 2 && (
          <motion.span
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-sm font-medium text-reward"
          >
            <Flame size={14} fill="currentColor" strokeWidth={0} /> {calloutStreak}
          </motion.span>
        )}
      </div>

      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto">
        <AnimatePresence initial={false}>
          {history.map((turn, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={turn.speaker === "user" ? "text-end" : "text-start"}
            >
              <p
                className={[
                  "inline-block max-w-[85%] rounded-lg px-4 py-2",
                  turn.speaker === "user"
                    ? "bg-brand text-white"
                    : "border border-border bg-surface text-text",
                ].join(" ")}
              >
                {turn.text}
              </p>
            </motion.div>
          ))}
        </AnimatePresence>
        {isLoading && <LoadingTip />}
      </div>

      {error && <p className="mt-2 text-flag">{error}</p>}

      <AnimatePresence>
        {canGuess && !isLoading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-4 rounded-xl border border-brand bg-brand/5 p-4"
          >
            <p className="mb-3 text-sm font-medium text-text">
              <Zap size={14} className="inline" />
              {lang === "ar"
                ? ` شو المغالطة يلي استخدمها هلق؟`
                : ` What fallacy did they just use?`}
            </p>
            <div className="flex flex-wrap gap-2">
              {fallacies.map((f) => (
                <motion.button
                  key={f.slug}
                  whileTap={tapScale}
                  onClick={() => guess(f.slug)}
                  className="rounded-lg border border-border bg-surface px-3 py-1.5 text-sm text-text hover:bg-bg"
                >
                  {lang === "ar" ? f.nameAr : f.nameEn}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {guessResult && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={[
            "mt-4",
            guessResult.correct ? "text-brand" : "text-flag",
          ].join(" ")}
        >
          {guessResult.correct
            ? lang === "ar"
              ? "صح! لاحظتها."
              : "Correct — nice catch."
            : lang === "ar"
              ? `مش هي — كانت "${fallacies.find((f) => f.slug === guessResult.actualSlug)?.nameAr ?? guessResult.actualSlug}".`
              : `Not quite — it was "${fallacies.find((f) => f.slug === guessResult.actualSlug)?.nameEn ?? guessResult.actualSlug}".`}
        </motion.p>
      )}

      {guessResult && (
        <form onSubmit={submitReply} className="mt-4 flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={lang === "ar" ? "ردّك..." : "Your reply..."}
            className="flex-1 rounded-lg border border-border bg-surface px-4 py-2 text-text outline-none focus:border-brand"
          />
          <motion.button
            whileTap={tapScale}
            type="submit"
            className="rounded-lg bg-brand px-5 py-2 font-medium text-white hover:bg-brand-hover"
          >
            {lang === "ar" ? "إرسال" : "Send"}
          </motion.button>
        </form>
      )}
    </div>
  );
}
