-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Categories
CREATE TABLE categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name_ar text NOT NULL,
  name_en text NOT NULL,
  description_ar text,
  description_en text,
  cover_image_url text,
  display_order integer DEFAULT 0,
  is_published boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Cartoons
CREATE TABLE cartoons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title_ar text NOT NULL,
  title_en text,
  description_ar text,
  description_en text,
  image_url text NOT NULL,
  image_high_res_url text,
  publication_date date,
  source text,
  is_published boolean DEFAULT true,
  view_count integer DEFAULT 0,
  search_vector tsvector,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Many-to-many: cartoon ↔ category
CREATE TABLE cartoon_categories (
  cartoon_id uuid REFERENCES cartoons(id) ON DELETE CASCADE,
  category_id uuid REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (cartoon_id, category_id)
);

-- Tags
CREATE TABLE tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name_ar text NOT NULL,
  name_en text,
  slug text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Many-to-many: cartoon ↔ tag
CREATE TABLE cartoon_tags (
  cartoon_id uuid REFERENCES cartoons(id) ON DELETE CASCADE,
  tag_id uuid REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (cartoon_id, tag_id)
);

-- Videos
CREATE TABLE videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title_ar text NOT NULL,
  title_en text,
  description_ar text,
  description_en text,
  youtube_url text NOT NULL,
  youtube_id text NOT NULL,
  thumbnail_url text,
  is_published boolean DEFAULT true,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Submissions (Send a Cartoon / contact form)
CREATE TABLE submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_name text NOT NULL,
  sender_email text NOT NULL,
  message text,
  image_url text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'rejected')),
  admin_notes text,
  created_at timestamptz DEFAULT now()
);

-- Full-text search
CREATE OR REPLACE FUNCTION update_cartoon_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('arabic', COALESCE(NEW.title_ar, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(COALESCE(NEW.title_en, ''), '')), 'A') ||
    setweight(to_tsvector('arabic', COALESCE(NEW.description_ar, '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(COALESCE(NEW.description_en, ''), '')), 'B');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER cartoons_search_vector_update
  BEFORE INSERT OR UPDATE ON cartoons
  FOR EACH ROW EXECUTE FUNCTION update_cartoon_search_vector();

CREATE INDEX idx_cartoons_search ON cartoons USING GIN(search_vector);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at BEFORE UPDATE ON cartoons
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON videos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RPC to increment view count
CREATE OR REPLACE FUNCTION increment_view_count(p_cartoon_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE cartoons SET view_count = view_count + 1 WHERE id = p_cartoon_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE cartoons ENABLE ROW LEVEL SECURITY;
ALTER TABLE cartoon_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE cartoon_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- Public read (published content only)
CREATE POLICY "public_read_categories" ON categories FOR SELECT USING (is_published = true);
CREATE POLICY "public_read_cartoons" ON cartoons FOR SELECT USING (is_published = true);
CREATE POLICY "public_read_cartoon_categories" ON cartoon_categories FOR SELECT USING (true);
CREATE POLICY "public_read_tags" ON tags FOR SELECT USING (true);
CREATE POLICY "public_read_cartoon_tags" ON cartoon_tags FOR SELECT USING (true);
CREATE POLICY "public_read_videos" ON videos FOR SELECT USING (is_published = true);

-- Authenticated (admin) full access
CREATE POLICY "admin_all_categories" ON categories FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin_all_cartoons" ON cartoons FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin_all_cartoon_categories" ON cartoon_categories FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin_all_tags" ON tags FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin_all_cartoon_tags" ON cartoon_tags FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin_all_videos" ON videos FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin_all_submissions" ON submissions FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Public can submit
CREATE POLICY "public_insert_submissions" ON submissions FOR INSERT WITH CHECK (true);
