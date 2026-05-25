-- Seed data for Naji Al-Ali Digital Archive

-- Categories (25)
INSERT INTO categories (slug, name_ar, name_en, cover_image_url, display_order) VALUES
('palestine', 'فلسطين', 'Palestine', 'https://picsum.photos/seed/palestine/800/450', 1),
('lebanon', 'لبنان', 'Lebanon', 'https://picsum.photos/seed/lebanon/800/450', 2),
('arab-regimes', 'الأنظمة العربية', 'Arab Regimes', 'https://picsum.photos/seed/arab-regimes/800/450', 3),
('camps', 'المخيمات', 'Refugee Camps', 'https://picsum.photos/seed/camps/800/450', 4),
('occupation', 'الاحتلال', 'Occupation', 'https://picsum.photos/seed/occupation/800/450', 5),
('children-war', 'الطفل والحرب', 'Children and War', 'https://picsum.photos/seed/children-war/800/450', 6),
('normalization', 'التطبيع', 'Normalization', 'https://picsum.photos/seed/normalization/800/450', 7),
('america', 'أمريكا', 'America', 'https://picsum.photos/seed/america/800/450', 8),
('israel', 'إسرائيل', 'Israel', 'https://picsum.photos/seed/israel/800/450', 9),
('gulf', 'الخليج', 'Gulf', 'https://picsum.photos/seed/gulf/800/450', 10),
('egypt', 'مصر', 'Egypt', 'https://picsum.photos/seed/egypt/800/450', 11),
('syria', 'سوريا', 'Syria', 'https://picsum.photos/seed/syria/800/450', 12),
('jordan', 'الأردن', 'Jordan', 'https://picsum.photos/seed/jordan/800/450', 13),
('iraq', 'العراق', 'Iraq', 'https://picsum.photos/seed/iraq/800/450', 14),
('yemen', 'اليمن', 'Yemen', 'https://picsum.photos/seed/yemen/800/450', 15),
('libya', 'ليبيا', 'Libya', 'https://picsum.photos/seed/libya/800/450', 16),
('tunisia', 'تونس', 'Tunisia', 'https://picsum.photos/seed/tunisia/800/450', 17),
('revolutions', 'الثورات', 'Revolutions', 'https://picsum.photos/seed/revolutions/800/450', 18),
('women', 'المرأة', 'Women', 'https://picsum.photos/seed/women/800/450', 19),
('poverty', 'الفقر', 'Poverty', 'https://picsum.photos/seed/poverty/800/450', 20),
('freedom', 'الحرية', 'Freedom', 'https://picsum.photos/seed/freedom/800/450', 21),
('handala', 'حنظلة', 'Handala', 'https://picsum.photos/seed/handala/800/450', 22),
('media', 'الإعلام', 'Media', 'https://picsum.photos/seed/media/800/450', 23),
('religion-politics', 'الدين والسياسة', 'Religion and Politics', 'https://picsum.photos/seed/religion-politics/800/450', 24),
('arab-unity', 'الوحدة العربية', 'Arab Unity', 'https://picsum.photos/seed/arab-unity/800/450', 25);

-- Tags
INSERT INTO tags (name_ar, name_en, slug) VALUES
('حنظلة', 'Handala', 'handala'),
('الطفولة', 'Childhood', 'childhood'),
('المقاومة', 'Resistance', 'resistance'),
('العودة', 'Return', 'return'),
('الاحتلال', 'Occupation', 'occupation'),
('الصهيونية', 'Zionism', 'zionism'),
('الوحدة', 'Unity', 'unity'),
('الخيانة', 'Betrayal', 'betrayal'),
('الفقر', 'Poverty', 'poverty'),
('المرأة', 'Women', 'women'),
('الأنظمة', 'Regimes', 'regimes'),
('أمريكا', 'America', 'america'),
('السلام الكاذب', 'False Peace', 'false-peace'),
('الثورة', 'Revolution', 'revolution'),
('الهوية', 'Identity', 'identity');

-- Videos (6 placeholder entries)
INSERT INTO videos (title_ar, title_en, youtube_url, youtube_id, display_order) VALUES
('ناجي العلي – وثائقي', 'Naji Al-Ali – Documentary', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'dQw4w9WgXcQ', 1),
('حنظلة رمز المقاومة', 'Handala Symbol of Resistance', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'dQw4w9WgXcQ', 2),
('رسومات ناجي العلي', 'Naji Al-Ali Cartoons', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'dQw4w9WgXcQ', 3),
('ذكرى اغتيال ناجي', 'Anniversary of Naji Assassination', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'dQw4w9WgXcQ', 4),
('فلسطين في عيون ناجي', 'Palestine Through Naji Eyes', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'dQw4w9WgXcQ', 5),
('الفن والمقاومة', 'Art and Resistance', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'dQw4w9WgXcQ', 6);

-- Sample cartoons (20 entries for demonstration)
WITH cat_ids AS (
  SELECT id, slug FROM categories
)
INSERT INTO cartoons (title_ar, title_en, description_ar, image_url, publication_date, source, is_published)
SELECT
  title_ar, title_en, description_ar,
  'https://picsum.photos/seed/' || seed || '/800/600',
  pub_date::date, source, true
FROM (VALUES
  ('الوطن والمنفى', 'Homeland and Exile', 'رسم يصوّر معاناة الشعب الفلسطيني بين الوطن المحتل والمنفى القسري، من خلال شخصية حنظلة الصامت.', 'cartoon1', '1975-03-15', 'الأسبوع العربي'),
  ('لن أحني رأسي', 'I Will Not Bow', 'يجسّد الرسم إرادة الإنسان الفلسطيني وعزيمته في مواجهة الاحتلال، رافضًا الاستسلام مهما كانت الظروف.', 'cartoon2', '1976-06-20', 'القبس'),
  ('طفل وحجر', 'Child and Stone', 'رسم حنظلة يحمل حجرًا في مواجهة آلة الحرب، رمز لانتفاضة الشعب الفلسطيني بأبسط أدواته.', 'cartoon3', '1977-09-10', 'السفير'),
  ('السلام الزائف', 'False Peace', 'نقد لمفاوضات السلام التي لا تأخذ بعين الاعتبار حقوق الشعب الفلسطيني الأساسية.', 'cartoon4', '1978-01-05', 'الديار'),
  ('المخيم ينتظر', 'The Camp Waits', 'صورة من داخل مخيمات اللاجئين، حيث ينتظر الأطفال عودة لم تتحقق بعد.', 'cartoon5', '1979-04-22', 'النهار'),
  ('الزعماء والشعب', 'Leaders and People', 'رسم ساخر يكشف التناقض بين خطاب القادة العرب وواقع الشعوب المعاشة.', 'cartoon6', '1980-07-15', 'الأسبوع العربي'),
  ('أمريكا والمنطقة', 'America and the Region', 'تصوير للتدخل الأمريكي في شؤون المنطقة العربية ومآلاته على الشعوب.', 'cartoon7', '1981-02-28', 'القبس'),
  ('المرأة الصامدة', 'The Steadfast Woman', 'تكريم للمرأة الفلسطينية التي تحمل عبء الصمود يوميًا وتربي أجيال المقاومة.', 'cartoon8', '1982-11-03', 'السفير'),
  ('بيروت تحترق', 'Beirut Burns', 'رسم وثّق مأساة الاجتياح الإسرائيلي لبيروت عام 1982 وما خلّفه من دمار.', 'cartoon9', '1982-08-12', 'الديار'),
  ('مفتاح العودة', 'Key of Return', 'رمز المفتاح الذي يحمله اللاجئ الفلسطيني أملًا في العودة إلى أرضه يومًا ما.', 'cartoon10', '1983-05-15', 'النهار'),
  ('الديمقراطية العربية', 'Arab Democracy', 'نقد لغياب الديمقراطية في العالم العربي وتسلط الأنظمة الاستبدادية.', 'cartoon11', '1984-01-20', 'الأسبوع العربي'),
  ('الجوع والبترول', 'Hunger and Oil', 'رسم يرصد التناقض بين ثروات النفط العربي وفقر الشعوب التي تعاني من الجوع.', 'cartoon12', '1984-09-07', 'القبس'),
  ('الطفل والبندقية', 'Child and Rifle', 'حنظلة في مواجهة السلاح، رمز للبراءة في مواجهة الوحشية.', 'cartoon13', '1985-03-21', 'السفير'),
  ('التطبيع خيانة', 'Normalization is Betrayal', 'رفض قاطع للتطبيع مع الاحتلال الإسرائيلي واعتباره خيانة للقضية الفلسطينية.', 'cartoon14', '1985-10-14', 'الديار'),
  ('الأقصى يصرخ', 'Al-Aqsa Cries Out', 'رسم يصوّر معاناة المسجد الأقصى والقدس تحت الاحتلال.', 'cartoon15', '1986-04-29', 'النهار'),
  ('اللاجئ والأمم المتحدة', 'The Refugee and the UN', 'نقد لأداء المجتمع الدولي تجاه قضية اللاجئين الفلسطينيين.', 'cartoon16', '1986-08-03', 'الأسبوع العربي'),
  ('الوحدة العربية وهم', 'Arab Unity is an Illusion', 'رسم ساخر يكشف التفرقة بين العرب ويرصد عجزهم عن التوحد أمام المصاعب.', 'cartoon17', '1986-12-18', 'القبس'),
  ('الفقير والغني', 'The Poor and the Rich', 'مقارنة بين ثروات الأثرياء وفقر البسطاء في المجتمعات العربية.', 'cartoon18', '1987-02-09', 'السفير'),
  ('الإعلام والحقيقة', 'Media and Truth', 'نقد لوسائل الإعلام التي تحجب الحقيقة عن الشعوب وتضلل الرأي العام.', 'cartoon19', '1987-04-27', 'الديار'),
  ('آخر الرسوم', 'The Last Cartoon', 'رسم يختصر مسيرة ناجي العلي في الدفاع عن الحرية والكرامة الإنسانية.', 'cartoon20', '1987-07-01', 'النهار')
) AS t(title_ar, title_en, description_ar, seed, pub_date, source);
