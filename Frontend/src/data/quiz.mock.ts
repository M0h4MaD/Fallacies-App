// frontend/src/data/quiz.mock.ts (ملف جديد)
export interface MockQuizQuestion {
  id: string
  textAr: string
  textEn: string
  correctSlug: string
  distractorSlugs: [string, string]
}

export const mockQuizQuestions: MockQuizQuestion[] = [
  { id: 'q1', textAr: 'كل أصدقائي مقتنعين بهاي الفكرة، فلازم تكون صحيحة.', textEn: 'All my friends believe this, so it must be true.', correctSlug: 'bandwagon', distractorSlugs: ['appeal-to-authority', 'hasty-generalization'] },
  { id: 'q2', textAr: 'قال لازم نراقب الإنفاق العام أكتر، فرد عليه التاني: يعني بدك تلغي كل الخدمات وتترك الناس بلا شي؟', textEn: 'He said we should watch public spending more closely. The other replied: so you want to cancel every service and leave people with nothing?', correctSlug: 'straw-man', distractorSlugs: ['false-dilemma', 'ad-hominem'] },
  { id: 'q3', textAr: 'إما توافقني الرأي بالكامل، أو يبقى معناتها ما عندك أي مبدأ.', textEn: 'Either you agree with me completely, or you have no principles at all.', correctSlug: 'false-dilemma', distractorSlugs: ['slippery-slope', 'straw-man'] },
  { id: 'q4', textAr: 'الدكتور فلان قال هيك، فلازم يكون صحيح مية بالمية.', textEn: 'Dr. So-and-so said this, so it must be 100% correct.', correctSlug: 'appeal-to-authority', distractorSlugs: ['bandwagon', 'appeal-to-tradition'] },
  { id: 'q5', textAr: 'إذا سمحنا بهاد القرار الصغير، رح ننتهي بفوضى شاملة خلال سنة.', textEn: "If we allow this small decision, we'll end up in total chaos within a year.", correctSlug: 'slippery-slope', distractorSlugs: ['false-cause', 'hasty-generalization'] },
  { id: 'q6', textAr: 'رأيه بالموضوع مش مهم، هو أصلاً ما كمل تعليمه.', textEn: "His opinion doesn't matter — he never even finished his education.", correctSlug: 'ad-hominem', distractorSlugs: ['tu-quoque', 'straw-man'] },
  { id: 'q7', textAr: 'هاد الكتاب صحيح لأنو هو نفسه بيقول إنو صحيح.', textEn: "This book is true because it says, itself, that it's true.", correctSlug: 'circular-reasoning', distractorSlugs: ['appeal-to-authority', 'false-dilemma'] },
  { id: 'q8', textAr: 'جربت هيك مطعم مرة وكانت الأكلة سيئة، كل المطاعم هون سيئة.', textEn: 'I tried one restaurant here once and the food was bad — every restaurant here must be bad.', correctSlug: 'hasty-generalization', distractorSlugs: ['false-cause', 'slippery-slope'] },
]