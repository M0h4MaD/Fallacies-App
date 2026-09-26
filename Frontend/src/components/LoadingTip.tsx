// frontend/src/components/LoadingTip.tsx (ملف جديد)
// كل شاشة انتظار AI بتستخدمها (بدل نص "عم نحضّر..." ثابت). بلاش تظهر أول 400ms (تفادي وميض
// باستجابة سريعة)، وبعدها تلميح دوّار من /api/tips/random كل 6 ثواني.
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { apiClient } from "../lib/apiClient";

interface Tip {
  textAr: string;
  textEn: string;
}

export default function LoadingTip({ fallacySlug }: { fallacySlug?: string }) {
  const { i18n } = useTranslation();
  const lang = i18n.language === "en" ? "en" : "ar";
  const [visible, setVisible] = useState(false);
  const [tip, setTip] = useState<Tip | null>(null);
  const DEFAULT_TIP = {
    ar: "ثانية وحدة، عم نجهّزلك مثال...",
    en: "One moment, preparing an example for you...",
  };

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 400);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!visible) return;
    let cancelled = false;
    function fetchTip() {
      apiClient
        .get<Tip | null>("/api/tips/random", {
          params: fallacySlug ? { fallacySlug } : {},
        })
        .then((res) => {
          if (!cancelled && res.data) setTip(res.data);
        })
        .catch(() => {});
    }
    fetchTip();
    const interval = setInterval(fetchTip, 6000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [visible, fallacySlug]);

  return (
    <div
      className="flex flex-col items-center gap-3 py-8 text-center"
      role="status"
      aria-live="polite"
    >
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-brand"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.15 }}
          />
        ))}
      </div>
      <AnimatePresence mode="wait">
        {visible && (
          <motion.p
            key={tip?.textAr ?? "default"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-xs text-sm text-text-muted"
          >
            {tip
              ? lang === "ar"
                ? tip.textAr
                : tip.textEn
              : lang === "ar"
                ? DEFAULT_TIP.ar
                : DEFAULT_TIP.en}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
