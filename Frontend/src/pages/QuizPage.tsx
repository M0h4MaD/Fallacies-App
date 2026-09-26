// frontend/src/pages/QuizPage.tsx (استبدله كامل — موحّد: إعداد يختار موضوع + مغالطات محدّدة، وrunner واحد لكل الحالات)
import { useMemo, useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Lightbulb, Flag, Flame, Trophy, Award, Search } from "lucide-react";
import { useQuizSession } from "../hooks/useQuizSession";
import { useUnlockedFallacies } from "../hooks/useUnlockedFallacies";
import LoadingTip from "../components/LoadingTip";
import CountUp from "../components/CountUp";
import ExampleDisclaimer from "../components/ExampleDisclaimer";
import AchievementCard from "../components/AchievementCard";
import { BADGE_LABELS } from "../lib/badgeLabels";
import { playCorrect, playIncorrect, playLevelUp } from "../lib/sound";
import { tapScale } from "../lib/motion";
import type { Fallacy } from "../types";

const CONTEXTS = [
  { key: "political", ar: "سياسي", en: "Political" },
  { key: "religious", ar: "ديني", en: "Religious" },
  { key: "media", ar: "إعلامي", en: "Media" },
  { key: "everyday", ar: "عام", en: "Everyday" },
];

export default function QuizPage() {
  const [searchParams] = useSearchParams();
  const { i18n } = useTranslation();
  const lang = i18n.language === "en" ? "en" : "ar";
  const { fallacies } = useUnlockedFallacies();
  if (fallacies.length === 0) return <LoadingTip />;
  return (
    <QuizFlow
      fallacies={fallacies}
      preselectSlug={searchParams.get("fallacy")}
      lang={lang}
    />
  );
}

function QuizFlow({
  fallacies,
  preselectSlug,
  lang,
}: {
  fallacies: Fallacy[];
  preselectSlug: string | null;
  lang: "ar" | "en";
}) {
  const [selectedContexts, setSelectedContexts] = useState<string[]>([]);
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>(
    preselectSlug ? [preselectSlug] : [],
  );
  const [search, setSearch] = useState("");
  const [started, setStarted] = useState(!!preselectSlug);

  const pool = useMemo(
    () =>
      selectedSlugs.length > 0
        ? fallacies.filter((f) => selectedSlugs.includes(f.slug))
        : fallacies,
    [fallacies, selectedSlugs],
  );
  if (started)
    return <QuizRunner pool={pool} contexts={selectedContexts} lang={lang} />;

  function toggleContext(ctx: string) {
    setSelectedContexts((prev) =>
      prev.includes(ctx) ? prev.filter((c) => c !== ctx) : [...prev, ctx],
    );
  }
  function toggleFallacy(slug: string) {
    setSelectedSlugs((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug],
    );
  }
  const filteredFallacies = fallacies.filter(
    (f) =>
      f.nameAr.includes(search) ||
      f.nameEn.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div>
      <h1 className="mb-2 font-heading text-2xl font-extrabold text-text">
        {lang === "ar" ? "كويز" : "Quiz"}
      </h1>
      <p className="mb-3 text-sm text-text-muted">
        {lang === "ar"
          ? "اختر موضوع واحد أو أكتر (اختياري):"
          : "Pick one or more topics (optional):"}
      </p>
      <div className="mb-6 flex flex-wrap gap-2">
        {CONTEXTS.map((c) => (
          <button
            key={c.key}
            onClick={() => toggleContext(c.key)}
            className={[
              "rounded-full border px-4 py-2 text-sm font-medium",
              selectedContexts.includes(c.key)
                ? "border-brand bg-brand text-white shadow-[var(--shadow-brand)]"
                : "border-border bg-surface text-text shadow-sm hover:shadow-[var(--shadow-elevated)]",
            ].join(" ")}
          >
            {lang === "ar" ? c.ar : c.en}
          </button>
        ))}
      </div>
      <p className="mb-3 text-sm text-text-muted">
        {lang === "ar"
          ? "اختر مغالطات محدّدة (اختياري — اتركها فاضية للكل):"
          : "Pick specific fallacies (optional — leave empty for all):"}
      </p>
      <div className="relative mb-3">
        <Search
          size={15}
          className="pointer-events-none absolute top-1/2 -translate-y-1/2 start-3 text-text-muted"
        />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={lang === "ar" ? "ابحث..." : "Search..."}
          className="w-full rounded-lg border border-border bg-surface py-2 ps-9 pe-3 text-sm text-text outline-none focus:border-brand"
        />
      </div>
      <div className="mb-2 max-h-56 overflow-y-auto rounded-xl border border-border bg-bg p-3">
        <div className="flex flex-wrap gap-2">
          {filteredFallacies.map((f) => (
            <button
              key={f.slug}
              onClick={() => toggleFallacy(f.slug)}
              className={[
                "rounded-lg border px-3 py-1.5 text-sm",
                selectedSlugs.includes(f.slug)
                  ? "border-brand bg-brand text-white"
                  : "border-border bg-surface text-text hover:bg-surface",
              ].join(" ")}
            >
              {lang === "ar" ? f.nameAr : f.nameEn}
            </button>
          ))}
        </div>
      </div>
      <p className="mb-6 text-sm text-text-muted">
        {selectedSlugs.length > 0
          ? `${selectedSlugs.length} ${lang === "ar" ? "محدّدة" : "selected"}`
          : "\u00A0"}
      </p>
      <button
        onClick={() => setStarted(true)}
        disabled={pool.length === 0}
        className="rounded-lg bg-brand px-6 py-3 font-medium text-white shadow-[var(--shadow-brand)] hover:bg-brand-hover disabled:opacity-50"
      >
        {lang === "ar" ? "ابدأ" : "Start"}
      </button>
    </div>
  );
}

function QuizRunner({
  pool,
  contexts,
  lang,
}: {
  pool: Fallacy[];
  contexts: string[];
  lang: "ar" | "en";
}) {
  const {
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
    answeredCount,
    totalQuestions,
    fallacyHint,
    hintUsedThisQuestion,
    markHintUsed,
    reportSent,
    reportQuestion,
  } = useQuizSession(pool, contexts);

  useEffect(() => {
    if (result && result.newLevel > result.previousLevel) playLevelUp();
  }, [result]);
  function handleAnswer(saidSpotted: boolean) {
    if (saidSpotted) playCorrect();
    else playIncorrect();
    answer(saidSpotted);
  }

  if (isFinished) {
    if (!result) return <LoadingTip />;
    const leveledUp = result.newLevel > result.previousLevel;
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-2xl border border-border bg-surface p-8 shadow-[var(--shadow-elevated)]"
      >
        <h1 className="mb-6 font-heading text-3xl font-extrabold text-text">
          {lang === "ar" ? "نتيجة الجلسة" : "Session Result"}
        </h1>
        <div className="mb-2 flex items-baseline gap-1">
          <CountUp
            value={result.scorePercent}
            className="font-heading text-6xl font-extrabold text-brand"
          />
          <span className="font-heading text-3xl font-extrabold text-brand">
            %
          </span>
        </div>
        <p className="mb-6 text-text-muted">
          +
          <CountUp value={result.xpAwarded} className="font-medium text-text" />{" "}
          {lang === "ar" ? "نقطة خبرة" : "XP"}
        </p>
        {leveledUp && (
          <>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.2,
                type: "spring",
                stiffness: 300,
                damping: 22,
              }}
              className="mb-6 flex items-center justify-center gap-2 rounded-2xl border border-reward bg-reward/10 p-4 text-center shadow-[var(--shadow-brand)]"
            >
              <Trophy size={20} className="text-reward" strokeWidth={1.75} />
              <p className="font-heading text-lg font-bold text-text">
                {lang === "ar"
                  ? `وصلت مستوى ${result.newLevel}!`
                  : `Level ${result.newLevel}!`}
              </p>
            </motion.div>
            <div className="mb-6">
              <AchievementCard
                titleAr={`وصلت المستوى ${result.newLevel}! 🎉`}
                titleEn={`Reached Level ${result.newLevel}! 🎉`}
                subtitleAr={`+${result.xpAwarded} نقطة خبرة اليوم`}
                subtitleEn={`+${result.xpAwarded} XP today`}
                lang={lang}
              />
            </div>
          </>
        )}
        {result.newlyUnlockedBadgeIds.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
            {result.newlyUnlockedBadgeIds.map((id, i) => (
              <motion.span
                key={id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="flex items-center gap-1.5 rounded-xl border border-reward bg-surface px-3 py-1.5 text-sm text-text shadow-sm"
              >
                <Award size={14} className="text-reward" />{" "}
                {BADGE_LABELS[id]?.[lang] ?? id}
              </motion.span>
            ))}
          </div>
        )}
        {!leveledUp && result.xpToNextLevel > 0 && (
          <p className="mb-6 text-sm text-text-muted">
            {lang === "ar"
              ? `${result.xpToNextLevel} نقطة متبقية للمستوى ${result.newLevel + 1}`
              : `${result.xpToNextLevel} XP to level ${result.newLevel + 1}`}
          </p>
        )}
        <Link
          to="/library"
          className="inline-block rounded-lg bg-brand px-6 py-3 font-medium text-white shadow-[var(--shadow-brand)] transition-colors hover:bg-brand-hover"
        >
          {lang === "ar" ? "رجوع للمكتبة" : "Back to Library"}
        </Link>
      </motion.div>
    );
  }
  if (error) return <p className="text-flag">{error}</p>;
  if (isLoading || !question) return <LoadingTip />;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-text-muted">
          {lang === "ar"
            ? `${answeredCount + 1} من ${totalQuestions}`
            : `${answeredCount + 1} of ${totalQuestions}`}
        </p>
        {combo >= 2 && (
          <motion.span
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center gap-1 text-sm font-medium text-reward"
          >
            <Flame size={14} fill="currentColor" strokeWidth={0} /> {combo}{" "}
            {lang === "ar" ? "متتالية" : "in a row"}
          </motion.span>
        )}
      </div>
      <AnimatePresence mode="wait">
        <motion.p
          key={question.text.ar}
          initial={{ opacity: 0, x: lang === "ar" ? 12 : -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25 }}
          className="mb-1 whitespace-pre-line font-heading text-2xl font-bold text-text"
        >
          "{lang === "ar" ? question.text.ar : question.text.en}"
        </motion.p>
      </AnimatePresence>
      <ExampleDisclaimer contextType={question.contextType} />
      {!revealed && (
        <div className="mb-6 mt-4 flex gap-4 text-sm text-text-muted">
          <button
            onClick={markHintUsed}
            disabled={hintUsedThisQuestion}
            className="flex items-center gap-1"
          >
            <Lightbulb size={14} /> {lang === "ar" ? "تلميح" : "Hint"}
          </button>
          <button
            onClick={reportQuestion}
            disabled={reportSent}
            className="flex items-center gap-1"
          >
            {reportSent ? (
              lang === "ar" ? (
                "✓ تم الإبلاغ"
              ) : (
                "✓ Reported"
              )
            ) : (
              <>
                <Flag size={14} /> {lang === "ar" ? "إبلاغ" : "Report"}
              </>
            )}
          </button>
        </div>
      )}
      {hintUsedThisQuestion && fallacyHint && (
        <motion.p
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mb-6 rounded-xl border border-border bg-surface p-3 text-sm text-text-muted shadow-sm"
        >
          {lang === "ar" ? fallacyHint.ar : fallacyHint.en}
        </motion.p>
      )}
      {!revealed ? (
        <div className="flex gap-3">
          <motion.button
            whileTap={tapScale}
            whileHover={{ y: -2 }}
            onClick={() => handleAnswer(true)}
            className="rounded-xl border border-border bg-surface px-5 py-3 text-text shadow-sm transition-shadow duration-200 hover:shadow-[var(--shadow-elevated)]"
          >
            {lang === "ar" ? "لاحظتها" : "I spotted it"}
          </motion.button>
          <motion.button
            whileTap={tapScale}
            whileHover={{ y: -2 }}
            onClick={() => handleAnswer(false)}
            className="rounded-xl border border-border bg-surface px-5 py-3 text-text shadow-sm transition-shadow duration-200 hover:shadow-[var(--shadow-elevated)]"
          >
            {lang === "ar" ? "ما لاحظتها" : "I didn't spot it"}
          </motion.button>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className={wasCorrectLast ? "text-brand" : "text-flag"}>
            {wasCorrectLast
              ? lang === "ar"
                ? "✓ أحسنت، لاحظتها!"
                : "✓ Nice catch!"
              : lang === "ar"
                ? "قريب — بس فوتت هاي:"
                : "Close — here's what you missed:"}
          </p>
          {question.explanation && (
            <p className="mt-2 max-w-prose text-text-muted">
              {lang === "ar"
                ? question.explanation.ar
                : question.explanation.en}
            </p>
          )}
          <motion.button
            whileTap={tapScale}
            onClick={next}
            className="mt-6 rounded-lg bg-brand px-6 py-3 font-medium text-white shadow-[var(--shadow-brand)] transition-colors hover:bg-brand-hover"
          >
            {lang === "ar" ? "التالي" : "Next"}
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}
