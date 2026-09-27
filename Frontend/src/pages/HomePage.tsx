// frontend/src/pages/HomePage.tsx (استبدله كامل — عنوان الهيرو أكبر وأثقل فعلياً لأول مرة، تباين حقيقي مع باقي العناوين)
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import FallacySpotter from "../components/home/FallacySpotter";
import FallacyPrimer from "../components/home/FallacyPrimer";
import WhyItMatters from "../components/home/WhyItMatters";
import FallacyOfTheDay from "../components/home/FallacyOfTheDay";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

export default function HomePage() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language === "en" ? "en" : "ar";

  return (
    <motion.div variants={container} initial="hidden" animate="show">
      <motion.section variants={item} className="py-10">
        <motion.h1
          variants={item}
          className="mb-4 font-heading text-5xl font-extrabold leading-[1.05] tracking-tight text-text sm:text-6xl"
        >
          {t("app.title")}
        </motion.h1>
        <motion.p
          variants={item}
          className="max-w-prose text-lg text-text-muted"
        >
          {lang === "ar"
            ? "تعلّم تكتشف المغالطات المنطقية يلي بتنسمعها بالسياسة والدين والإعلام كل يوم — بمنطق، مش بجدل."
            : "Learn to spot the logical fallacies you hear in politics, religion, and media every day — with logic, not arguments."}
        </motion.p>
        <motion.div variants={item}>
          <Link
            to="/library"
            className="mt-8 inline-block rounded-lg bg-brand px-6 py-3 font-medium text-white shadow-[var(--shadow-brand)] transition-colors hover:bg-brand-hover"
          >
            {lang === "ar" ? "ابدأ التعلم" : "Start learning"}
          </Link>
        </motion.div>
      </motion.section>
      <motion.div variants={item}>
        <FallacyOfTheDay />
      </motion.div>
      <motion.div variants={item}>
        <WhyItMatters />
      </motion.div>
      <motion.div variants={item}>
        <FallacyPrimer />
      </motion.div>
      <motion.div variants={item}>
        <FallacySpotter />
      </motion.div>
    </motion.div>
  );
}
