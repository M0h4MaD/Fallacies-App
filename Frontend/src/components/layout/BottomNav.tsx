import { useEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  BookOpen,
  Target,
  PenLine,
  Swords,
  Bot,
  MoreHorizontal,
  Trophy,
  User,
  ShieldCheck,
  RotateCcw,
} from "lucide-react";
import { useAuthStore } from "../../store/authStore";

const PRIMARY_TABS = [
  { to: "/library", Icon: BookOpen, labelAr: "المكتبة", labelEn: "Library" },
  { to: "/quiz", Icon: Target, labelAr: "كويز", labelEn: "Quiz" },
  { to: "/correct", Icon: PenLine, labelAr: "صحّح", labelEn: "Correct" },
  { to: "/chat/debater", Icon: Swords, labelAr: "ناظرني", labelEn: "Debate" },
  { to: "/chat/ai", Icon: Bot, labelAr: "AI", labelEn: "AI" },
];

export default function BottomNav() {
  const { i18n } = useTranslation();
  const lang = i18n.language === "en" ? "en" : "ar";
  const location = useLocation();
  const appUser = useAuthStore((s) => s.appUser);
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);
  const [prevPath, setPrevPath] = useState(location.pathname);

  const moreItems = [
    { to: "/review", Icon: RotateCcw, labelAr: "المراجعة", labelEn: "Review" },
    {
      to: "/leaderboard",
      Icon: Trophy,
      labelAr: "الصدارة",
      labelEn: "Leaderboard",
    },
    { to: "/profile", Icon: User, labelAr: "ملفي", labelEn: "Profile" },
    ...(appUser?.role === "admin"
      ? [
          {
            to: "/admin",
            Icon: ShieldCheck,
            labelAr: "الإدارة",
            labelEn: "Admin",
          },
        ]
      : []),
  ];
  const isMoreActive = moreItems.some((item) =>
    location.pathname.startsWith(item.to),
  );

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (moreRef.current && !moreRef.current.contains(e.target as Node))
        setMoreOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);
  if (location.pathname !== prevPath) {
    setPrevPath(location.pathname);
    setMoreOpen(false);
  }

  return (
    <nav className="fixed inset-x-0 bottom-0 z-10 flex border-t border-border bg-surface pb-[env(safe-area-inset-bottom)] sm:hidden">
      {PRIMARY_TABS.map(({ to, Icon, labelAr, labelEn }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            [
              "flex flex-1 flex-col items-center gap-1 py-2.5 text-xs",
              isActive ? "text-brand" : "text-text-muted",
            ].join(" ")
          }
        >
          <Icon size={20} strokeWidth={2} />
          {lang === "ar" ? labelAr : labelEn}
        </NavLink>
      ))}

      <div ref={moreRef} className="relative flex flex-1">
        <button
          onClick={() => setMoreOpen((o) => !o)}
          className={[
            "flex flex-1 flex-col items-center gap-1 py-2.5 text-xs",
            isMoreActive || moreOpen ? "text-brand" : "text-text-muted",
          ].join(" ")}
        >
          <MoreHorizontal size={20} strokeWidth={2} />
          {lang === "ar" ? "المزيد" : "More"}
        </button>
        {moreOpen && (
          <div className="absolute bottom-full end-0 mb-2 w-40 overflow-hidden rounded-xl border border-border bg-surface shadow-[var(--shadow-elevated)]">
            {moreItems.map(({ to, Icon, labelAr, labelEn }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  [
                    "flex items-center gap-2.5 px-4 py-3 text-sm",
                    isActive ? "font-medium text-brand" : "text-text",
                  ].join(" ")
                }
              >
                <Icon size={16} /> {lang === "ar" ? labelAr : labelEn}
              </NavLink>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
