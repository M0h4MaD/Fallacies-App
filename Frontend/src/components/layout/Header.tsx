// frontend/src/components/layout/Header.tsx (استبدله كامل)
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../contexts/ThemeContext";
import { useAuthStore } from "../../store/authStore";

export default function Header() {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const { appUser, isLoading, signInWithGoogle, signOut } = useAuthStore();

  return (
    <header className="border-b border-border bg-surface">
      <div className="mx-auto flex max-w-3xl items-center justify-between p-4">
        <Link to="/" className="font-heading text-xl font-bold text-brand">
          {t("app.title")}
        </Link>
        <nav className="hidden items-center gap-5 sm:flex">
          <Link to="/library" className="text-sm text-text hover:text-brand">
            {i18n.language === "ar" ? "المكتبة" : "Library"}
          </Link>
          <Link to="/review" className="text-sm text-text hover:text-brand">
            {i18n.language === "ar" ? "المراجعة" : "Review"}
          </Link>
          <Link to="/correct" className="text-sm text-text hover:text-brand">
            {i18n.language === "ar" ? "صحّح" : "Correct"}
          </Link>
          <Link
            to="/chat/debater"
            className="text-sm text-text hover:text-brand"
          >
            {i18n.language === "ar" ? "ناظرني" : "Debate"}
          </Link>
          <Link
            to="/leaderboard"
            className="text-sm text-text hover:text-brand"
          >
            {i18n.language === "ar" ? "الصدارة" : "Leaderboard"}
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="rounded-lg border border-border px-3 py-1.5 text-sm text-text hover:bg-bg"
          >
            {theme === "light" ? t("theme.toDark") : t("theme.toLight")}
          </button>
          <button
            onClick={() =>
              i18n.changeLanguage(i18n.language === "ar" ? "en" : "ar")
            }
            className="rounded-lg border border-border px-3 py-1.5 text-sm text-text hover:bg-bg"
          >
            {i18n.language === "ar" ? "English" : "العربية"}
          </button>
          {!isLoading &&
            (appUser && !appUser.isGuest ? (
              <button
                onClick={() => signOut()}
                className="rounded-lg border border-border px-3 py-1.5 text-sm text-text hover:bg-bg"
              >
                {appUser.displayName}
              </button>
            ) : (
              <button
                onClick={() => signInWithGoogle()}
                className="rounded-lg bg-brand px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-hover"
              >
                {i18n.language === "ar" ? "تسجيل دخول" : "Sign in"}
              </button>
            ))}
        </div>
      </div>
    </header>
  );
}
