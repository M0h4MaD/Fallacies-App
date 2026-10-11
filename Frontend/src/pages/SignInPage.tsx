import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { supabase } from "../config/supabase";
import { tapScale } from "../lib/motion";

type Mode = "signIn" | "signUp";

export default function SignInPage() {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const lang = i18n.language === "en" ? "en" : "ar";
  const [mode, setMode] = useState<Mode>("signIn");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setNotice(null);
    setIsSubmitting(true);
    try {
      if (mode === "signUp") {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: displayName || undefined } },
        });
        if (signUpError) throw signUpError;
        if (!data.session)
          setNotice(
            lang === "ar"
              ? "تفقّد بريدك لتأكيد الحساب قبل الدخول."
              : "Check your email to confirm your account before signing in.",
          );
        else navigate("/library");
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
        navigate("/library");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-sm rounded-2xl border border-border bg-surface p-8 shadow-[var(--shadow-elevated)]"
    >
      <h1 className="mb-8 text-center font-heading text-2xl font-extrabold text-text">
        {mode === "signIn"
          ? lang === "ar"
            ? "تسجيل الدخول"
            : "Sign in"
          : lang === "ar"
            ? "حساب جديد"
            : "Create account"}
      </h1>

      <motion.button
        whileTap={tapScale}
        onClick={handleGoogle}
        className="mb-6 w-full rounded-lg border border-border bg-bg py-3 text-sm font-medium text-text shadow-sm transition-shadow duration-200 hover:shadow-[var(--shadow-elevated)]"
      >
        {lang === "ar" ? "المتابعة بحساب جوجل" : "Continue with Google"}
      </motion.button>

      <div className="mb-6 flex items-center gap-3 text-xs text-text-muted">
        <div className="h-px flex-1 bg-border" /> {lang === "ar" ? "أو" : "or"}{" "}
        <div className="h-px flex-1 bg-border" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === "signUp" && (
          <input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder={lang === "ar" ? "الاسم" : "Name"}
            className="w-full rounded-lg border border-border bg-bg px-4 py-2.5 text-text outline-none focus:border-brand"
          />
        )}
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={lang === "ar" ? "البريد الإلكتروني" : "Email"}
          className="w-full rounded-lg border border-border bg-bg px-4 py-2.5 text-text outline-none focus:border-brand"
        />
        <input
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={lang === "ar" ? "كلمة المرور" : "Password"}
          className="w-full rounded-lg border border-border bg-bg px-4 py-2.5 text-text outline-none focus:border-brand"
        />

        {error && <p className="text-sm text-flag">{error}</p>}
        {notice && <p className="text-sm text-brand">{notice}</p>}

        <motion.button
          whileTap={tapScale}
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-brand py-3 font-medium text-white shadow-[var(--shadow-brand)] hover:bg-brand-hover disabled:opacity-50 disabled:shadow-none"
        >
          {isSubmitting
            ? "..."
            : mode === "signIn"
              ? lang === "ar"
                ? "دخول"
                : "Sign in"
              : lang === "ar"
                ? "إنشاء الحساب"
                : "Create account"}
        </motion.button>
      </form>

      <button
        onClick={() => setMode(mode === "signIn" ? "signUp" : "signIn")}
        className="mt-6 w-full text-center text-sm text-text-muted hover:text-text"
      >
        {mode === "signIn"
          ? lang === "ar"
            ? "ولا عندك حساب؟ سجّل جديد"
            : "Don't have an account? Sign up"
          : lang === "ar"
            ? "عندك حساب أصلاً؟ ادخل"
            : "Already have an account? Sign in"}
      </button>
    </motion.div>
  );
}
