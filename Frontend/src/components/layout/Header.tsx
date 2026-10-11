import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Moon, Sun, Languages, ChevronDown } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { useAuthStore } from "../../store/authStore";
import StreakFlame from "../StreakFlame";
import BrandMark from "../BrandMark";

const PRIMARY_LINKS = [
  { to: "/library", ar: "المكتبة", en: "Library" },
  { to: "/quiz", ar: "كويز", en: "Quiz" },
  { to: "/correct", ar: "صحّح", en: "Correct" },
  { to: "/chat/debater", ar: "ناظرني", en: "Debate" },
  { to: "/chat/ai", ar: "محادثة AI", en: "AI Chat" },
];
const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  [
    "whitespace-nowrap text-sm transition-colors",
    isActive ? "font-medium text-brand" : "text-text hover:text-brand",
  ].join(" ");

export default function Header() {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const { appUser, isLoading, signOut } = useAuthStore();
  const lang = i18n.language === "en" ? "en" : "ar";
  const location = useLocation();
  const [profileOpen, setProfileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const moreRef = useRef<HTMLDivElement>(null);

  const moreLinks = [
    { to: "/review", ar: "المراجعة", en: "Review" },
    { to: "/leaderboard", ar: "الصدارة", en: "Leaderboard" },
    ...(appUser?.role === "admin"
      ? [{ to: "/admin", ar: "الإدارة", en: "Admin" }]
      : []),
  ];
  const isMoreActive = moreLinks.some((l) =>
    location.pathname.startsWith(l.to),
  );

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node))
        setProfileOpen(false);
      if (moreRef.current && !moreRef.current.contains(e.target as Node))
        setMoreOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <header className="border-b border-border bg-surface">
      <div className="relative mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link
          to="/"
          className="flex shrink-0 items-center gap-2 font-heading text-xl font-bold text-brand"
        >
          <BrandMark size={24} /> {t("app.title")}
        </Link>

        {/* left-1/2 + translateX(-50%) فيزيائي — يضل متمركز صحيح بغض النظر عن عدد العناصر أو RTL/LTR */}
        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-5 sm:flex lg:gap-6">
          {PRIMARY_LINKS.map((link) => (
            <NavLink key={link.to} to={link.to} className={navLinkClass}>
              {lang === "ar" ? link.ar : link.en}
            </NavLink>
          ))}
          <div ref={moreRef} className="relative">
            <button
              onClick={() => setMoreOpen((o) => !o)}
              className={[
                "flex items-center gap-1 text-sm transition-colors",
                isMoreActive || moreOpen
                  ? "font-medium text-brand"
                  : "text-text hover:text-brand",
              ].join(" ")}
            >
              {lang === "ar" ? "المزيد" : "More"}{" "}
              <ChevronDown
                size={14}
                className={
                  moreOpen
                    ? "rotate-180 transition-transform"
                    : "transition-transform"
                }
              />
            </button>
            {moreOpen && (
              <div className="absolute start-0 top-full z-10 mt-2 w-40 overflow-hidden rounded-xl border border-border bg-surface shadow-[var(--shadow-elevated)]">
                {moreLinks.map((l) => (
                  <NavLink
                    key={l.to}
                    to={l.to}
                    onClick={() => setMoreOpen(false)}
                    className={({ isActive }) =>
                      [
                        "block px-4 py-2.5 text-sm",
                        isActive
                          ? "font-medium text-brand"
                          : "text-text hover:bg-bg",
                      ].join(" ")
                    }
                  >
                    {lang === "ar" ? l.ar : l.en}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <button
            onClick={toggleTheme}
            aria-label="theme"
            className="rounded-lg border border-border p-2 text-text hover:bg-bg"
          >
            {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
          </button>
          <button
            onClick={() => i18n.changeLanguage(lang === "ar" ? "en" : "ar")}
            aria-label="language"
            className="rounded-lg border border-border p-2 text-text hover:bg-bg"
          >
            <Languages size={16} />
          </button>

          {!isLoading &&
            (appUser && !appUser.isGuest ? (
              <div className="flex items-center gap-3">
                <StreakFlame streak={appUser.streak} />
                <div ref={profileRef} className="relative">
                  <button
                    onClick={() => setProfileOpen((o) => !o)}
                    className="flex items-center gap-1 rounded-lg border border-border px-3 py-2 text-sm font-medium text-text hover:bg-bg"
                  >
                    {appUser.displayName}{" "}
                    <ChevronDown
                      size={14}
                      className={
                        profileOpen
                          ? "rotate-180 transition-transform"
                          : "transition-transform"
                      }
                    />
                  </button>
                  {profileOpen && (
                    <div className="absolute end-0 top-full z-10 mt-2 w-44 overflow-hidden rounded-xl border border-border bg-surface shadow-[var(--shadow-elevated)]">
                      <Link
                        to="/profile"
                        onClick={() => setProfileOpen(false)}
                        className="block px-4 py-2.5 text-sm text-text hover:bg-bg"
                      >
                        {lang === "ar" ? "ملفي الشخصي" : "My Profile"}
                      </Link>
                      <button
                        onClick={() => {
                          setProfileOpen(false);
                          signOut();
                        }}
                        className="block w-full px-4 py-2.5 text-start text-sm text-flag hover:bg-bg"
                      >
                        {lang === "ar" ? "تسجيل خروج" : "Sign out"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <Link
                to="/sign-in"
                className="rounded-lg bg-brand px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-hover"
              >
                {lang === "ar" ? "تسجيل دخول" : "Sign in"}
              </Link>
            ))}
        </div>
      </div>
    </header>
  );
}
