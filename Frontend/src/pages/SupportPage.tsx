// frontend/src/pages/SupportPage.tsx (استبدله كامل — 3 خيارات بس متل ما طلبت)
import { useTranslation } from "react-i18next";
import {
  Coffee,
  Wallet,
  CreditCard,
  Heart,
  type LucideIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import { tapScale } from "../lib/motion";

const BMC_LINK = "https://buymeacoffee.com/your-handle";
const PAYPAL_LINK = "https://paypal.me/your-handle"; // guest checkout بالفيزا/كريدت كارد مدمج فيه أصلاً
const CARD_LINK = PAYPAL_LINK; // بدّلها برابط Stripe Payment Link منفصل لو حابب تجربة بدون علامة PayPal

interface DonationLink {
  key: string;
  labelAr: string;
  labelEn: string;
  url: string;
  Icon: LucideIcon;
}

const DONATION_LINKS: DonationLink[] = [
  {
    key: "bmc",
    labelAr: "اشترِلي قهوة",
    labelEn: "Buy Me a Coffee",
    url: BMC_LINK,
    Icon: Coffee,
  },
  {
    key: "paypal",
    labelAr: "PayPal",
    labelEn: "PayPal",
    url: PAYPAL_LINK,
    Icon: Wallet,
  },
  {
    key: "card",
    labelAr: "بطاقة ائتمان / فيزا",
    labelEn: "Credit Card / Visa",
    url: CARD_LINK,
    Icon: CreditCard,
  },
];

export default function SupportPage() {
  const { i18n } = useTranslation();
  const lang = i18n.language === "en" ? "en" : "ar";

  return (
    <div className="max-w-prose">
      <div className="mb-8 flex items-center gap-3">
        <Heart
          size={24}
          className="text-flag"
          fill="currentColor"
          strokeWidth={0}
        />
        <h1 className="font-heading text-3xl font-extrabold text-text">
          {lang === "ar" ? "ادعم الموقع" : "Support the Site"}
        </h1>
      </div>
      <p className="mb-8 text-text">
        {lang === "ar"
          ? "مغالطة مشروع طالب، مبني ومُشغّل بشكل شخصي — استضافة الباك اند وقاعدة البيانات واستدعاءات الذكاء الاصطناعي كلها بتكلّف فعلياً. إذا الموقع أفادك وحابب تساعد يضل مجاني وبدون إعلانات، أي دعم بيفرق."
          : "Mughalata is a student-built, personally-run project — hosting, the database, and AI calls all cost real money. If the site helped you and you'd like to help keep it free and ad-free, any support makes a difference."}
      </p>

      <div className="space-y-3">
        {DONATION_LINKS.map(({ key, labelAr, labelEn, url, Icon }) => (
          <motion.a
            key={key}
            whileTap={tapScale}
            whileHover={{ y: -2 }}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-xl border border-border bg-surface p-4 shadow-sm transition-shadow duration-200 hover:shadow-[var(--shadow-elevated)]"
          >
            <Icon
              size={20}
              className="shrink-0 text-reward"
              strokeWidth={1.75}
            />
            <span className="font-medium text-text">
              {lang === "ar" ? labelAr : labelEn}
            </span>
          </motion.a>
        ))}
      </div>
    </div>
  );
}
