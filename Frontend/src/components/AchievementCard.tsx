// frontend/src/components/AchievementCard.tsx (ملف جديد)
import { useEffect, useRef } from "react";
import { Download } from "lucide-react";
import { motion } from "framer-motion";

interface AchievementCardProps {
  titleAr: string;
  titleEn: string;
  subtitleAr: string;
  subtitleEn: string;
  lang: "ar" | "en";
}
const WIDTH = 1200;
const HEIGHT = 630;

export default function AchievementCard({
  titleAr,
  titleEn,
  subtitleAr,
  subtitleEn,
  lang,
}: AchievementCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  async function draw() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    await Promise.all([
      document.fonts.load("800 64px Cairo"),
      document.fonts.load("700 32px Cairo"),
      document.fonts.load('500 26px "IBM Plex Sans Arabic"'),
    ]);

    ctx.fillStyle = "#f6f4ef";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    ctx.fillStyle = "rgba(28,27,31,0.05)";
    for (let x = 20; x < WIDTH; x += 32)
      for (let y = 20; y < HEIGHT; y += 32) {
        ctx.beginPath();
        ctx.arc(x, y, 1, 0, Math.PI * 2);
        ctx.fill();
      }

    const pad = 60;
    ctx.fillStyle = "#ffffff";
    ctx.shadowColor = "rgba(28,27,31,0.15)";
    ctx.shadowBlur = 40;
    ctx.shadowOffsetY = 16;
    roundRect(ctx, pad, pad, WIDTH - pad * 2, HEIGHT - pad * 2, 28);
    ctx.fill();
    ctx.shadowColor = "transparent";

    const isAr = lang === "ar";
    ctx.textAlign = isAr ? "right" : "left";
    const textX = isAr ? WIDTH - pad - 50 : pad + 50;

    ctx.fillStyle = "#146b4b";
    ctx.font = "800 30px Cairo";
    ctx.fillText(isAr ? "مغالطة" : "Mughalata", textX, pad + 80);
    ctx.fillStyle = "#1c1b1f";
    ctx.font = "800 64px Cairo";
    wrapText(
      ctx,
      isAr ? titleAr : titleEn,
      textX,
      pad + 200,
      WIDTH - pad * 2 - 100,
      74,
      isAr,
    );
    ctx.fillStyle = "#6b6860";
    ctx.font = '500 30px "IBM Plex Sans Arabic"';
    ctx.fillText(isAr ? subtitleAr : subtitleEn, textX, pad + 320);
    ctx.fillStyle = "#b8862e";
    ctx.font = '600 22px "IBM Plex Sans Arabic"';
    ctx.fillText(
      isAr
        ? "تعلّم تكتشف المغالطات المنطقية"
        : "Learn to spot logical fallacies",
      textX,
      HEIGHT - pad - 30,
    );
  }

  useEffect(() => {
    draw();
  }, [titleAr, titleEn, lang]); // eslint-disable-line react-hooks/exhaustive-deps

  function roundRect(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    r: number,
  ) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }
  function wrapText(
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    lineHeight: number,
    rtl: boolean,
  ) {
    const words = text.split(" ");
    let line = "";
    let curY = y;
    for (const word of words) {
      const test = rtl ? `${word} ${line}` : `${line} ${word}`;
      if (ctx.measureText(test).width > maxWidth && line) {
        ctx.fillText(line, x, curY);
        line = word;
        curY += lineHeight;
      } else line = test.trim();
    }
    ctx.fillText(line, x, curY);
  }
  function download() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "mughalata-achievement.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={WIDTH}
        height={HEIGHT}
        className="w-full rounded-xl border border-border shadow-[var(--shadow-elevated)]"
      />
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={download}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-brand px-6 py-3 font-medium text-white shadow-[var(--shadow-brand)] hover:bg-brand-hover"
      >
        <Download size={16} /> {lang === "ar" ? "حفظ الصورة" : "Save Image"}
      </motion.button>
    </div>
  );
}
