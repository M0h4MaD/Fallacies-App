// frontend/src/components/layout/Header.tsx (استبدله كامل)
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Moon, Sun, Languages } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { useAuthStore } from "../../store/authStore";

const NAV_LINKS = [
  { to: "/library", ar: "المكتبة", en: "Library" },
  { to: "/review", ar: "المراجعة", en: "Review" },
  { to: "/correct", ar: "صحّح", en: "Correct" },
  { to: "/chat/debater", ar: "ناظرني", en: "Debate" },
  { to: "/leaderboard", ar: "الصدارة", en: "Leaderboard" },
];

export default function Header() {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const { appUser, isLoading, signOut } = useAuthStore();
  const lang = i18n.language === "en" ? "en" : "ar";

  return (
    <header className="border-b border-border bg-surface">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-4">
        <Link
          to="/"
          className="shrink-0 font-heading text-xl font-bold text-brand"
        >
          {t("app.title")}
        </Link>

        <nav className="hidden items-center gap-6 sm:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-sm text-text hover:text-brand"
            >
              {lang === "ar" ? link.ar : link.en}
            </Link>
          ))}
          {appUser?.role === "admin" && (
            <Link to="/admin" className="text-sm text-text hover:text-brand">
              {lang === "ar" ? "الإدارة" : "Admin"}
            </Link>
          )}
        </nav>

        <div className="flex shrink-0 items-center gap-3">
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
              <div className="flex items-center gap-2">
                <Link
                  to="/profile"
                  className="text-sm font-medium text-text hover:text-brand"
                >
                  {appUser.displayName}
                </Link>
                <button
                  onClick={() => signOut()}
                  className="rounded-lg border border-border px-2 py-1 text-xs text-text-muted hover:bg-bg"
                >
                  {lang === "ar" ? "خروج" : "Sign out"}
                </button>
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
