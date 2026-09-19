// backend/src/data/fallacies.seed-data.ts (استبدله كامل — زدت category/subCategory/difficulty، مطابقة لنفس التصنيف يلي بالفرونت)
import type { FallacyCategory, FallacySubCategory, Difficulty } from '@prisma/client'


export interface FallacyDraft {
  slug: string
  nameAr: string
  nameEn: string
  category: FallacyCategory
  subCategory: FallacySubCategory
  difficulty: Difficulty
  definitionAr: string
  definitionEn: string
}
export const fallaciesDraft: FallacyDraft[] = [
  {
    slug: "ad-hominem",
    nameAr: "مهاجمة الشخص",
    nameEn: "Ad Hominem",
    category: "informal",
    subCategory: "relevance",
    difficulty: "beginner",
    definitionAr: "مهاجمة شخص القائل بدل مناقشة حجته.",
    definitionEn:
      "Attacking the person making an argument instead of addressing the argument itself.",
  },
  {
    slug: "straw-man",
    nameAr: "رجل القش",
    nameEn: "Straw Man",
    category: "informal",
    subCategory: "relevance",
    difficulty: "beginner",
    definitionAr: "تحريف حجة الخصم لنسخة أضعف ثم الرد عليها.",
    definitionEn:
      "Misrepresenting an opponent's argument as a weaker version, then refuting that instead.",
  },
  {
    slug: "false-dilemma",
    nameAr: "المعضلة الزائفة",
    nameEn: "False Dilemma",
    category: "informal",
    subCategory: "presumption",
    difficulty: "beginner",
    definitionAr: "تقديم خيارين فقط كأنهما الوحيدان مع وجود بدائل.",
    definitionEn:
      "Presenting only two options as if they were the only possibilities when more exist.",
  },
  {
    slug: "appeal-to-authority",
    nameAr: "الاحتكام إلى السلطة",
    nameEn: "Appeal to Authority",
    category: "informal",
    subCategory: "relevance",
    difficulty: "intermediate",
    definitionAr: "اعتبار الرأي صحيحاً لمكانة قائله لا لقوة دليله.",
    definitionEn:
      "Treating a claim as true mainly because of who said it, not the strength of the evidence.",
  },
  {
    slug: "appeal-to-emotion",
    nameAr: "الاستدلال العاطفي",
    nameEn: "Appeal to Emotion",
    category: "informal",
    subCategory: "relevance",
    difficulty: "beginner",
    definitionAr: "إثارة مشاعر كالخوف بدل تقديم حجة منطقية.",
    definitionEn:
      "Manipulating an emotion, like fear, instead of presenting a logical argument.",
  },
  {
    slug: "slippery-slope",
    nameAr: "المنحدر الزلق",
    nameEn: "Slippery Slope",
    category: "informal",
    subCategory: "weak_induction",
    difficulty: "intermediate",
    definitionAr: "الادعاء أن خطوة صغيرة ستؤدي لنتائج كارثية دون دليل.",
    definitionEn:
      "Claiming a small first step will inevitably lead to extreme consequences, with no evidence for the chain.",
  },
  {
    slug: "hasty-generalization",
    nameAr: "التعميم المتسرع",
    nameEn: "Hasty Generalization",
    category: "informal",
    subCategory: "weak_induction",
    difficulty: "intermediate",
    definitionAr: "استخلاص حكم عام من أمثلة قليلة جداً.",
    definitionEn: "Drawing a broad conclusion from too few examples.",
  },
  {
    slug: "circular-reasoning",
    nameAr: "الاستدلال الدائري",
    nameEn: "Circular Reasoning",
    category: "informal",
    subCategory: "presumption",
    difficulty: "advanced",
    definitionAr: "استخدام النتيجة نفسها كدليل على المقدمة.",
    definitionEn: "Using the conclusion itself as a premise that supports it.",
  },
  {
    slug: "red-herring",
    nameAr: "تشتيت الانتباه",
    nameEn: "Red Herring",
    category: "informal",
    subCategory: "relevance",
    difficulty: "intermediate",
    definitionAr: "إدخال نقطة غير ذات صلة لتحويل النقاش.",
    definitionEn:
      "Introducing an irrelevant point to divert attention from the argument.",
  },
  {
    slug: "appeal-to-ignorance",
    nameAr: "الاحتجاج بالجهل",
    nameEn: "Appeal to Ignorance",
    category: "informal",
    subCategory: "presumption",
    difficulty: "intermediate",
    definitionAr: "اعتبار الادعاء صحيحاً لعدم إثبات خطئه.",
    definitionEn:
      "Treating a claim as true simply because it hasn't been proven false.",
  },
  {
    slug: "bandwagon",
    nameAr: "مغالطة الشعبية",
    nameEn: "Bandwagon",
    category: "informal",
    subCategory: "relevance",
    difficulty: "beginner",
    definitionAr: "اعتبار الفكرة صحيحة لأن كثيرين يؤمنون بها.",
    definitionEn: "Treating an idea as true because many people believe it.",
  },
  {
    slug: "false-cause",
    nameAr: "السبب الزائف",
    nameEn: "False Cause",
    category: "informal",
    subCategory: "weak_induction",
    difficulty: "intermediate",
    definitionAr: "افتراض سببية بين حدثين لمجرد تتابعهما زمنياً.",
    definitionEn:
      "Assuming one event caused another just because it happened first.",
  },
  {
    slug: "appeal-to-tradition",
    nameAr: "الاحتكام إلى التقليد",
    nameEn: "Appeal to Tradition",
    category: "informal",
    subCategory: "relevance",
    difficulty: "intermediate",
    definitionAr: "اعتبار الممارسة صحيحة لأنها قديمة ومتوارثة.",
    definitionEn:
      "Treating a practice as correct simply because it's old and long-established.",
  },
  {
    slug: "tu-quoque",
    nameAr: "وأنت أيضاً",
    nameEn: "Tu Quoque",
    category: "informal",
    subCategory: "relevance",
    difficulty: "intermediate",
    definitionAr: "الرد على انتقاد باتهام المنتقِد بنفس الشيء.",
    definitionEn:
      "Responding to criticism by accusing the critic of the same thing.",
  },
  {
    slug: "loaded-question",
    nameAr: "السؤال الموجَّه",
    nameEn: "Loaded Question",
    category: "informal",
    subCategory: "presumption",
    difficulty: "advanced",
    definitionAr: "سؤال يتضمن افتراضاً مسبقاً غير مثبت يدين أي إجابة.",
    definitionEn:
      "Asking a question that contains an unproven assumption, so any answer looks guilty.",
  },
  {
    slug: "equivocation",
    nameAr: "المغالطة اللفظية",
    nameEn: "Equivocation",
    category: "informal",
    subCategory: "ambiguity",
    difficulty: "advanced",
    definitionAr: "استخدام كلمة بمعنيين مختلفين ضمن نفس الحجة.",
    definitionEn:
      "Using a word with two different meanings within the same argument.",
  },
  {
    slug: "no-true-scotsman",
    nameAr: "الاسكتلندي الحقيقي",
    nameEn: "No True Scotsman",
    category: "informal",
    subCategory: "presumption",
    difficulty: "advanced",
    definitionAr: "استبعاد أي مثال مضاد بادّعاء أنه لا يمثل الفئة الحقيقية.",
    definitionEn:
      "Dismissing a counterexample by claiming it doesn't represent the 'real' category.",
  },
  {
    slug: "appeal-to-nature",
    nameAr: "الاحتكام إلى الطبيعة",
    nameEn: "Appeal to Nature",
    category: "informal",
    subCategory: "presumption",
    difficulty: "advanced",
    definitionAr: "اعتبار الشيء جيداً لأنه طبيعي فقط.",
    definitionEn: "Treating something as good simply because it's 'natural.'",
  },
];
