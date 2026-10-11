import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Zap, Flame } from "lucide-react";
import {
  useDebaterSession,
  type DebaterContext,
  type DebaterDifficulty,
} from "../hooks/useDebaterSession";
import { useFallacies } from "../hooks/useFallacies";
import LoadingTip from "../components/LoadingTip";
import { tapScale } from "../lib/motion";

const TOPICS: { key: DebaterContext; ar: string; en: string }[] = [
  { key: "everyday", ar: "عام", en: "Everyday" },
  { key: "political", ar: "سياسي", en: "Political" },
  { key: "religious", ar: "ديني", en: "Religious" },
  { key: "media", ar: "إعلامي", en: "Media" },
];
const DIFFICULTIES: { key: DebaterDifficulty; ar: string; en: string }[] = [
  { key: "beginner", ar: "مبتدئ", en: "Beginner" },
  { key: "intermediate", ar: "متوسط", en: "Intermediate" },
  { key: "advanced", ar: "متقدم", en: "Advanced" },
];

export default function DebaterChatPage() {
  const { i18n } = useTranslation();
  const lang = i18n.language === "en" ? "en" : "ar";
  const { fallacies } = useFallacies();
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
    guessOptions,
  } = useDebaterSession(lang, fallacies);
  const [input, setInput] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] =
    useState<DebaterDifficulty>("beginner");

  if (!context) {
    return (
      <div>
        <h1 className="mb-2 font-heading text-2xl font-extrabold text-text">
          {lang === "ar" ? "ناظر خصمك" : "Debate the Opponent"}
        </h1>
        <p className="mb-3 text-text-muted">
          {lang === "ar" ? "اختر موضوع النقاش:" : "Choose a topic:"}
        </p>
        <div className="mb-6 flex flex-wrap gap-3">
          {TOPICS.map((t) => (
            <button
              key={t.key}
              onClick={() => start(t.key, selectedDifficulty)}
              className="rounded-2xl border border-border bg-surface px-5 py-3 text-text shadow-sm hover:shadow-[var(--shadow-elevated)]"
            >
              {lang === "ar" ? t.ar : t.en}
            </button>
          ))}
        </div>
        <p className="mb-3 text-sm text-text-muted">
          {lang === "ar" ? "صعوبة المناظرة:" : "Debate difficulty:"}
        </p>
        <div className="mb-8 flex gap-2">
          {DIFFICULTIES.map((d) => (
            <button
              key={d.key}
              onClick={() => setSelectedDifficulty(d.key)}
              className={[
                "rounded-full border px-4 py-2 text-sm",
                selectedDifficulty === d.key
                  ? "border-brand bg-brand text-white"
                  : "border-border text-text-muted hover:bg-surface",
              ].join(" ")}
            >
              {lang === "ar" ? d.ar : d.en}
            </button>
          ))}
        </div>
        <Link
          to="/chat/ai"
          className="block text-sm text-brand hover:text-brand-hover"
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
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="font-heading text-2xl font-extrabold text-text">
          {lang === "ar" ? "ناظر خصمك" : "Debate the Opponent"}
        </h1>
        {calloutStreak >= 2 && (
          <motion.span
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center gap-1 text-sm font-medium text-reward"
          >
            <Flame size={14} fill="currentColor" strokeWidth={0} />{" "}
            {calloutStreak}
          </motion.span>
        )}
      </div>

      <div className="mb-4 min-h-[40vh] max-h-[55vh] space-y-4 overflow-y-auto rounded-xl border border-border bg-bg p-4">
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
                  "inline-block max-w-[85%] rounded-xl px-4 py-2 shadow-sm",
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

      {error && <p className="mb-2 text-flag">{error}</p>}
      <AnimatePresence>
        {canGuess && !isLoading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-4 rounded-2xl border border-brand bg-brand/5 p-4 shadow-[var(--shadow-brand)]"
          >
            <p className="mb-3 flex items-center gap-1.5 text-sm font-medium text-text">
              <Zap size={14} className="text-brand" />{" "}
              {lang === "ar"
                ? "شو المغالطة يلي استخدمها هلق؟"
                : "What fallacy did they just use?"}
            </p>
            <div className="flex flex-wrap gap-2">
              {guessOptions.map((f) => (
                <motion.button
                  key={f.slug}
                  whileTap={tapScale}
                  onClick={() => guess(f.slug)}
                  className="rounded-lg border border-border bg-surface px-3 py-1.5 text-sm text-text shadow-sm hover:bg-bg"
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
            "mb-4",
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
        <form onSubmit={submitReply} className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={lang === "ar" ? "ردّك..." : "Your reply..."}
            className="min-w-0 flex-1 rounded-lg border border-border bg-surface px-4 py-2 text-text shadow-sm outline-none focus:border-brand"
          />
          <motion.button
            whileTap={tapScale}
            type="submit"
            className="rounded-lg bg-brand px-5 py-2 font-medium text-white shadow-[var(--shadow-brand)] hover:bg-brand-hover"
          >
            {lang === "ar" ? "إرسال" : "Send"}
          </motion.button>
        </form>
      )}
    </div>
  );
}
