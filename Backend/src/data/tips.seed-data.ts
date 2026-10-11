export interface TipDraft { type: string; textAr: string; textEn: string; fallacySlug?: string }

export const tipsDraft: TipDraft[] = [
  { type: 'did_you_know', textAr: "أول من صنّف المغالطات المنطقية بشكل منهجي كان أرسطو، بكتابه \"التفنيدات السفسطائية\" حوالي 350 ق.م.", textEn: "The first systematic classification of logical fallacies was Aristotle's \"Sophistical Refutations,\" written around 350 BCE." },
  { type: 'did_you_know', textAr: "دراسات نفسية بتشير إنو الناس بيميلوا يصدّقوا معلومة مكرّرة أكتر، حتى لو غلط — ظاهرة اسمها \"وهم الحقيقة\".", textEn: "Studies suggest people tend to believe repeated claims more, even false ones — it's called the 'illusory truth effect.'" },
  { type: 'did_you_know', textAr: "\"Ad Hominem\" لاتيني معناها الحرفي \"إلى الشخص\" — إشارة لتحويل الهجوم من الفكرة للشخص.", textEn: "'Ad Hominem' is Latin for 'to the person' — pointing at how the attack shifts from idea to individual.", fallacySlug: 'ad-hominem' },
  { type: 'did_you_know', textAr: "المنطق الصوري بيدرس صحة الاستدلال بغض النظر عن المحتوى؛ المغالطات غير الصورية بتتعلق بالمحتوى والسياق.", textEn: "Formal logic studies validity regardless of content; informal fallacies depend on content and context." },
  { type: 'did_you_know', textAr: "مغالطة \"رجل القش\" سميت هيك لأنو تفنيد نسخة محرّفة من حجة الخصم أسهل من دمية قش، مش لأنها تتضمن قش فعلياً.", textEn: "'Straw Man' is named for how easy a straw dummy is to knock down — not because it literally involves straw.", fallacySlug: 'straw-man' },

  { type: 'history', textAr: "بالقرن الخامس ق.م، السفسطائيون اليونان علّموا فن الإقناع أحياناً بغض النظر عن الصحة — أرسطو رد بتأسيس المنطق كعلم.", textEn: "In 5th-century BCE Greece, the Sophists taught persuasion sometimes regardless of truth — Aristotle responded by founding logic as a discipline." },
  { type: 'history', textAr: "مغالطة \"الاسكتلندي الحقيقي\" جات من مثال: حدا بيقول \"ولا اسكتلندي بيحط سكر بالعصيدة\"، ولما يجيبولو مثال بيرد \"يعني ولا اسكتلندي حقيقي\".", textEn: "'No True Scotsman' comes from: 'no Scotsman puts sugar on porridge' — and when shown a counterexample: 'well, no true Scotsman would.'", fallacySlug: 'no-true-scotsman' },
  { type: 'history', textAr: "بالعصور الوسطى، المنطق كان جزء أساسي من التعليم (الـ Trivium) جنب البلاغة والنحو، مش موضوع ثانوي.", textEn: "In medieval education, logic was core (part of the Trivium) alongside rhetoric and grammar — not a side topic." },
  { type: 'history', textAr: "الفيلسوف جون ستيوارت مِل كتب بالقرن التاسع عشر عن خطورة \"استبداد الرأي العام\" — قريب من فكرة مغالطة الشعبية اليوم.", textEn: "19th-century philosopher John Stuart Mill warned of 'the tyranny of the majority' — closely related to today's bandwagon fallacy.", fallacySlug: 'bandwagon' },
  { type: 'history', textAr: "\"Red Herring\" أصلها من تدريب كلاب الصيد: كانوا يستخدموا سمكة مدخّنة قوية الرائحة لتشتيت الكلب عن الأثر الأصلي.", textEn: "'Red Herring' comes from hunting-dog training: a strong-smelling smoked fish was used to distract a dog from the real scent trail.", fallacySlug: 'red-herring' },

  { type: 'pro_tip', textAr: "لما تسمع \"كل الناس بيعرفوا هيك\"، اسأل حالك: هل هاد دليل فعلاً، ولا محاولة إقناع بالعدد؟", textEn: "When you hear 'everyone knows this,' ask: is that actual evidence, or just persuasion by numbers?" },
  { type: 'pro_tip', textAr: "افصل بين \"مين قالها\" و\"شو قال\". الحجة القوية لازم تقف لحالها حتى لو قالها شخص عادي.", textEn: "Separate 'who said it' from 'what they said.' A strong argument stands on its own." },
  { type: 'pro_tip', textAr: "لو حسّيت إنو عم يعرضولك خيارين بس (\"إما معي أو ضدي\")، دوّر على الخيار التالت المتجاهل.", textEn: "If offered only two options ('with me or against me'), look for the third one being ignored." },
  { type: 'pro_tip', textAr: "الغضب أو الخوف السريع من فكرة إشارة منيحة تتوقف وتسأل: رد فعل على دليل، ولا على أسلوب العرض؟", textEn: "A quick jolt of anger or fear is a good cue to ask: reacting to evidence, or just to presentation?" },

  { type: 'mini_challenge', textAr: "\"كل خبراء الاقتصاد بيتفقوا معي، فلازم أكون محق.\" — مغالطة أو لأ؟ (الجواب: نعم — احتكام مبهم للسلطة بدون تحديد الخبراء أو دليلهم)", textEn: "\"All economists agree with me, so I must be right.\" — fallacy or not? (Yes — a vague appeal to authority with no named experts or evidence)", fallacySlug: 'appeal-to-authority' },
  { type: 'mini_challenge', textAr: "\"جرّبت دواء أعشاب مرة وحسّيت تحسّن، فهو أكيد فعّال.\" — مغالطة؟ (نعم — دليل قصصي)", textEn: "\"I tried an herbal remedy once and felt better, so it must work.\" — fallacy? (Yes — anecdotal evidence)", fallacySlug: 'anecdotal-evidence' },
  { type: 'mini_challenge', textAr: "\"لازم نمنع كل السيارات لأنو حادث واحد صار فيه وفاة.\" — مغالطة؟ (نعم — تعميم متسرع)", textEn: "\"We must ban all cars because one accident caused a death.\" — fallacy? (Yes — hasty generalization)", fallacySlug: 'hasty-generalization' },
  { type: 'mini_challenge', textAr: "\"هاد القانون عادل لأنو موجود من عشرين سنة.\" — مغالطة؟ (نعم — احتكام للتقليد)", textEn: "\"This law is fair because it's existed for twenty years.\" — fallacy? (Yes — appeal to tradition)", fallacySlug: 'appeal-to-tradition' },

  { type: 'spot_it', textAr: "\"لو ما وافقتوا عالمشروع، رح تخسروا كل شي بالمستقبل.\"", textEn: "\"If you don't approve this project, you'll lose everything in the future.\"", fallacySlug: 'slippery-slope' },
  { type: 'spot_it', textAr: "\"ليش بتسألني عن أرقامي؟ يعني رأيك أحسن؟\"", textEn: "\"Why are you questioning my numbers? Like your opinion is any better?\"", fallacySlug: 'tu-quoque' },
  { type: 'spot_it', textAr: "\"هيك الطبيعة رتّبتها، فهيك لازم تضل.\"", textEn: "\"Nature arranged it this way, so this is how it should stay.\"", fallacySlug: 'appeal-to-nature' },
  { type: 'spot_it', textAr: "\"كل يلي جربوا هالنظام الغذائي نحفوا.\" (من غير ما نعرف كم شخص جرّبوا وما نحفوا)", textEn: "\"Everyone who tried this diet lost weight.\" (with no mention of how many tried and didn't)", fallacySlug: 'biased-sample' },
  { type: 'spot_it', textAr: "\"مش لازم تصدّقني؟ يعني رأيك إني كذاب؟\"", textEn: "\"You don't have to believe me? So you think I'm a liar?\"", fallacySlug: 'false-dilemma' },
]
