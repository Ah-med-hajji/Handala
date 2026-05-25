-- Site content (about pages, editable from admin)
CREATE TABLE site_content (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key        text UNIQUE NOT NULL,
  title_ar   text NOT NULL,
  title_en   text,
  content_ar text NOT NULL,
  content_en text,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Seed default content blocks
INSERT INTO site_content (key, title_ar, title_en, content_ar, content_en) VALUES
  ('about_naji',
   'عن ناجي العلي',
   'About Naji Al-Ali',
   'ناجي العلي (1937–1987) رسام كاريكاتير فلسطيني وُلد في قرية الشجرة في الجليل. اشتُهر بشخصية حنظلة، الطفل الفلسطيني اللاجئ الذي يدير ظهره للعالم رفضًا للظلم. اغتيل في لندن في أغسطس 1987.',
   'Naji Al-Ali (1937–1987) was a Palestinian cartoonist born in the village of Al-Shajara in Galilee. He is best known for creating Handala, the refugee child who turns his back on the world in defiance. He was assassinated in London in August 1987.'),
  ('about_site',
   'عن الموقع',
   'About This Site',
   'هذا الموقع أرشيف رقمي مفتوح يضم رسومات الفنان ناجي العلي. هدفه حفظ هذا الإرث الإنساني والفني وإتاحته للأجيال القادمة.',
   'This site is an open digital archive of the cartoonist Naji Al-Ali. Its aim is to preserve this artistic and human legacy and make it accessible to future generations.');

-- Supporters / partners
CREATE TABLE supporters (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name_ar         text NOT NULL,
  name_en         text,
  url             text,
  logo_url        text,
  description_ar  text,
  description_en  text,
  display_order   integer NOT NULL DEFAULT 0,
  is_published    boolean NOT NULL DEFAULT true,
  created_at      timestamptz NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE supporters   ENABLE ROW LEVEL SECURITY;

-- Public read
CREATE POLICY "public_read_site_content" ON site_content FOR SELECT USING (true);
CREATE POLICY "public_read_supporters"   ON supporters   FOR SELECT USING (is_published = true);

-- Admin full access
CREATE POLICY "admin_all_site_content" ON site_content FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin_all_supporters"   ON supporters   FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- updated_at trigger for site_content
CREATE TRIGGER set_updated_at_site_content
  BEFORE UPDATE ON site_content
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
