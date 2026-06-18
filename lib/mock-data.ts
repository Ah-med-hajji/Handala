import type { Category, Tag, Cartoon, CartoonWithRelations, Video, Submission, SiteContent, Supporter } from '@/types';

// ─── Categories ────────────────────────────────────────────────────────────────

export const MOCK_CATEGORIES: Category[] = [
  { id: 'cat-01', slug: 'palestine', name_ar: 'فلسطين', name_en: 'Palestine', description_ar: 'رسوم حنظلة عن فلسطين والقضية الفلسطينية', description_en: 'Handala cartoons about Palestine and the Palestinian cause', cover_image_url: 'https://picsum.photos/seed/cat-01/400/300', display_order: 1, is_published: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 'cat-02', slug: 'lebanon', name_ar: 'لبنان', name_en: 'Lebanon', description_ar: 'رسوم عن لبنان والحرب الأهلية', description_en: 'Cartoons about Lebanon and the civil war', cover_image_url: 'https://picsum.photos/seed/cat-02/400/300', display_order: 2, is_published: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 'cat-03', slug: 'arab-regimes', name_ar: 'الأنظمة العربية', name_en: 'Arab Regimes', description_ar: 'نقد الأنظمة العربية والاستبداد', description_en: 'Critique of Arab regimes and authoritarianism', cover_image_url: 'https://picsum.photos/seed/cat-03/400/300', display_order: 3, is_published: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 'cat-04', slug: 'imperialism', name_ar: 'الاستعمار', name_en: 'Imperialism', description_ar: 'رسوم عن الاستعمار والهيمنة الغربية', description_en: 'Cartoons about colonialism and Western hegemony', cover_image_url: 'https://picsum.photos/seed/cat-04/400/300', display_order: 4, is_published: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 'cat-05', slug: 'zionism', name_ar: 'الصهيونية', name_en: 'Zionism', description_ar: 'نقد الصهيونية والاحتلال', description_en: 'Critique of Zionism and occupation', cover_image_url: 'https://picsum.photos/seed/cat-05/400/300', display_order: 5, is_published: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 'cat-06', slug: 'refugees', name_ar: 'اللاجئون', name_en: 'Refugees', description_ar: 'رسوم عن اللاجئين الفلسطينيين والشتات', description_en: 'Cartoons about Palestinian refugees and diaspora', cover_image_url: 'https://picsum.photos/seed/cat-06/400/300', display_order: 6, is_published: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 'cat-07', slug: 'resistance', name_ar: 'المقاومة', name_en: 'Resistance', description_ar: 'رسوم عن المقاومة الفلسطينية', description_en: 'Cartoons about Palestinian resistance', cover_image_url: 'https://picsum.photos/seed/cat-07/400/300', display_order: 7, is_published: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 'cat-08', slug: 'camp-life', name_ar: 'حياة المخيم', name_en: 'Camp Life', description_ar: 'يوميات الحياة في مخيمات اللاجئين', description_en: 'Daily life in refugee camps', cover_image_url: 'https://picsum.photos/seed/cat-08/400/300', display_order: 8, is_published: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 'cat-09', slug: 'solidarity', name_ar: 'التضامن', name_en: 'Solidarity', description_ar: 'رسوم التضامن مع الشعب الفلسطيني', description_en: 'Solidarity with the Palestinian people', cover_image_url: 'https://picsum.photos/seed/cat-09/400/300', display_order: 9, is_published: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 'cat-10', slug: 'childhood', name_ar: 'الطفولة', name_en: 'Childhood', description_ar: 'رسوم عن أطفال فلسطين', description_en: 'Cartoons about Palestinian children', cover_image_url: 'https://picsum.photos/seed/cat-10/400/300', display_order: 10, is_published: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 'cat-11', slug: 'women', name_ar: 'المرأة الفلسطينية', name_en: 'Palestinian Women', description_ar: 'رسوم عن المرأة الفلسطينية وصمودها', description_en: 'Cartoons about Palestinian women and their resilience', cover_image_url: 'https://picsum.photos/seed/cat-11/400/300', display_order: 11, is_published: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 'cat-12', slug: 'olive-tree', name_ar: 'شجرة الزيتون', name_en: 'Olive Tree', description_ar: 'رمز الزيتون في رسوم ناجي العلي', description_en: 'The olive tree as a symbol in Naji Al-Ali\'s work', cover_image_url: 'https://picsum.photos/seed/cat-12/400/300', display_order: 12, is_published: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 'cat-13', slug: 'media', name_ar: 'الإعلام', name_en: 'Media', description_ar: 'نقد الإعلام العربي والغربي', description_en: 'Critique of Arab and Western media', cover_image_url: 'https://picsum.photos/seed/cat-13/400/300', display_order: 13, is_published: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 'cat-14', slug: 'capitalism', name_ar: 'الرأسمالية', name_en: 'Capitalism', description_ar: 'نقد الرأسمالية والاستغلال الاقتصادي', description_en: 'Critique of capitalism and economic exploitation', cover_image_url: 'https://picsum.photos/seed/cat-14/400/300', display_order: 14, is_published: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 'cat-15', slug: 'un', name_ar: 'الأمم المتحدة', name_en: 'United Nations', description_ar: 'رسوم عن الأمم المتحدة ومجلس الأمن', description_en: 'Cartoons about the UN and Security Council', cover_image_url: 'https://picsum.photos/seed/cat-15/400/300', display_order: 15, is_published: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 'cat-16', slug: 'usa', name_ar: 'الولايات المتحدة', name_en: 'United States', description_ar: 'رسوم عن الدور الأمريكي في المنطقة', description_en: 'Cartoons about the American role in the region', cover_image_url: 'https://picsum.photos/seed/cat-16/400/300', display_order: 16, is_published: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 'cat-17', slug: 'betrayal', name_ar: 'الخيانة', name_en: 'Betrayal', description_ar: 'رسوم عن الخيانة والتخاذل العربي', description_en: 'Cartoons about Arab betrayal and abandonment', cover_image_url: 'https://picsum.photos/seed/cat-17/400/300', display_order: 17, is_published: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 'cat-18', slug: 'weapons', name_ar: 'السلاح', name_en: 'Weapons', description_ar: 'رسوم عن تجارة الأسلحة والحروب', description_en: 'Cartoons about arms trade and wars', cover_image_url: 'https://picsum.photos/seed/cat-18/400/300', display_order: 18, is_published: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 'cat-19', slug: 'land', name_ar: 'الأرض', name_en: 'The Land', description_ar: 'رسوم عن الأرض الفلسطينية والتهجير', description_en: 'Cartoons about Palestinian land and displacement', cover_image_url: 'https://picsum.photos/seed/cat-19/400/300', display_order: 19, is_published: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 'cat-20', slug: 'prisoners', name_ar: 'الأسرى', name_en: 'Prisoners', description_ar: 'رسوم عن الأسرى الفلسطينيين', description_en: 'Cartoons about Palestinian prisoners', cover_image_url: 'https://picsum.photos/seed/cat-20/400/300', display_order: 20, is_published: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 'cat-21', slug: 'handala', name_ar: 'حنظلة', name_en: 'Handala', description_ar: 'رسوم حنظلة الطفل الشاهد', description_en: 'Handala the witnessing child', cover_image_url: 'https://picsum.photos/seed/cat-21/400/300', display_order: 21, is_published: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 'cat-22', slug: 'martyrs', name_ar: 'الشهداء', name_en: 'Martyrs', description_ar: 'رسوم تخليد الشهداء', description_en: 'Cartoons commemorating martyrs', cover_image_url: 'https://picsum.photos/seed/cat-22/400/300', display_order: 22, is_published: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 'cat-23', slug: 'jerusalem', name_ar: 'القدس', name_en: 'Jerusalem', description_ar: 'رسوم عن القدس وعروبتها', description_en: 'Cartoons about Jerusalem and its Arab identity', cover_image_url: 'https://picsum.photos/seed/cat-23/400/300', display_order: 23, is_published: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 'cat-24', slug: 'nakba', name_ar: 'النكبة', name_en: 'Nakba', description_ar: 'رسوم عن النكبة وذاكرة الشعب الفلسطيني', description_en: 'Cartoons about the Nakba and Palestinian memory', cover_image_url: 'https://picsum.photos/seed/cat-24/400/300', display_order: 24, is_published: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 'cat-25', slug: 'culture', name_ar: 'الثقافة والهوية', name_en: 'Culture & Identity', description_ar: 'رسوم عن الثقافة والهوية الفلسطينية', description_en: 'Cartoons about Palestinian culture and identity', cover_image_url: 'https://picsum.photos/seed/cat-25/400/300', display_order: 25, is_published: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
];

// ─── Tags ──────────────────────────────────────────────────────────────────────

export const MOCK_TAGS: Tag[] = [
  { id: 'tag-01', slug: 'handala', name_ar: 'حنظلة', name_en: 'Handala', created_at: '2024-01-01T00:00:00Z' },
  { id: 'tag-02', slug: 'satire', name_ar: 'سخرية', name_en: 'Satire', created_at: '2024-01-01T00:00:00Z' },
  { id: 'tag-03', slug: 'resistance', name_ar: 'مقاومة', name_en: 'Resistance', created_at: '2024-01-01T00:00:00Z' },
  { id: 'tag-04', slug: 'occupation', name_ar: 'احتلال', name_en: 'Occupation', created_at: '2024-01-01T00:00:00Z' },
  { id: 'tag-05', slug: 'diaspora', name_ar: 'شتات', name_en: 'Diaspora', created_at: '2024-01-01T00:00:00Z' },
  { id: 'tag-06', slug: 'solidarity', name_ar: 'تضامن', name_en: 'Solidarity', created_at: '2024-01-01T00:00:00Z' },
  { id: 'tag-07', slug: 'children', name_ar: 'أطفال', name_en: 'Children', created_at: '2024-01-01T00:00:00Z' },
  { id: 'tag-08', slug: 'women', name_ar: 'مرأة', name_en: 'Women', created_at: '2024-01-01T00:00:00Z' },
  { id: 'tag-09', slug: 'olive', name_ar: 'زيتون', name_en: 'Olive', created_at: '2024-01-01T00:00:00Z' },
  { id: 'tag-10', slug: 'camp', name_ar: 'مخيم', name_en: 'Camp', created_at: '2024-01-01T00:00:00Z' },
  { id: 'tag-11', slug: 'key', name_ar: 'مفتاح العودة', name_en: 'Key of Return', created_at: '2024-01-01T00:00:00Z' },
  { id: 'tag-12', slug: 'nakba', name_ar: 'نكبة', name_en: 'Nakba', created_at: '2024-01-01T00:00:00Z' },
  { id: 'tag-13', slug: 'martyrdom', name_ar: 'استشهاد', name_en: 'Martyrdom', created_at: '2024-01-01T00:00:00Z' },
  { id: 'tag-14', slug: 'media-critique', name_ar: 'نقد إعلامي', name_en: 'Media Critique', created_at: '2024-01-01T00:00:00Z' },
  { id: 'tag-15', slug: 'political', name_ar: 'سياسي', name_en: 'Political', created_at: '2024-01-01T00:00:00Z' },
  // Client-supplied tags (tags.docx)
  { id: 'tag-16', slug: 'marines', name_ar: 'المارينز', name_en: 'Marines', created_at: '2024-01-01T00:00:00Z' },
  { id: 'tag-17', slug: 'lebanon', name_ar: 'لبنان', name_en: 'Lebanon', created_at: '2024-01-01T00:00:00Z' },
  { id: 'tag-18', slug: 'invasion', name_ar: 'اجتياح', name_en: 'Invasion', created_at: '2024-01-01T00:00:00Z' },
  { id: 'tag-19', slug: '1982', name_ar: '1982', name_en: '1982', created_at: '2024-01-01T00:00:00Z' },
  { id: 'tag-20', slug: 'camp-david', name_ar: 'كامب ديفد', name_en: 'Camp David', created_at: '2024-01-01T00:00:00Z' },
  { id: 'tag-21', slug: 'egypt', name_ar: 'مصر', name_en: 'Egypt', created_at: '2024-01-01T00:00:00Z' },
  { id: 'tag-22', slug: 'sadat', name_ar: 'السادات', name_en: 'Sadat', created_at: '2024-01-01T00:00:00Z' },
  { id: 'tag-23', slug: 'egypt-detentions', name_ar: 'اعتقالات مصر', name_en: 'Egypt Detentions', created_at: '2024-01-01T00:00:00Z' },
  { id: 'tag-24', slug: 'bazzeq', name_ar: 'بزيق', name_en: 'Bazzeq', created_at: '2024-01-01T00:00:00Z' },
  { id: 'tag-25', slug: 'arab-summit', name_ar: 'قمة عربية', name_en: 'Arab Summit', created_at: '2024-01-01T00:00:00Z' },
  { id: 'tag-26', slug: 'summits', name_ar: 'قمم', name_en: 'Summits', created_at: '2024-01-01T00:00:00Z' },
  { id: 'tag-27', slug: 'arab-regimes', name_ar: 'الأنظمة العربية', name_en: 'Arab Regimes', created_at: '2024-01-01T00:00:00Z' },
  { id: 'tag-28', slug: 'fatima', name_ar: 'فاطمة', name_en: 'Fatima', created_at: '2024-01-01T00:00:00Z' },
  { id: 'tag-29', slug: 'fatima-husband', name_ar: 'زوج فاطمة', name_en: 'Fatima’s Husband', created_at: '2024-01-01T00:00:00Z' },
  { id: 'tag-30', slug: 'palestine-loyalty-lebanon', name_ar: 'وفاء فلسطين للبنان', name_en: 'Palestine’s Loyalty to Lebanon', created_at: '2024-01-01T00:00:00Z' },
  { id: 'tag-31', slug: 'sheikhs', name_ar: 'شيوخ', name_en: 'Sheikhs', created_at: '2024-01-01T00:00:00Z' },
  { id: 'tag-32', slug: 'the-toiler', name_ar: 'الكادح', name_en: 'The Toiler', created_at: '2024-01-01T00:00:00Z' },
  { id: 'tag-33', slug: 'palestinian-factions', name_ar: 'فصائل فلسطينية', name_en: 'Palestinian Factions', created_at: '2024-01-01T00:00:00Z' },
  { id: 'tag-34', slug: 'abu-ammar', name_ar: 'أبو عمار', name_en: 'Abu Ammar', created_at: '2024-01-01T00:00:00Z' },
  { id: 'tag-35', slug: 'abu-musa', name_ar: 'أبو موسى', name_en: 'Abu Musa', created_at: '2024-01-01T00:00:00Z' },
  { id: 'tag-36', slug: 'plo', name_ar: 'منظمة التحرير', name_en: 'PLO', created_at: '2024-01-01T00:00:00Z' },
  { id: 'tag-37', slug: 'split', name_ar: 'انشقاق', name_en: 'Split', created_at: '2024-01-01T00:00:00Z' },
  { id: 'tag-38', slug: 'infighting', name_ar: 'اقتتال', name_en: 'Infighting', created_at: '2024-01-01T00:00:00Z' },
  { id: 'tag-39', slug: 'fatah', name_ar: 'فتح', name_en: 'Fatah', created_at: '2024-01-01T00:00:00Z' },
  { id: 'tag-40', slug: 'jerusalem', name_ar: 'القدس', name_en: 'Jerusalem', created_at: '2024-01-01T00:00:00Z' },
  { id: 'tag-41', slug: 'the-zionist', name_ar: 'الصهيوني', name_en: 'The Zionist', created_at: '2024-01-01T00:00:00Z' },
  { id: 'tag-42', slug: 'zionist-soldier', name_ar: 'الجندي الصهيوني', name_en: 'The Zionist Soldier', created_at: '2024-01-01T00:00:00Z' },
  { id: 'tag-43', slug: 'khawarna', name_ar: 'خوارنة', name_en: 'Khawarna', created_at: '2024-01-01T00:00:00Z' },
  { id: 'tag-44', slug: 'keffiyeh', name_ar: 'الكوفية', name_en: 'Keffiyeh', created_at: '2024-01-01T00:00:00Z' },
  { id: 'tag-45', slug: 'women-tag', name_ar: 'المرأة', name_en: 'Women', created_at: '2024-01-01T00:00:00Z' },
  { id: 'tag-46', slug: 'armed-struggle', name_ar: 'الكفاح المسلح', name_en: 'Armed Struggle', created_at: '2024-01-01T00:00:00Z' },
  { id: 'tag-47', slug: 'fedayeen', name_ar: 'الفدائي', name_en: 'Fedayeen', created_at: '2024-01-01T00:00:00Z' },
  { id: 'tag-48', slug: 'exit-beirut', name_ar: 'الخروج من بيروت', name_en: 'Exit from Beirut', created_at: '2024-01-01T00:00:00Z' },
  { id: 'tag-49', slug: 'massacres', name_ar: 'المذابح', name_en: 'Massacres', created_at: '2024-01-01T00:00:00Z' },
  { id: 'tag-50', slug: 'the-camp', name_ar: 'المخيم', name_en: 'The Camp', created_at: '2024-01-01T00:00:00Z' },
  { id: 'tag-51', slug: 'christ', name_ar: 'المسيح', name_en: 'Christ', created_at: '2024-01-01T00:00:00Z' },
  { id: 'tag-52', slug: 'residents', name_ar: 'المقيمون', name_en: 'The Residents', created_at: '2024-01-01T00:00:00Z' },
  { id: 'tag-53', slug: 'the-left', name_ar: 'اليسار', name_en: 'The Left', created_at: '2024-01-01T00:00:00Z' },
  { id: 'tag-54', slug: 'beirut', name_ar: 'بيروت', name_en: 'Beirut', created_at: '2024-01-01T00:00:00Z' },
  { id: 'tag-55', slug: 'kuwaiti-affairs', name_ar: 'شؤون كويتية', name_en: 'Kuwaiti Affairs', created_at: '2024-01-01T00:00:00Z' },
  { id: 'tag-56', slug: 'censorship', name_ar: 'الرقابة', name_en: 'Censorship', created_at: '2024-01-01T00:00:00Z' },
  { id: 'tag-57', slug: 'press-freedom', name_ar: 'حرية الإعلام', name_en: 'Press Freedom', created_at: '2024-01-01T00:00:00Z' },
  { id: 'tag-58', slug: 'united-nations', name_ar: 'الأمم المتحدة', name_en: 'United Nations', created_at: '2024-01-01T00:00:00Z' },
  { id: 'tag-59', slug: 'usa', name_ar: 'الولايات المتحدة', name_en: 'USA', created_at: '2024-01-01T00:00:00Z' },
  { id: 'tag-60', slug: 'oil', name_ar: 'النفط', name_en: 'Oil', created_at: '2024-01-01T00:00:00Z' },
  { id: 'tag-61', slug: 'normalization', name_ar: 'التطبيع', name_en: 'Normalization', created_at: '2024-01-01T00:00:00Z' },
  { id: 'tag-62', slug: 'self-rule', name_ar: 'الحكم الذاتي', name_en: 'Self-Rule', created_at: '2024-01-01T00:00:00Z' },
  { id: 'tag-63', slug: 'settlement', name_ar: 'التسوية', name_en: 'The Settlement', created_at: '2024-01-01T00:00:00Z' },
  { id: 'tag-64', slug: 'zionist-leaders', name_ar: 'قادة صهاينة', name_en: 'Zionist Leaders', created_at: '2024-01-01T00:00:00Z' },
  { id: 'tag-65', slug: 'trucks', name_ar: 'الشاحنات', name_en: 'The Trucks', created_at: '2024-01-01T00:00:00Z' },
  { id: 'tag-66', slug: 'pflp', name_ar: 'الجبهة الشعبية لتحرير فلسطين', name_en: 'PFLP', created_at: '2024-01-01T00:00:00Z' },
  { id: 'tag-67', slug: 'george-habash', name_ar: 'جورج حبش', name_en: 'George Habash', created_at: '2024-01-01T00:00:00Z' },
  { id: 'tag-68', slug: 'lebanese-resistance', name_ar: 'المقاومة اللبنانية', name_en: 'Lebanese Resistance', created_at: '2024-01-01T00:00:00Z' },
  { id: 'tag-69', slug: 'the-south', name_ar: 'الجنوب', name_en: 'The South', created_at: '2024-01-01T00:00:00Z' },
  { id: 'tag-70', slug: 'book-fair', name_ar: 'معرض الكتاب', name_en: 'Book Fair', created_at: '2024-01-01T00:00:00Z' },
  { id: 'tag-71', slug: 'sidon', name_ar: 'صيدا', name_en: 'Sidon', created_at: '2024-01-01T00:00:00Z' },
  { id: 'tag-72', slug: 'tyre', name_ar: 'صور', name_en: 'Tyre', created_at: '2024-01-01T00:00:00Z' },
  { id: 'tag-73', slug: 'palestinian-bourgeoisie', name_ar: 'البرجوازية الفلسطينية', name_en: 'Palestinian Bourgeoisie', created_at: '2024-01-01T00:00:00Z' },
  { id: 'tag-74', slug: 'climate-crisis', name_ar: 'أزمة المناخ', name_en: 'Climate Crisis', created_at: '2024-01-01T00:00:00Z' },
  { id: 'tag-75', slug: 'kamal-jumblatt', name_ar: 'كمال جنبلاط', name_en: 'Kamal Jumblatt', created_at: '2024-01-01T00:00:00Z' },
  { id: 'tag-76', slug: 'sectarianism', name_ar: 'الطائفية', name_en: 'Sectarianism', created_at: '2024-01-01T00:00:00Z' },
  { id: 'tag-77', slug: 'three-nos', name_ar: 'اللاءات الثلاث', name_en: 'The Three No’s', created_at: '2024-01-01T00:00:00Z' },
  { id: 'tag-78', slug: 'freedom-opinion', name_ar: 'حرية الرأي', name_en: 'Freedom of Opinion', created_at: '2024-01-01T00:00:00Z' },
  { id: 'tag-79', slug: 'surrender', name_ar: 'استسلام', name_en: 'Surrender', created_at: '2024-01-01T00:00:00Z' },
  { id: 'tag-80', slug: 'the-press', name_ar: 'الصحافة', name_en: 'The Press', created_at: '2024-01-01T00:00:00Z' },
  { id: 'tag-81', slug: 'conferences', name_ar: 'مؤتمرات', name_en: 'Conferences', created_at: '2024-01-01T00:00:00Z' },
  { id: 'tag-82', slug: 'abu-saleh-nimr', name_ar: 'أبو صالح النمر', name_en: 'Abu Saleh Al-Nimr', created_at: '2024-01-01T00:00:00Z' },
  { id: 'tag-83', slug: 'phalangists', name_ar: 'الكتائب', name_en: 'Phalangists', created_at: '2024-01-01T00:00:00Z' },
  { id: 'tag-84', slug: 'reagan', name_ar: 'ريجان', name_en: 'Reagan', created_at: '2024-01-01T00:00:00Z' },
  { id: 'tag-85', slug: 'handala-face', name_ar: 'وجه حنظلة', name_en: 'Handala’s Face', created_at: '2024-01-01T00:00:00Z' },
  { id: 'tag-86', slug: 'islamic-summit', name_ar: 'القمة الإسلامية', name_en: 'Islamic Summit', created_at: '2024-01-01T00:00:00Z' },
  { id: 'tag-87', slug: 'soviet-union', name_ar: 'الاتحاد السوفييتي', name_en: 'Soviet Union', created_at: '2024-01-01T00:00:00Z' },
  { id: 'tag-88', slug: 'non-alignment', name_ar: 'عدم الانحياز', name_en: 'Non-Alignment', created_at: '2024-01-01T00:00:00Z' },
  { id: 'tag-89', slug: 'rapid-deployment-force', name_ar: 'قوات التدخل السريع', name_en: 'Rapid Deployment Force', created_at: '2024-01-01T00:00:00Z' },
  { id: 'tag-90', slug: 'cold-war', name_ar: 'الحرب الباردة', name_en: 'Cold War', created_at: '2024-01-01T00:00:00Z' },
  { id: 'tag-91', slug: 'thatcher', name_ar: 'تاتشر', name_en: 'Thatcher', created_at: '2024-01-01T00:00:00Z' },
  { id: 'tag-92', slug: 'begin', name_ar: 'بيغن', name_en: 'Begin', created_at: '2024-01-01T00:00:00Z' },
  { id: 'tag-93', slug: 'pope-shenouda', name_ar: 'البابا شنودة', name_en: 'Pope Shenouda', created_at: '2024-01-01T00:00:00Z' },
  { id: 'tag-94', slug: 'syria', name_ar: 'سوريا', name_en: 'Syria', created_at: '2024-01-01T00:00:00Z' },
  { id: 'tag-95', slug: 'sudan', name_ar: 'السودان', name_en: 'Sudan', created_at: '2024-01-01T00:00:00Z' },
  { id: 'tag-96', slug: 'al-assad', name_ar: 'الأسد', name_en: 'Al-Assad', created_at: '2024-01-01T00:00:00Z' },
  { id: 'tag-97', slug: 'reactor-bombing', name_ar: 'قصف المفاعل', name_en: 'Reactor Bombing', created_at: '2024-01-01T00:00:00Z' },
  { id: 'tag-98', slug: 'philip-habib', name_ar: 'فيليب حبيب', name_en: 'Philip Habib', created_at: '2024-01-01T00:00:00Z' },
];

// ─── Internal mock cartoon type ────────────────────────────────────────────────

export type MockCartoon = Cartoon & { categoryIds: string[]; tagIds: string[] };

// ─── Cartoons (60) ────────────────────────────────────────────────────────────

export const MOCK_CARTOONS: MockCartoon[] = [
  // Palestine (cat-01) — 10 cartoons
  { id: 'cartoon-01', title_ar: 'حنظلة والوطن', title_en: 'Handala and the Homeland', description_ar: 'حنظلة يحمل مفتاح العودة ويحدق في أفق فلسطين', description_en: 'Handala holds the key of return, staring at the horizon of Palestine', image_url: 'https://picsum.photos/seed/c01/600/450', image_high_res_url: 'https://picsum.photos/seed/c01/1200/900', publication_date: '1975-06-01', source: 'جريدة السفير', is_published: true, view_count: 1420, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z', categoryIds: ['cat-01', 'cat-21'], tagIds: ['tag-01', 'tag-11'] },
  { id: 'cartoon-02', title_ar: 'شجرة الزيتون لن تموت', title_en: 'The Olive Tree Shall Not Die', description_ar: 'المستوطنون يقطعون الزيتون وحنظلة يزرع غرسة جديدة', description_en: 'Settlers uproot olive trees while Handala plants a new sapling', image_url: 'https://picsum.photos/seed/c02/600/450', image_high_res_url: 'https://picsum.photos/seed/c02/1200/900', publication_date: '1976-03-15', source: 'جريدة السفير', is_published: true, view_count: 987, created_at: '2024-01-02T00:00:00Z', updated_at: '2024-01-02T00:00:00Z', categoryIds: ['cat-01', 'cat-12'], tagIds: ['tag-09', 'tag-04'] },
  { id: 'cartoon-03', title_ar: 'فلسطين في القلب', title_en: 'Palestine in the Heart', description_ar: 'خريطة فلسطين محفورة في قلب حنظلة', description_en: 'The map of Palestine etched into Handala\'s heart', image_url: 'https://picsum.photos/seed/c03/600/450', image_high_res_url: 'https://picsum.photos/seed/c03/1200/900', publication_date: '1977-05-15', source: 'جريدة النهار', is_published: true, view_count: 2103, created_at: '2024-01-03T00:00:00Z', updated_at: '2024-01-03T00:00:00Z', categoryIds: ['cat-01', 'cat-24'], tagIds: ['tag-01', 'tag-12'] },
  { id: 'cartoon-04', title_ar: 'المفتاح لن يصدأ', title_en: 'The Key Will Not Rust', description_ar: 'عجوز فلسطينية تحتضن مفتاح بيتها القديم', description_en: 'An old Palestinian woman clutches the key to her ancestral home', image_url: 'https://picsum.photos/seed/c04/600/450', image_high_res_url: 'https://picsum.photos/seed/c04/1200/900', publication_date: '1978-01-20', source: 'جريدة السفير', is_published: true, view_count: 1756, created_at: '2024-01-04T00:00:00Z', updated_at: '2024-01-04T00:00:00Z', categoryIds: ['cat-01', 'cat-06'], tagIds: ['tag-11', 'tag-05'] },
  { id: 'cartoon-05', title_ar: 'يوم الأرض', title_en: 'Land Day', description_ar: 'الفلسطينيون يتشبثون بالأرض رغم المدافع', description_en: 'Palestinians cling to the land despite cannons', image_url: 'https://picsum.photos/seed/c05/600/450', image_high_res_url: 'https://picsum.photos/seed/c05/1200/900', publication_date: '1976-03-30', source: 'جريدة السفير', is_published: true, view_count: 3241, created_at: '2024-01-05T00:00:00Z', updated_at: '2024-01-05T00:00:00Z', categoryIds: ['cat-01', 'cat-19'], tagIds: ['tag-03', 'tag-04'] },
  { id: 'cartoon-06', title_ar: 'الطفل والحجر', title_en: 'The Child and the Stone', description_ar: 'طفل فلسطيني يواجه الدبابة بحجر', description_en: 'A Palestinian child faces a tank with a stone', image_url: 'https://picsum.photos/seed/c06/600/450', image_high_res_url: 'https://picsum.photos/seed/c06/1200/900', publication_date: '1979-09-01', source: 'جريدة النهار', is_published: true, view_count: 4502, created_at: '2024-01-06T00:00:00Z', updated_at: '2024-01-06T00:00:00Z', categoryIds: ['cat-01', 'cat-10'], tagIds: ['tag-07', 'tag-03'] },
  { id: 'cartoon-07', title_ar: 'القدس في خطر', title_en: 'Jerusalem in Danger', description_ar: 'القبة الصخرة تحت سماء ملبدة بالغيوم والأسلاك الشائكة', description_en: 'The Dome of the Rock under stormy skies and barbed wire', image_url: 'https://picsum.photos/seed/c07/600/450', image_high_res_url: 'https://picsum.photos/seed/c07/1200/900', publication_date: '1980-07-30', source: 'جريدة السفير', is_published: true, view_count: 2876, created_at: '2024-01-07T00:00:00Z', updated_at: '2024-01-07T00:00:00Z', categoryIds: ['cat-01', 'cat-23'], tagIds: ['tag-04', 'tag-15'] },
  { id: 'cartoon-08', title_ar: 'الوطن ذاكرة', title_en: 'The Homeland is Memory', description_ar: 'حنظلة ينظر إلى صورة فلسطين القديمة', description_en: 'Handala gazes at an old photograph of Palestine', image_url: 'https://picsum.photos/seed/c08/600/450', image_high_res_url: 'https://picsum.photos/seed/c08/1200/900', publication_date: '1981-05-15', source: 'جريدة الوطن', is_published: true, view_count: 1634, created_at: '2024-01-08T00:00:00Z', updated_at: '2024-01-08T00:00:00Z', categoryIds: ['cat-01', 'cat-24'], tagIds: ['tag-01', 'tag-12'] },
  { id: 'cartoon-09', title_ar: 'بنادق وزيتون', title_en: 'Rifles and Olive Branches', description_ar: 'يد واحدة ترفع البندقية وأخرى تمسك غصن الزيتون', description_en: 'One hand raises a rifle, the other holds an olive branch', image_url: 'https://picsum.photos/seed/c09/600/450', image_high_res_url: 'https://picsum.photos/seed/c09/1200/900', publication_date: '1974-11-13', source: 'جريدة النهار', is_published: true, view_count: 2208, created_at: '2024-01-09T00:00:00Z', updated_at: '2024-01-09T00:00:00Z', categoryIds: ['cat-01', 'cat-07'], tagIds: ['tag-03', 'tag-09'] },
  { id: 'cartoon-10', title_ar: 'أبناء فلسطين', title_en: 'Sons of Palestine', description_ar: 'أجيال فلسطينية تتشابك في صورة واحدة', description_en: 'Palestinian generations intertwined in a single image', image_url: 'https://picsum.photos/seed/c10/600/450', image_high_res_url: 'https://picsum.photos/seed/c10/1200/900', publication_date: '1982-06-01', source: 'جريدة السفير', is_published: true, view_count: 1390, created_at: '2024-01-10T00:00:00Z', updated_at: '2024-01-10T00:00:00Z', categoryIds: ['cat-01', 'cat-25'], tagIds: ['tag-01', 'tag-15'] },

  // Lebanon (cat-02) — 6 cartoons
  { id: 'cartoon-11', title_ar: 'بيروت تحترق', title_en: 'Beirut Burns', description_ar: 'بيروت تحترق والعالم يتفرج', description_en: 'Beirut burns while the world watches', image_url: 'https://picsum.photos/seed/c11/600/450', image_high_res_url: 'https://picsum.photos/seed/c11/1200/900', publication_date: '1982-08-01', source: 'جريدة السفير', is_published: true, view_count: 3100, created_at: '2024-01-11T00:00:00Z', updated_at: '2024-01-11T00:00:00Z', categoryIds: ['cat-02'], tagIds: ['tag-15', 'tag-13'] },
  { id: 'cartoon-12', title_ar: 'الحرب الأهلية', title_en: 'The Civil War', description_ar: 'اللبنانيون يقتلون بعضهم والمستفيد يتفرج', description_en: 'Lebanese kill each other while the beneficiary watches', image_url: 'https://picsum.photos/seed/c12/600/450', image_high_res_url: 'https://picsum.photos/seed/c12/1200/900', publication_date: '1975-04-13', source: 'جريدة السفير', is_published: true, view_count: 1800, created_at: '2024-01-12T00:00:00Z', updated_at: '2024-01-12T00:00:00Z', categoryIds: ['cat-02'], tagIds: ['tag-02', 'tag-15'] },
  { id: 'cartoon-13', title_ar: 'صبرا وشاتيلا', title_en: 'Sabra and Shatila', description_ar: 'مجزرة صبرا وشاتيلا والعالم الصامت', description_en: 'The massacre of Sabra and Shatila and the silent world', image_url: 'https://picsum.photos/seed/c13/600/450', image_high_res_url: 'https://picsum.photos/seed/c13/1200/900', publication_date: '1982-09-19', source: 'جريدة السفير', is_published: true, view_count: 5200, created_at: '2024-01-13T00:00:00Z', updated_at: '2024-01-13T00:00:00Z', categoryIds: ['cat-02', 'cat-22'], tagIds: ['tag-13', 'tag-15'] },
  { id: 'cartoon-14', title_ar: 'المخيم والجدار', title_en: 'The Camp and the Wall', description_ar: 'الجدار يحاصر المخيم وحنظلة يراقب', description_en: 'The wall besieges the camp while Handala watches', image_url: 'https://picsum.photos/seed/c14/600/450', image_high_res_url: 'https://picsum.photos/seed/c14/1200/900', publication_date: '1976-08-10', source: 'جريدة النهار', is_published: true, view_count: 1450, created_at: '2024-01-14T00:00:00Z', updated_at: '2024-01-14T00:00:00Z', categoryIds: ['cat-02', 'cat-08'], tagIds: ['tag-10', 'tag-04'] },
  { id: 'cartoon-15', title_ar: 'الطائرات فوق بيروت', title_en: 'Planes Over Beirut', description_ar: 'طائرات الحرب تحلق فوق بيروت المشتعلة', description_en: 'War planes fly over a blazing Beirut', image_url: 'https://picsum.photos/seed/c15/600/450', image_high_res_url: 'https://picsum.photos/seed/c15/1200/900', publication_date: '1982-07-01', source: 'جريدة السفير', is_published: true, view_count: 2300, created_at: '2024-01-15T00:00:00Z', updated_at: '2024-01-15T00:00:00Z', categoryIds: ['cat-02', 'cat-05'], tagIds: ['tag-04', 'tag-15'] },
  { id: 'cartoon-16', title_ar: 'أطفال المخيمات', title_en: 'Children of the Camps', description_ar: 'أطفال المخيمات يلعبون بين الأنقاض', description_en: 'Camp children play among the rubble', image_url: 'https://picsum.photos/seed/c16/600/450', image_high_res_url: 'https://picsum.photos/seed/c16/1200/900', publication_date: '1977-02-14', source: 'جريدة النهار', is_published: true, view_count: 1900, created_at: '2024-01-16T00:00:00Z', updated_at: '2024-01-16T00:00:00Z', categoryIds: ['cat-02', 'cat-10'], tagIds: ['tag-07', 'tag-10'] },

  // Arab Regimes (cat-03) — 5 cartoons
  { id: 'cartoon-17', title_ar: 'العرش والشعب', title_en: 'The Throne and the People', description_ar: 'الحاكم على عرشه والشعب في القاع', description_en: 'The ruler on his throne, the people at the bottom', image_url: 'https://picsum.photos/seed/c17/600/450', image_high_res_url: 'https://picsum.photos/seed/c17/1200/900', publication_date: '1977-01-01', source: 'جريدة السفير', is_published: true, view_count: 2700, created_at: '2024-01-17T00:00:00Z', updated_at: '2024-01-17T00:00:00Z', categoryIds: ['cat-03'], tagIds: ['tag-02', 'tag-15'] },
  { id: 'cartoon-18', title_ar: 'المؤتمرات العربية', title_en: 'Arab Conferences', description_ar: 'قادة عرب في مؤتمر وفلسطين تنتظر', description_en: 'Arab leaders in conference while Palestine waits', image_url: 'https://picsum.photos/seed/c18/600/450', image_high_res_url: 'https://picsum.photos/seed/c18/1200/900', publication_date: '1978-11-01', source: 'جريدة السفير', is_published: true, view_count: 1670, created_at: '2024-01-18T00:00:00Z', updated_at: '2024-01-18T00:00:00Z', categoryIds: ['cat-03', 'cat-17'], tagIds: ['tag-02', 'tag-15'] },
  { id: 'cartoon-19', title_ar: 'النفط والدم', title_en: 'Oil and Blood', description_ar: 'ثروة النفط تُستخدم لشراء الصمت لا الحرية', description_en: 'Oil wealth used to buy silence, not freedom', image_url: 'https://picsum.photos/seed/c19/600/450', image_high_res_url: 'https://picsum.photos/seed/c19/1200/900', publication_date: '1973-10-20', source: 'جريدة النهار', is_published: true, view_count: 3400, created_at: '2024-01-19T00:00:00Z', updated_at: '2024-01-19T00:00:00Z', categoryIds: ['cat-03', 'cat-14'], tagIds: ['tag-02', 'tag-15'] },
  { id: 'cartoon-20', title_ar: 'الاستبداد المُزيَّن', title_en: 'Decorated Tyranny', description_ar: 'الطاغية يُزيِّن نفسه بأوسمة مزيفة', description_en: 'The tyrant adorns himself with fake medals', image_url: 'https://picsum.photos/seed/c20/600/450', image_high_res_url: 'https://picsum.photos/seed/c20/1200/900', publication_date: '1980-03-01', source: 'جريدة السفير', is_published: true, view_count: 2100, created_at: '2024-01-20T00:00:00Z', updated_at: '2024-01-20T00:00:00Z', categoryIds: ['cat-03'], tagIds: ['tag-02', 'tag-15'] },
  { id: 'cartoon-21', title_ar: 'الخطاب الفارغ', title_en: 'The Empty Speech', description_ar: 'الزعيم يخطب والكلمات تتحول إلى فقاعات فارغة', description_en: 'The leader speaks and words turn into empty bubbles', image_url: 'https://picsum.photos/seed/c21/600/450', image_high_res_url: 'https://picsum.photos/seed/c21/1200/900', publication_date: '1979-04-01', source: 'جريدة النهار', is_published: true, view_count: 1850, created_at: '2024-01-21T00:00:00Z', updated_at: '2024-01-21T00:00:00Z', categoryIds: ['cat-03', 'cat-13'], tagIds: ['tag-02', 'tag-14'] },

  // Refugees (cat-06) — 5 cartoons
  { id: 'cartoon-22', title_ar: 'العودة حق', title_en: 'Return is a Right', description_ar: 'حنظلة يرفع لافتة حق العودة', description_en: 'Handala holds a banner of the right of return', image_url: 'https://picsum.photos/seed/c22/600/450', image_high_res_url: 'https://picsum.photos/seed/c22/1200/900', publication_date: '1978-05-15', source: 'جريدة السفير', is_published: true, view_count: 4100, created_at: '2024-01-22T00:00:00Z', updated_at: '2024-01-22T00:00:00Z', categoryIds: ['cat-06', 'cat-21'], tagIds: ['tag-01', 'tag-05', 'tag-11'] },
  { id: 'cartoon-23', title_ar: 'أجيال الشتات', title_en: 'Diaspora Generations', description_ar: 'ثلاثة أجيال في المخيم يحملون نفس المفتاح', description_en: 'Three generations in camp carry the same key', image_url: 'https://picsum.photos/seed/c23/600/450', image_high_res_url: 'https://picsum.photos/seed/c23/1200/900', publication_date: '1981-11-01', source: 'جريدة الوطن', is_published: true, view_count: 1980, created_at: '2024-01-23T00:00:00Z', updated_at: '2024-01-23T00:00:00Z', categoryIds: ['cat-06', 'cat-08'], tagIds: ['tag-05', 'tag-11', 'tag-10'] },
  { id: 'cartoon-24', title_ar: 'جواز السفر الممزق', title_en: 'The Torn Passport', description_ar: 'اللاجئ يحمل وثائق بلا وطن', description_en: 'The refugee holds documents for a homeland that no longer exists', image_url: 'https://picsum.photos/seed/c24/600/450', image_high_res_url: 'https://picsum.photos/seed/c24/1200/900', publication_date: '1979-07-01', source: 'جريدة السفير', is_published: true, view_count: 2450, created_at: '2024-01-24T00:00:00Z', updated_at: '2024-01-24T00:00:00Z', categoryIds: ['cat-06'], tagIds: ['tag-05', 'tag-12'] },
  { id: 'cartoon-25', title_ar: 'خيمة اللجوء', title_en: 'The Refugee Tent', description_ar: 'عائلة كاملة في خيمة واحدة وآمال لا تُعد', description_en: 'An entire family in one tent with endless hopes', image_url: 'https://picsum.photos/seed/c25/600/450', image_high_res_url: 'https://picsum.photos/seed/c25/1200/900', publication_date: '1977-09-01', source: 'جريدة النهار', is_published: true, view_count: 1760, created_at: '2024-01-25T00:00:00Z', updated_at: '2024-01-25T00:00:00Z', categoryIds: ['cat-06', 'cat-08'], tagIds: ['tag-10', 'tag-05'] },
  { id: 'cartoon-26', title_ar: 'الهجرة الثانية', title_en: 'The Second Exodus', description_ar: 'الفلسطيني يُهجَّر مرة ثانية من المخيم', description_en: 'The Palestinian is displaced a second time from the camp', image_url: 'https://picsum.photos/seed/c26/600/450', image_high_res_url: 'https://picsum.photos/seed/c26/1200/900', publication_date: '1982-06-15', source: 'جريدة السفير', is_published: true, view_count: 2890, created_at: '2024-01-26T00:00:00Z', updated_at: '2024-01-26T00:00:00Z', categoryIds: ['cat-06', 'cat-24'], tagIds: ['tag-12', 'tag-05'] },

  // Jerusalem (cat-23) — 4 cartoons
  { id: 'cartoon-27', title_ar: 'القدس لنا', title_en: 'Jerusalem is Ours', description_ar: 'أطفال يرفعون أعلام القدس أمام الجدار', description_en: 'Children raise flags of Jerusalem before the wall', image_url: 'https://picsum.photos/seed/c27/600/450', image_high_res_url: 'https://picsum.photos/seed/c27/1200/900', publication_date: '1980-08-11', source: 'جريدة السفير', is_published: true, view_count: 3700, created_at: '2024-01-27T00:00:00Z', updated_at: '2024-01-27T00:00:00Z', categoryIds: ['cat-23', 'cat-10'], tagIds: ['tag-07', 'tag-15'] },
  { id: 'cartoon-28', title_ar: 'الأقصى في خطر', title_en: 'Al-Aqsa in Danger', description_ar: 'المسجد الأقصى يواجه يد الهدم', description_en: 'Al-Aqsa Mosque faces the hand of destruction', image_url: 'https://picsum.photos/seed/c28/600/450', image_high_res_url: 'https://picsum.photos/seed/c28/1200/900', publication_date: '1969-08-21', source: 'جريدة النهار', is_published: true, view_count: 4800, created_at: '2024-01-28T00:00:00Z', updated_at: '2024-01-28T00:00:00Z', categoryIds: ['cat-23', 'cat-05'], tagIds: ['tag-04', 'tag-15'] },
  { id: 'cartoon-29', title_ar: 'مدينة الرب', title_en: 'City of the Lord', description_ar: 'القدس تبكي وأبناؤها في الشتات', description_en: 'Jerusalem weeps as her children are in diaspora', image_url: 'https://picsum.photos/seed/c29/600/450', image_high_res_url: 'https://picsum.photos/seed/c29/1200/900', publication_date: '1983-01-01', source: 'جريدة الوطن', is_published: true, view_count: 2560, created_at: '2024-01-29T00:00:00Z', updated_at: '2024-01-29T00:00:00Z', categoryIds: ['cat-23'], tagIds: ['tag-15', 'tag-12'] },
  { id: 'cartoon-30', title_ar: 'توحيد القدس المزيف', title_en: 'The False Unification', description_ar: 'نقد قرار ضم القدس تحت حراب الاحتلال', description_en: 'Critique of annexing Jerusalem under occupation bayonets', image_url: 'https://picsum.photos/seed/c30/600/450', image_high_res_url: 'https://picsum.photos/seed/c30/1200/900', publication_date: '1980-07-30', source: 'جريدة السفير', is_published: true, view_count: 3100, created_at: '2024-01-30T00:00:00Z', updated_at: '2024-01-30T00:00:00Z', categoryIds: ['cat-23', 'cat-04'], tagIds: ['tag-04', 'tag-02'] },

  // Resistance (cat-07) — 4 cartoons
  { id: 'cartoon-31', title_ar: 'الحجر أقوى من البندقية', title_en: 'The Stone is Stronger than the Gun', description_ar: 'حجر طفل يوقف دبابة', description_en: 'A child\'s stone stops a tank', image_url: 'https://picsum.photos/seed/c31/600/450', image_high_res_url: 'https://picsum.photos/seed/c31/1200/900', publication_date: '1985-01-01', source: 'جريدة السفير', is_published: true, view_count: 5100, created_at: '2024-01-31T00:00:00Z', updated_at: '2024-01-31T00:00:00Z', categoryIds: ['cat-07', 'cat-10'], tagIds: ['tag-03', 'tag-07'] },
  { id: 'cartoon-32', title_ar: 'الفدائي', title_en: 'The Fedayeen', description_ar: 'المقاتل الفلسطيني يحمل أمل الأمة', description_en: 'The Palestinian fighter carries the hope of the nation', image_url: 'https://picsum.photos/seed/c32/600/450', image_high_res_url: 'https://picsum.photos/seed/c32/1200/900', publication_date: '1970-03-21', source: 'جريدة النهار', is_published: true, view_count: 2870, created_at: '2024-02-01T00:00:00Z', updated_at: '2024-02-01T00:00:00Z', categoryIds: ['cat-07'], tagIds: ['tag-03', 'tag-15'] },
  { id: 'cartoon-33', title_ar: 'الانتفاضة', title_en: 'The Intifada', description_ar: 'شعب بأكمله يقف في وجه الاحتلال', description_en: 'An entire people stands against occupation', image_url: 'https://picsum.photos/seed/c33/600/450', image_high_res_url: 'https://picsum.photos/seed/c33/1200/900', publication_date: '1982-04-01', source: 'جريدة السفير', is_published: true, view_count: 4200, created_at: '2024-02-02T00:00:00Z', updated_at: '2024-02-02T00:00:00Z', categoryIds: ['cat-07', 'cat-01'], tagIds: ['tag-03', 'tag-04'] },
  { id: 'cartoon-34', title_ar: 'لن نستسلم', title_en: 'We Will Not Surrender', description_ar: 'الشعب الفلسطيني الواقف أمام المحتل', description_en: 'The Palestinian people standing before the occupier', image_url: 'https://picsum.photos/seed/c34/600/450', image_high_res_url: 'https://picsum.photos/seed/c34/1200/900', publication_date: '1983-06-01', source: 'جريدة الوطن', is_published: true, view_count: 3350, created_at: '2024-02-03T00:00:00Z', updated_at: '2024-02-03T00:00:00Z', categoryIds: ['cat-07'], tagIds: ['tag-03', 'tag-15'] },

  // Imperialism (cat-04) — 4 cartoons
  { id: 'cartoon-35', title_ar: 'الأمريكي والنفط', title_en: 'The American and Oil', description_ar: 'عم سام يمص نفط العرب', description_en: 'Uncle Sam sucks Arab oil', image_url: 'https://picsum.photos/seed/c35/600/450', image_high_res_url: 'https://picsum.photos/seed/c35/1200/900', publication_date: '1973-11-01', source: 'جريدة النهار', is_published: true, view_count: 3600, created_at: '2024-02-04T00:00:00Z', updated_at: '2024-02-04T00:00:00Z', categoryIds: ['cat-04', 'cat-16'], tagIds: ['tag-02', 'tag-15'] },
  { id: 'cartoon-36', title_ar: 'الغرب والشرق', title_en: 'West and East', description_ar: 'الغرب يفرض شروطه على الشرق', description_en: 'The West imposes its terms on the East', image_url: 'https://picsum.photos/seed/c36/600/450', image_high_res_url: 'https://picsum.photos/seed/c36/1200/900', publication_date: '1976-01-01', source: 'جريدة السفير', is_published: true, view_count: 2100, created_at: '2024-02-05T00:00:00Z', updated_at: '2024-02-05T00:00:00Z', categoryIds: ['cat-04'], tagIds: ['tag-02', 'tag-15'] },
  { id: 'cartoon-37', title_ar: 'السيطرة الاستعمارية', title_en: 'Colonial Control', description_ar: 'أيدي الاستعمار تحرك دمى العالم العربي', description_en: 'Colonial hands puppet Arab world leaders', image_url: 'https://picsum.photos/seed/c37/600/450', image_high_res_url: 'https://picsum.photos/seed/c37/1200/900', publication_date: '1977-04-01', source: 'جريدة النهار', is_published: true, view_count: 2800, created_at: '2024-02-06T00:00:00Z', updated_at: '2024-02-06T00:00:00Z', categoryIds: ['cat-04', 'cat-03'], tagIds: ['tag-02', 'tag-15'] },
  { id: 'cartoon-38', title_ar: 'قرارات مجلس الأمن', title_en: 'Security Council Decisions', description_ar: 'مجلس الأمن يصدر قراراً والاحتلال يمضي قُدُماً', description_en: 'Security Council issues a resolution while occupation advances', image_url: 'https://picsum.photos/seed/c38/600/450', image_high_res_url: 'https://picsum.photos/seed/c38/1200/900', publication_date: '1978-03-20', source: 'جريدة السفير', is_published: true, view_count: 1940, created_at: '2024-02-07T00:00:00Z', updated_at: '2024-02-07T00:00:00Z', categoryIds: ['cat-04', 'cat-15'], tagIds: ['tag-02', 'tag-14'] },

  // Women (cat-11) — 3 cartoons
  { id: 'cartoon-39', title_ar: 'المرأة الصامدة', title_en: 'The Steadfast Woman', description_ar: 'الأم الفلسطينية تحمل ابنها الشهيد وتواصل المسير', description_en: 'The Palestinian mother carries her martyred son and continues', image_url: 'https://picsum.photos/seed/c39/600/450', image_high_res_url: 'https://picsum.photos/seed/c39/1200/900', publication_date: '1980-05-01', source: 'جريدة السفير', is_published: true, view_count: 3200, created_at: '2024-02-08T00:00:00Z', updated_at: '2024-02-08T00:00:00Z', categoryIds: ['cat-11', 'cat-22'], tagIds: ['tag-08', 'tag-13'] },
  { id: 'cartoon-40', title_ar: 'أم الشهيد', title_en: 'Mother of the Martyr', description_ar: 'الأم تزغرد لاستشهاد ابنها', description_en: 'The mother ululates at her son\'s martyrdom', image_url: 'https://picsum.photos/seed/c40/600/450', image_high_res_url: 'https://picsum.photos/seed/c40/1200/900', publication_date: '1981-08-01', source: 'جريدة الوطن', is_published: true, view_count: 2400, created_at: '2024-02-09T00:00:00Z', updated_at: '2024-02-09T00:00:00Z', categoryIds: ['cat-11', 'cat-07'], tagIds: ['tag-08', 'tag-13', 'tag-03'] },
  { id: 'cartoon-41', title_ar: 'المرأة والأرض', title_en: 'Woman and Land', description_ar: 'المرأة الفلسطينية متجذرة في أرضها كالزيتون', description_en: 'The Palestinian woman rooted in her land like the olive tree', image_url: 'https://picsum.photos/seed/c41/600/450', image_high_res_url: 'https://picsum.photos/seed/c41/1200/900', publication_date: '1979-03-08', source: 'جريدة السفير', is_published: true, view_count: 1780, created_at: '2024-02-10T00:00:00Z', updated_at: '2024-02-10T00:00:00Z', categoryIds: ['cat-11', 'cat-19'], tagIds: ['tag-08', 'tag-09'] },

  // Martyrs (cat-22) — 3 cartoons
  { id: 'cartoon-42', title_ar: 'دماء الشهداء', title_en: 'Blood of the Martyrs', description_ar: 'دماء الشهداء تُروي الأرض وتُزهر الأمل', description_en: 'Martyrs\' blood irrigates the land and blooms hope', image_url: 'https://picsum.photos/seed/c42/600/450', image_high_res_url: 'https://picsum.photos/seed/c42/1200/900', publication_date: '1976-06-01', source: 'جريدة النهار', is_published: true, view_count: 3500, created_at: '2024-02-11T00:00:00Z', updated_at: '2024-02-11T00:00:00Z', categoryIds: ['cat-22', 'cat-19'], tagIds: ['tag-13', 'tag-09'] },
  { id: 'cartoon-43', title_ar: 'وصية الشهيد', title_en: 'The Martyr\'s Will', description_ar: 'الشهيد يوصي أبناءه بالمقاومة', description_en: 'The martyr wills his children to resist', image_url: 'https://picsum.photos/seed/c43/600/450', image_high_res_url: 'https://picsum.photos/seed/c43/1200/900', publication_date: '1984-03-01', source: 'جريدة الوطن', is_published: true, view_count: 2100, created_at: '2024-02-12T00:00:00Z', updated_at: '2024-02-12T00:00:00Z', categoryIds: ['cat-22', 'cat-07'], tagIds: ['tag-13', 'tag-03'] },
  { id: 'cartoon-44', title_ar: 'الشهيد يعيش', title_en: 'The Martyr Lives On', description_ar: 'الشهيد الذي يعيش في ذاكرة شعبه', description_en: 'The martyr who lives in his people\'s memory', image_url: 'https://picsum.photos/seed/c44/600/450', image_high_res_url: 'https://picsum.photos/seed/c44/1200/900', publication_date: '1983-04-01', source: 'جريدة السفير', is_published: true, view_count: 2900, created_at: '2024-02-13T00:00:00Z', updated_at: '2024-02-13T00:00:00Z', categoryIds: ['cat-22'], tagIds: ['tag-13', 'tag-15'] },

  // Nakba (cat-24) — 3 cartoons
  { id: 'cartoon-45', title_ar: 'ذكرى النكبة', title_en: 'Nakba Remembrance', description_ar: 'خمسون عاماً على النكبة والجرح لا يندمل', description_en: 'Fifty years since the Nakba and the wound does not heal', image_url: 'https://picsum.photos/seed/c45/600/450', image_high_res_url: 'https://picsum.photos/seed/c45/1200/900', publication_date: '1998-05-15', source: 'جريدة الوطن', is_published: true, view_count: 4600, created_at: '2024-02-14T00:00:00Z', updated_at: '2024-02-14T00:00:00Z', categoryIds: ['cat-24', 'cat-06'], tagIds: ['tag-12', 'tag-05'] },
  { id: 'cartoon-46', title_ar: '1948', title_en: '1948', description_ar: 'ما جرى في 1948 لم ينتهِ بعد', description_en: 'What happened in 1948 has not ended', image_url: 'https://picsum.photos/seed/c46/600/450', image_high_res_url: 'https://picsum.photos/seed/c46/1200/900', publication_date: '1978-05-15', source: 'جريدة السفير', is_published: true, view_count: 3900, created_at: '2024-02-15T00:00:00Z', updated_at: '2024-02-15T00:00:00Z', categoryIds: ['cat-24'], tagIds: ['tag-12', 'tag-04'] },
  { id: 'cartoon-47', title_ar: 'الشعب لا يُنسى', title_en: 'The People Are Not Forgotten', description_ar: 'الذاكرة الفلسطينية حية في كل جيل', description_en: 'Palestinian memory lives in every generation', image_url: 'https://picsum.photos/seed/c47/600/450', image_high_res_url: 'https://picsum.photos/seed/c47/1200/900', publication_date: '1982-05-15', source: 'جريدة النهار', is_published: true, view_count: 2300, created_at: '2024-02-16T00:00:00Z', updated_at: '2024-02-16T00:00:00Z', categoryIds: ['cat-24', 'cat-25'], tagIds: ['tag-12', 'tag-05'] },

  // Culture & Identity (cat-25) — 3 cartoons
  { id: 'cartoon-48', title_ar: 'الكوفية والهوية', title_en: 'The Keffiyeh and Identity', description_ar: 'الكوفية رمز الهوية الفلسطينية في كل مكان', description_en: 'The keffiyeh as a symbol of Palestinian identity everywhere', image_url: 'https://picsum.photos/seed/c48/600/450', image_high_res_url: 'https://picsum.photos/seed/c48/1200/900', publication_date: '1979-01-01', source: 'جريدة السفير', is_published: true, view_count: 2700, created_at: '2024-02-17T00:00:00Z', updated_at: '2024-02-17T00:00:00Z', categoryIds: ['cat-25', 'cat-06'], tagIds: ['tag-05', 'tag-15'] },
  { id: 'cartoon-49', title_ar: 'الفن والثورة', title_en: 'Art and Revolution', description_ar: 'الفنان يرسم وسلاحه الريشة', description_en: 'The artist paints and his weapon is the brush', image_url: 'https://picsum.photos/seed/c49/600/450', image_high_res_url: 'https://picsum.photos/seed/c49/1200/900', publication_date: '1983-09-01', source: 'جريدة الوطن', is_published: true, view_count: 1650, created_at: '2024-02-18T00:00:00Z', updated_at: '2024-02-18T00:00:00Z', categoryIds: ['cat-25', 'cat-07'], tagIds: ['tag-03', 'tag-15'] },
  { id: 'cartoon-50', title_ar: 'اللغة العربية', title_en: 'The Arabic Language', description_ar: 'اللغة العربية سلاح الأمة وذاكرتها', description_en: 'The Arabic language is the nation\'s weapon and memory', image_url: 'https://picsum.photos/seed/c50/600/450', image_high_res_url: 'https://picsum.photos/seed/c50/1200/900', publication_date: '1984-01-01', source: 'جريدة السفير', is_published: true, view_count: 1420, created_at: '2024-02-19T00:00:00Z', updated_at: '2024-02-19T00:00:00Z', categoryIds: ['cat-25'], tagIds: ['tag-15', 'tag-06'] },

  // Solidarity / Media / Misc — 10 more
  { id: 'cartoon-51', title_ar: 'تضامن الشعوب', title_en: 'People\'s Solidarity', description_ar: 'شعوب العالم تتضامن مع فلسطين', description_en: 'The world\'s peoples stand in solidarity with Palestine', image_url: 'https://picsum.photos/seed/c51/600/450', image_high_res_url: 'https://picsum.photos/seed/c51/1200/900', publication_date: '1974-05-15', source: 'جريدة النهار', is_published: true, view_count: 2100, created_at: '2024-02-20T00:00:00Z', updated_at: '2024-02-20T00:00:00Z', categoryIds: ['cat-09'], tagIds: ['tag-06', 'tag-15'] },
  { id: 'cartoon-52', title_ar: 'الإعلام المُزوَّر', title_en: 'Falsified Media', description_ar: 'وسائل الإعلام تُقلب الحقيقة رأساً على عقب', description_en: 'Media outlets flip the truth upside down', image_url: 'https://picsum.photos/seed/c52/600/450', image_high_res_url: 'https://picsum.photos/seed/c52/1200/900', publication_date: '1978-09-01', source: 'جريدة السفير', is_published: true, view_count: 3400, created_at: '2024-02-21T00:00:00Z', updated_at: '2024-02-21T00:00:00Z', categoryIds: ['cat-13'], tagIds: ['tag-14', 'tag-02'] },
  { id: 'cartoon-53', title_ar: 'التطبيع', title_en: 'Normalization', description_ar: 'نقد التطبيع مع الاحتلال', description_en: 'Critique of normalization with occupation', image_url: 'https://picsum.photos/seed/c53/600/450', image_high_res_url: 'https://picsum.photos/seed/c53/1200/900', publication_date: '1979-03-29', source: 'جريدة السفير', is_published: true, view_count: 4100, created_at: '2024-02-22T00:00:00Z', updated_at: '2024-02-22T00:00:00Z', categoryIds: ['cat-03', 'cat-17'], tagIds: ['tag-02', 'tag-15'] },
  { id: 'cartoon-54', title_ar: 'الأسير يصمد', title_en: 'The Prisoner Holds Firm', description_ar: 'الأسير خلف القضبان والأمل لا يغادره', description_en: 'The prisoner behind bars, hope never leaves him', image_url: 'https://picsum.photos/seed/c54/600/450', image_high_res_url: 'https://picsum.photos/seed/c54/1200/900', publication_date: '1977-11-01', source: 'جريدة النهار', is_published: true, view_count: 2700, created_at: '2024-02-23T00:00:00Z', updated_at: '2024-02-23T00:00:00Z', categoryIds: ['cat-20'], tagIds: ['tag-03', 'tag-15'] },
  { id: 'cartoon-55', title_ar: 'سفينة العودة', title_en: 'Ship of Return', description_ar: 'اللاجئون يستعدون للعودة على سفينة الأمل', description_en: 'Refugees prepare to return on the ship of hope', image_url: 'https://picsum.photos/seed/c55/600/450', image_high_res_url: 'https://picsum.photos/seed/c55/1200/900', publication_date: '1988-02-01', source: 'جريدة الوطن', is_published: true, view_count: 3800, created_at: '2024-02-24T00:00:00Z', updated_at: '2024-02-24T00:00:00Z', categoryIds: ['cat-06', 'cat-09'], tagIds: ['tag-11', 'tag-06'] },
  { id: 'cartoon-56', title_ar: 'السلاح الأمريكي', title_en: 'American Weapons', description_ar: 'الصواريخ الأمريكية تُدمر البيوت الفلسطينية', description_en: 'American missiles destroy Palestinian homes', image_url: 'https://picsum.photos/seed/c56/600/450', image_high_res_url: 'https://picsum.photos/seed/c56/1200/900', publication_date: '1982-07-15', source: 'جريدة السفير', is_published: true, view_count: 4300, created_at: '2024-02-25T00:00:00Z', updated_at: '2024-02-25T00:00:00Z', categoryIds: ['cat-16', 'cat-18'], tagIds: ['tag-15', 'tag-04'] },
  { id: 'cartoon-57', title_ar: 'حنظلة الشاهد', title_en: 'Handala the Witness', description_ar: 'حنظلة يشهد على العالم ظهره إلينا دائماً', description_en: 'Handala witnesses the world, always turning his back', image_url: 'https://picsum.photos/seed/c57/600/450', image_high_res_url: 'https://picsum.photos/seed/c57/1200/900', publication_date: '1969-01-01', source: 'جريدة النهار', is_published: true, view_count: 6100, created_at: '2024-02-26T00:00:00Z', updated_at: '2024-02-26T00:00:00Z', categoryIds: ['cat-21'], tagIds: ['tag-01', 'tag-15'] },
  { id: 'cartoon-58', title_ar: 'الديمقراطية الزائفة', title_en: 'Fake Democracy', description_ar: 'ديمقراطية تُعطي إسرائيل الحق وتسلبه من الفلسطيني', description_en: 'A democracy that gives Israel rights and strips Palestinians of them', image_url: 'https://picsum.photos/seed/c58/600/450', image_high_res_url: 'https://picsum.photos/seed/c58/1200/900', publication_date: '1975-03-01', source: 'جريدة السفير', is_published: true, view_count: 2600, created_at: '2024-02-27T00:00:00Z', updated_at: '2024-02-27T00:00:00Z', categoryIds: ['cat-05', 'cat-16'], tagIds: ['tag-02', 'tag-14'] },
  { id: 'cartoon-59', title_ar: 'الجوع سلاح', title_en: 'Hunger as a Weapon', description_ar: 'الحصار يتحول إلى سلاح جوع ضد الشعب', description_en: 'The siege becomes a weapon of hunger against the people', image_url: 'https://picsum.photos/seed/c59/600/450', image_high_res_url: 'https://picsum.photos/seed/c59/1200/900', publication_date: '1982-09-01', source: 'جريدة النهار', is_published: true, view_count: 3100, created_at: '2024-02-28T00:00:00Z', updated_at: '2024-02-28T00:00:00Z', categoryIds: ['cat-01', 'cat-08'], tagIds: ['tag-04', 'tag-10'] },
  { id: 'cartoon-60', title_ar: 'الرصاصة والقلم', title_en: 'The Bullet and the Pen', description_ar: 'ناجي العلي: قلمي رصاصتي والحقيقة درعي', description_en: 'Naji Al-Ali: my pen is my bullet and truth is my shield', image_url: 'https://picsum.photos/seed/c60/600/450', image_high_res_url: 'https://picsum.photos/seed/c60/1200/900', publication_date: '1987-07-22', source: 'جريدة الوطن', is_published: true, view_count: 7800, created_at: '2024-03-01T00:00:00Z', updated_at: '2024-03-01T00:00:00Z', categoryIds: ['cat-25', 'cat-07'], tagIds: ['tag-01', 'tag-03', 'tag-15'] },
];

// ─── Videos (6) ────────────────────────────────────────────────────────────────

export const MOCK_VIDEOS: Video[] = [
  { id: 'video-01', title_ar: 'قصة حنظلة', title_en: 'The Story of Handala', description_ar: 'وثائقي عن قصة حنظلة وصاحبه ناجي العلي', description_en: 'Documentary about Handala and his creator Naji Al-Ali', youtube_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', youtube_id: 'dQw4w9WgXcQ', thumbnail_url: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg', is_published: true, display_order: 1, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 'video-02', title_ar: 'ناجي العلي الفنان الثائر', title_en: 'Naji Al-Ali: The Revolutionary Artist', description_ar: 'حياة الفنان الفلسطيني ناجي العلي ومسيرته', description_en: 'The life and journey of Palestinian artist Naji Al-Ali', youtube_url: 'https://www.youtube.com/watch?v=9bZkp7q19f0', youtube_id: '9bZkp7q19f0', thumbnail_url: 'https://img.youtube.com/vi/9bZkp7q19f0/maxresdefault.jpg', is_published: true, display_order: 2, created_at: '2024-01-02T00:00:00Z', updated_at: '2024-01-02T00:00:00Z' },
  { id: 'video-03', title_ar: 'رسائل من المخيم', title_en: 'Messages from the Camp', description_ar: 'رسوم ناجي العلي من داخل مخيمات اللاجئين', description_en: 'Naji Al-Ali\'s cartoons from inside refugee camps', youtube_url: 'https://www.youtube.com/watch?v=JGwWNGJdvx8', youtube_id: 'JGwWNGJdvx8', thumbnail_url: 'https://img.youtube.com/vi/JGwWNGJdvx8/maxresdefault.jpg', is_published: true, display_order: 3, created_at: '2024-01-03T00:00:00Z', updated_at: '2024-01-03T00:00:00Z' },
  { id: 'video-04', title_ar: 'فلسطين في رسوم حنظلة', title_en: 'Palestine Through Handala\'s Eyes', description_ar: 'تحليل رسوم حنظلة التي صوّرت المأساة الفلسطينية', description_en: 'Analysis of Handala\'s cartoons depicting the Palestinian tragedy', youtube_url: 'https://www.youtube.com/watch?v=M7lc1UVf-VE', youtube_id: 'M7lc1UVf-VE', thumbnail_url: 'https://img.youtube.com/vi/M7lc1UVf-VE/maxresdefault.jpg', is_published: true, display_order: 4, created_at: '2024-01-04T00:00:00Z', updated_at: '2024-01-04T00:00:00Z' },
  { id: 'video-05', title_ar: 'اغتيال الريشة', title_en: 'Assassination of the Brush', description_ar: 'حادثة اغتيال ناجي العلي في لندن عام 1987', description_en: 'The assassination of Naji Al-Ali in London in 1987', youtube_url: 'https://www.youtube.com/watch?v=kJQP7kiw5Fk', youtube_id: 'kJQP7kiw5Fk', thumbnail_url: 'https://img.youtube.com/vi/kJQP7kiw5Fk/maxresdefault.jpg', is_published: true, display_order: 5, created_at: '2024-01-05T00:00:00Z', updated_at: '2024-01-05T00:00:00Z' },
  { id: 'video-06', title_ar: 'إرث حنظلة', title_en: 'Handala\'s Legacy', description_ar: 'تأثير رسوم حنظلة على الجيل الجديد من الفنانين', description_en: 'The impact of Handala\'s cartoons on the new generation of artists', youtube_url: 'https://www.youtube.com/watch?v=RgKAFK5djSk', youtube_id: 'RgKAFK5djSk', thumbnail_url: 'https://img.youtube.com/vi/RgKAFK5djSk/maxresdefault.jpg', is_published: true, display_order: 6, created_at: '2024-01-06T00:00:00Z', updated_at: '2024-01-06T00:00:00Z' },
];

// ─── Submissions (5) ──────────────────────────────────────────────────────────

export const MOCK_SUBMISSIONS: Submission[] = [
  { id: 'sub-01', sender_name: 'محمد أبو علي', sender_email: 'mabouali@example.com', message: 'وجدت هذه الرسومة النادرة في مجلة قديمة من السبعينيات', image_url: 'https://picsum.photos/seed/sub01/600/450', status: 'pending', admin_notes: null, created_at: '2024-03-01T10:00:00Z' },
  { id: 'sub-02', sender_name: 'Sarah Khalil', sender_email: 'sarah.k@example.com', message: 'My grandfather kept this clipping from a 1978 Lebanese newspaper', image_url: 'https://picsum.photos/seed/sub02/600/450', status: 'reviewed', admin_notes: 'Verified and added to collection cartoon-18', created_at: '2024-03-02T14:30:00Z' },
  { id: 'sub-03', sender_name: 'ليلى حسن', sender_email: 'layla.h@example.com', message: 'رسومة من مجلة الهدف من عام 1980', image_url: 'https://picsum.photos/seed/sub03/600/450', status: 'pending', admin_notes: null, created_at: '2024-03-05T09:00:00Z' },
  { id: 'sub-04', sender_name: 'Omar Nasser', sender_email: 'omar.n@example.com', message: 'Found this in my family\'s archive — not sure if already in collection', image_url: null, status: 'rejected', admin_notes: 'Duplicate of cartoon-05, already in collection', created_at: '2024-03-08T16:00:00Z' },
  { id: 'sub-05', sender_name: 'فاطمة الزهراء', sender_email: 'fatimazahra@example.com', message: 'رسومة أصلية من صحيفة السفير عام 1983', image_url: 'https://picsum.photos/seed/sub05/600/450', status: 'pending', admin_notes: null, created_at: '2024-03-10T11:45:00Z' },
];

// ─── Site Content ────────────────────────────────────────────────────────────

export const MOCK_CONTENT: SiteContent[] = [
  {
    id: 'content-01',
    key: 'about_naji',
    title_ar: 'عن ناجي العلي',
    title_en: 'About Naji Al-Ali',
    content_ar: `ناجي سليم حسين العلي (1937 - 1987) فنان كاريكاتيري فلسطيني، يُعدّ من أبرز الرسامين في التاريخ العربي الحديث.

وُلد في قرية الشجرة قضاء طبريا في فلسطين المحتلة، وتهجّر مع أسرته إلى مخيم عين الحلوة جنوب لبنان إثر نكبة 1948.

خلال مسيرته الفنية، رسم أكثر من أربعين ألف كاريكاتير نشرها في صحف عربية عديدة، منها جريدة السفير اللبنانية وجريدة القبس الكويتية. ابتكر شخصية حنظلة الشهيرة عام 1969، رمزًا للطفل الفلسطيني اللاجئ الذي يقف دائمًا ظهره للمشاهد شاهدًا على المآسي.

اغتيل في لندن في الثالث والعشرين من يوليو عام 1987 برصاصة في رأسه، ولقي حتفه بعد خمسة أسابيع في التاسع والعشرين من أغسطس من العام نفسه.`,
    content_en: `Naji Salim Hussain Al-Ali (1937-1987) was a Palestinian cartoonist, considered one of the most prominent artists in modern Arab history.

He was born in the village of Al-Shajara in the Tiberias district of historic Palestine, and was displaced with his family to the Ain Al-Hilweh refugee camp in southern Lebanon following the Nakba of 1948.

During his artistic career, he drew more than forty thousand cartoons published in many Arab newspapers, including the Lebanese newspaper Al-Safir and the Kuwaiti newspaper Al-Qabas. He created the famous character Handala in 1969, a symbol of the Palestinian refugee child who always stands with his back to the viewer, witnessing tragedies.

He was assassinated in London on July 23, 1987, shot in the head, and died five weeks later on August 29 of the same year.`,
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'content-02',
    key: 'about_site',
    title_ar: 'عن الموقع',
    title_en: 'About the Site',
    content_ar: `رسالتنا: أرشفة وحماية إرث ناجي العلي البصري، وتقديمه للأجيال الجديدة بطريقة منظمة وسهلة، مع الحفاظ على سياقه السياسي والثقافي.

لماذا هذا الأرشيف؟ ناجي العلي واحد من أبرز الفنانين العرب الذين وظّفوا الكاريكاتير أداةً للمقاومة والتعبير. رسوماته تمثّل وثيقةً تاريخية لا تُقدَّر، ولا بد من حفظها وإتاحتها للعالم.

نحن لسنا الجهة الرسمية لعائلة ناجي العلي، وإنما نعمل بروح تطوعية للحفاظ على هذا الإرث الإنساني العظيم وإيصاله لأوسع شريحة ممكنة.`,
    content_en: `Our Mission: To archive and protect Naji Al-Ali's visual legacy, and present it to new generations in an organized and accessible way, while preserving its political and cultural context.

Why this archive? Naji Al-Ali is one of the most prominent Arab artists who used cartoons as a tool of resistance and expression. His drawings represent an invaluable historical document that must be preserved and made available to the world.

We are not the official body of the Naji Al-Ali family, but we work voluntarily to preserve this great human legacy and reach as wide an audience as possible.`,
    updated_at: '2024-01-01T00:00:00Z',
  },
];

// ─── Supporters ───────────────────────────────────────────────────────────────

export const MOCK_SUPPORTERS: Supporter[] = [
  {
    id: 'sup-01',
    name_ar: 'مؤسسة الذاكرة الفلسطينية',
    name_en: 'Palestinian Memory Foundation',
    url: null,
    logo_url: null,
    description_ar: 'مؤسسة متخصصة في حفظ التراث الفلسطيني وتوثيقه وإتاحته للعموم.',
    description_en: 'Foundation specializing in preserving and documenting Palestinian heritage.',
    display_order: 1,
    is_published: true,
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'sup-02',
    name_ar: 'مركز الفنون الفلسطينية',
    name_en: 'Palestinian Arts Center',
    url: null,
    logo_url: null,
    description_ar: 'مركز ثقافي يدعم الفنانين الفلسطينيين ويحفظ أعمالهم.',
    description_en: 'Cultural center supporting Palestinian artists and preserving their works.',
    display_order: 2,
    is_published: true,
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'sup-03',
    name_ar: 'المتطوعون والمساهمون',
    name_en: 'Volunteers & Contributors',
    url: null,
    logo_url: null,
    description_ar: 'شكر خاص لجميع المتطوعين والمساهمين الذين أسهموا في بناء هذا الأرشيف الرقمي.',
    description_en: 'Special thanks to all volunteers and contributors who helped build this digital archive.',
    display_order: 3,
    is_published: true,
    created_at: '2024-01-01T00:00:00Z',
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function buildCartoonWithRelations(c: MockCartoon): CartoonWithRelations {
  return {
    ...c,
    categories: MOCK_CATEGORIES.filter(cat => c.categoryIds.includes(cat.id)),
    tags: MOCK_TAGS.filter(t => c.tagIds.includes(t.id)),
  };
}
