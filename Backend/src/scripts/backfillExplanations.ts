import "dotenv/config";
import { z } from "zod";
import { prisma } from "../config/prisma.js";
import { callGemini } from "../services/geminiCall.js";

const responseSchema = {
  type: "OBJECT",
  properties: {
    explanationAr: { type: "STRING" },
    explanationEn: { type: "STRING" },
  },
  required: ["explanationAr", "explanationEn"],
};
const outputSchema = z.object({
  explanationAr: z.string().min(1),
  explanationEn: z.string().min(1),
});

async function backfill() {
  const total = await prisma.generatedQuestion.count({
    where: { explanationAr: null },
  });
  console.log(
    `${total} سؤال بدون شرح. ابدأ الآن — Ctrl+C بأي وقت آمن، إعادة التشغيل بتكمل من وين وقفت.`,
  );

  let done = 0;
  while (true) {
    const batch = await prisma.generatedQuestion.findMany({
      where: { explanationAr: null },
      take: 20,
      include: { fallacy: { select: { nameEn: true, definitionEn: true } } },
    });
    if (batch.length === 0) break;

    for (const q of batch) {
      const prompt = [
        "You are given an already-written example for a logic-education app, and need to add a short explanation.",
        `Fallacy: "${q.fallacy.nameEn}" — ${q.fallacy.definitionEn}`,
        `Arabic example: "${q.textAr}"`,
        `English example: "${q.textEn}"`,
        "Return explanationAr/explanationEn: one short, warm sentence naming the exact rhetorical trick at play in this specific example and why it sounds convincing despite being flawed.",
      ].join("\n");
      try {
        const raw = await callGemini({ userId: null, prompt, responseSchema });
        const parsed = outputSchema.parse(JSON.parse(raw));
        await prisma.generatedQuestion.update({
          where: { id: q.id },
          data: parsed,
        });
        done++;
        if (done % 10 === 0) console.log(`${done}/${total}...`);
      } catch (err) {
        console.error(
          `فشل بالسؤال ${q.id}:`,
          err instanceof Error ? err.message : err,
        );
      }
      await new Promise((r) => setTimeout(r, 6500));
    }
  }
  console.log(`خلص. ${done} شرح انضاف.`);
}

backfill()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
