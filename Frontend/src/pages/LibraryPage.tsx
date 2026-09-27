// frontend/src/pages/LibraryPage.tsx
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  Crosshair,
  Split,
  CircleHelp,
  TrendingDown,
  LayoutGrid,
  Search,
} from "lucide-react";
import { useFallacies } from "../hooks/useFallacies";
import LoadingTip from "../components/LoadingTip";
import type { Difficulty, Fallacy, FallacySubCategory } from "../types";
import { Lock } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { buildUnlockLevelMap } from "../lib/unlockLevel";

type SectionKey = FallacySubCategory | "all";
const SECTION_ORDER: SectionKey[] = [
  "all",
  "relevance",
  "ambiguity",
  "presumption",
  "weak_induction",
];
const SECTION_LABEL: Record<SectionKey, { ar: string; en: string }> = {
  all: { ar: "كل المغالطات", en: "All Fallacies" },
  relevance: { ar: "مغالطات الصلة", en: "Relevance" },
  ambiguity: { ar: "مغالطات الغموض", en: "Ambiguity" },
  presumption: { ar: "مغالطات الافتراض", en: "Presumption" },
  weak_induction: { ar: "الاستدلال الضعيف", en: "Weak Induction" },
};
const SECTION_ICON: Record<SectionKey, typeof Crosshair> = {
  all: LayoutGrid,
  relevance: Crosshair,
  ambiguity: Split,
  presumption: CircleHelp,
  weak_induction: TrendingDown,
};
const SECTION_TINT: Record<SectionKey, string> = {
  all: "bg-surface",
  relevance: "bg-tint-relevance",
  ambiguity: "bg-tint-ambiguity",
  presumption: "bg-tint-presumption",
  weak_induction: "bg-tint-weak",
};
const difficultyLabel: Record<Difficulty, { ar: string; en: string }> = {
  beginner: { ar: "مبتدئ", en: "Beginner" },
  intermediate: { ar: "متوسط", en: "Intermediate" },
  advanced: { ar: "متقدم", en: "Advanced" },
};

function CommonnessMeter({ value }: { value: number }) {
  return (
    <span className="inline-flex gap-0.5" title={`${value}/5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={[
            "h-1.5 w-1.5 rounded-full",
            i <= value ? "bg-reward" : "bg-border",
          ].join(" ")}
        />
      ))}
    </span>
  );
}

const listVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0 },
};

function ResultsList({ items, lang, unlockLevelMap, userLevel }: { items: Fallacy[]; lang: 'ar' | 'en'; unlockLevelMap: Map<string, number>; userLevel: number }) {
  if (items.length === 0) return <p className="text-text-muted">{lang === 'ar' ? 'ولا نتيجة مطابقة.' : 'No matching results.'}</p>
  return (
    <motion.div variants={listVariants} initial="hidden" animate="show" className="divide-y divide-border border-t border-border">
      {items.map((f) => {
        const unlockLevel = unlockLevelMap.get(f.slug) ?? 1
        const isLocked = unlockLevel > userLevel
        return (
          <motion.article key={f.slug} variants={itemVariants} className="flex items-baseline justify-between gap-4 py-5 transition-colors hover:bg-surface">
            <div>
              <h3 className="font-heading text-xl font-bold text-text">{lang === 'ar' ? f.nameAr : f.nameEn}</h3>
              <p className="mt-1 text-sm text-text-muted">{lang === 'ar' ? f.nameEn : f.nameAr}</p>
              <p className="mt-2 max-w-prose text-text">{lang === 'ar' ? f.definitionAr : f.definitionEn}</p>
              <div className="mt-2 flex items-center gap-4">
                <Link to={`/chat/ai/${f.slug}`} className="text-sm font-medium text-brand hover:text-brand-hover">{lang === 'ar' ? 'اشرحلي' : 'Explain'}</Link>
                {isLocked && (
                  <span className="flex items-center gap-1 text-sm text-text-muted"><Lock size={13} /> {lang === 'ar' ? `تمرين بمستوى ${unlockLevel}` : `Practice at level ${unlockLevel}`}</span>
                )}
              </div>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-2">
              <span className="text-sm text-text-muted">{difficultyLabel[f.difficulty][lang]}</span>
              <CommonnessMeter value={f.commonness} />
            </div>
          </motion.article>
        )
      })}
    </motion.div>
  )
}

export default function LibraryPage() {
  const { i18n } = useTranslation();
  const { fallacies, isLoading, error } = useFallacies();
  const userLevel = useAuthStore((s) => s.appUser?.level ?? 1);
  const unlockLevelMap = useMemo(
    () => buildUnlockLevelMap(fallacies.map((f) => f.slug)),
    [fallacies],
  );
  const lang = i18n.language === "en" ? "en" : "ar";
  const [openSection, setOpenSection] = useState<SectionKey | null>(null);
  const [query, setQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<Difficulty | "all">(
    "all",
  );
  const [sortBy, setSortBy] = useState<"commonness" | "alpha">("commonness");

  const bySection = useMemo(
    () =>
      SECTION_ORDER.map((sc) => ({
        sc,
        items:
          sc === "all"
            ? fallacies
            : fallacies.filter((f) => f.subCategory === sc),
      })),
    [fallacies],
  );
  const active = useMemo(
    () => bySection.find((s) => s.sc === openSection),
    [bySection, openSection],
  );

  const sectionResults = useMemo(() => {
    if (!active) return [];
    let items = active.items;
    if (difficultyFilter !== "all")
      items = items.filter((f) => f.difficulty === difficultyFilter);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      items = items.filter(
        (f) =>
          f.nameAr.includes(query.trim()) || f.nameEn.toLowerCase().includes(q),
      );
    }
    return [...items].sort((a, b) =>
      sortBy === "commonness"
        ? b.commonness - a.commonness
        : lang === "ar"
          ? a.nameAr.localeCompare(b.nameAr, "ar")
          : a.nameEn.localeCompare(b.nameEn),
    );
  }, [active, query, difficultyFilter, sortBy, lang]);

  if (isLoading) return <LoadingTip />;
  if (error) return <p className="text-flag">{error}</p>;

  return (
    <div>
      <h1 className="mb-1 font-heading text-3xl font-bold text-text">
        {lang === "ar" ? "مكتبة المغالطات" : "Fallacy Library"}
      </h1>
      <p className="mb-8 text-text-muted">
        {fallacies.length}{" "}
        {lang === "ar"
          ? "مغالطة — كل، أو مقسومة على 4 أقسام"
          : "fallacies — all, or across 4 sections"}
      </p>

      <AnimatePresence mode="wait">
        {!active ? (
          <motion.div
            key="sections"
            variants={listVariants}
            initial="hidden"
            animate="show"
            exit={{ opacity: 0 }}
          >
            <motion.button
              layoutId="section-all"
              variants={itemVariants}
              onClick={() => {
                setOpenSection("all");
                setQuery("");
                setDifficultyFilter("all");
              }}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.98 }}
              className={[
                "mb-3 flex w-full items-center gap-4 rounded-xl border border-border p-5 text-start shadow-sm transition-shadow duration-200 hover:shadow-[var(--shadow-elevated)]",
                SECTION_TINT.all,
              ].join(" ")}
            >
              <LayoutGrid
                size={22}
                className="shrink-0 text-text"
                strokeWidth={1.75}
              />
              <div>
                <motion.h2
                  layoutId="section-title-all"
                  className="font-heading text-lg font-bold text-text"
                >
                  {SECTION_LABEL.all[lang]}
                </motion.h2>
                <p className="mt-1 text-sm text-text-muted">
                  {fallacies.length} {lang === "ar" ? "مغالطة" : "fallacies"}
                </p>
              </div>
            </motion.button>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {bySection
                .filter(({ sc }) => sc !== "all")
                .map(({ sc, items }) => {
                  const Icon = SECTION_ICON[sc];
                  return (
                    <motion.button
                      key={sc}
                      layoutId={`section-${sc}`}
                      variants={itemVariants}
                      onClick={() => {
                        setOpenSection(sc);
                        setQuery("");
                        setDifficultyFilter("all");
                      }}
                      whileHover={{ y: -3 }}
                      whileTap={{ scale: 0.98 }}
                      className={[
                        "rounded-xl border border-border p-5 text-start shadow-sm transition-shadow duration-200 hover:shadow-[var(--shadow-elevated)]",
                        SECTION_TINT[sc],
                      ].join(" ")}
                    >
                      <Icon
                        size={20}
                        className="mb-3 text-text"
                        strokeWidth={1.75}
                      />
                      <motion.h2
                        layoutId={`section-title-${sc}`}
                        className="font-heading text-lg font-bold text-text"
                      >
                        {SECTION_LABEL[sc][lang]}
                      </motion.h2>
                      <p className="mt-1 text-sm text-text-muted">
                        {items.length} {lang === "ar" ? "مغالطة" : "fallacies"}
                      </p>
                    </motion.button>
                  );
                })}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="detail"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.button
              layoutId={`section-${active.sc}`}
              onClick={() => setOpenSection(null)}
              className={[
                "mb-5 flex w-full items-center justify-between rounded-xl border border-border p-5 text-start",
                SECTION_TINT[active.sc],
              ].join(" ")}
            >
              <motion.h2
                layoutId={`section-title-${active.sc}`}
                className="font-heading text-lg font-bold text-text"
              >
                {SECTION_LABEL[active.sc][lang]}
              </motion.h2>
              <span className="text-sm text-text-muted">
                {lang === "ar" ? "← رجوع" : "Back →"}
              </span>
            </motion.button>

            <div className="mb-5 flex flex-wrap items-center gap-3">
              <div className="relative min-w-[160px] flex-1">
                <Search
                  size={15}
                  className="pointer-events-none absolute top-1/2 -translate-y-1/2 start-3 text-text-muted"
                />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={
                    lang === "ar" ? "ابحث بالاسم..." : "Search by name..."
                  }
                  className="w-full rounded-lg border border-border bg-surface py-2 ps-9 pe-3 text-sm text-text outline-none focus:border-brand"
                />
              </div>
              <div className="flex gap-1.5">
                {(["all", "beginner", "intermediate", "advanced"] as const).map(
                  (d) => (
                    <button
                      key={d}
                      onClick={() => setDifficultyFilter(d)}
                      className={[
                        "rounded-full border px-3 py-1.5 text-xs",
                        difficultyFilter === d
                          ? "border-brand bg-brand text-white"
                          : "border-border text-text-muted hover:bg-surface",
                      ].join(" ")}
                    >
                      {d === "all"
                        ? lang === "ar"
                          ? "الكل"
                          : "All"
                        : difficultyLabel[d][lang]}
                    </button>
                  ),
                )}
              </div>
              <button
                onClick={() =>
                  setSortBy((s) =>
                    s === "commonness" ? "alpha" : "commonness",
                  )
                }
                className="rounded-full border border-border px-3 py-1.5 text-xs text-text-muted hover:bg-surface"
              >
                {sortBy === "commonness"
                  ? lang === "ar"
                    ? "مرتّب: الأشيع"
                    : "Sort: Common"
                  : lang === "ar"
                    ? "مرتّب: أبجدي"
                    : "Sort: A–Z"}
              </button>
            </div>

            <ResultsList
              items={sectionResults}
              lang={lang}
              unlockLevelMap={unlockLevelMap}
              userLevel={userLevel}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
