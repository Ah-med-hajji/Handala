# Claude Code Prompts — Naji Al-Ali Digital Archive
# najicartoon.com | Next.js + Supabase + Vercel

> Run these prompts **sequentially** in Claude Code.
> Each prompt builds on the previous one.
> The PDF spec file is available at the root of the project — Claude Code should read it before starting.

---

## PROMPT 1 — Project Scaffold & Configuration

```
You are building a professional digital archive website for the works of Palestinian cartoonist Naji Al-Ali (ناجي العلي).

Read the full project specification from the PDF file at the root of this project before starting.

Create a Next.js 14 project (App Router) with the following setup:

**Tech stack:**
- Next.js 14 with App Router
- TypeScript
- Tailwind CSS (with RTL support via tailwindcss-rtl or logical properties)
- Supabase (database + storage + auth)
- next-intl for Arabic/English i18n
- Vercel deployment target

**Project structure to create:**
```
/app
  /[locale]
    layout.tsx
    page.tsx                  ← homepage (category grid)
    /categories
      /[slug]
        page.tsx              ← category page
    /cartoon
      /[id]
        page.tsx              ← single cartoon page
    /videos
      page.tsx
    /send-cartoon
      page.tsx                ← contact form
    /about-site
      page.tsx
    /about-naji
      page.tsx
    /supporters
      page.tsx
    /search
      page.tsx
  /admin
    layout.tsx                ← protected layout (no locale prefix)
    page.tsx                  ← dashboard overview
    /cartoons
      page.tsx
      /new/page.tsx
      /[id]/edit/page.tsx
    /categories
      page.tsx
      /new/page.tsx
      /[id]/edit/page.tsx
    /videos
      page.tsx
      /new/page.tsx
    /submissions
      page.tsx
    /tags
      page.tsx
    /login
      page.tsx
/components
  /ui
  /layout
  /cartoons
  /categories
  /videos
  /admin
/lib
  supabase.ts
  supabase-server.ts
  auth.ts
  database.ts
  storage.ts
/lib/actions
  cartoon-actions.ts
  category-actions.ts
  video-actions.ts
  submission-actions.ts
  tag-actions.ts
/messages
  ar.json
  en.json
/types
  index.ts
/supabase
  migrations/
  seed.sql
```

**Configuration files to create:**
- `next.config.js` — with next-intl plugin, Supabase image domain
- `tailwind.config.ts` — dark mode class strategy, custom colors, RTL logical props
- `.env.local.example` — all required env vars documented
- `middleware.ts` — next-intl locale routing + /admin auth guard
- `i18n.ts` — next-intl config with locales: ['ar', 'en'], defaultLocale: 'ar'

**Color palette (dark theme):**
- Background: #0a0a0a
- Card background: #1a1a1a
- Card hover: #222222
- Border: #2a2a2a
- Accent / gold: #c8a96e
- Text primary: #f0f0f0
- Text muted: #888888

**Environment variables (.env.local.example):**
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Do not implement page content yet — create the full scaffold, all config files, and empty page/layout shells with correct imports and TypeScript types.
```

---

## PROMPT 2 — Supabase Schema & Database Layer

```
Set up the complete Supabase database schema and query layer for the Naji Al-Ali archive.

**1. Create `/supabase/migrations/001_initial_schema.sql`:**

```sql
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

-- Full-text search vector update function
CREATE OR REPLACE FUNCTION update_cartoon_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('arabic', COALESCE(NEW.title_ar, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.title_en, '')), 'A') ||
    setweight(to_tsvector('arabic', COALESCE(NEW.description_ar, '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(NEW.description_en, '')), 'B');
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

CREATE TRIGGER set_updated_at BEFORE UPDATE ON cartoons FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON videos FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE cartoons ENABLE ROW LEVEL SECURITY;
ALTER TABLE cartoon_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE cartoon_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- Public read policies (published content only)
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

-- Public can submit (insert only)
CREATE POLICY "public_insert_submissions" ON submissions FOR INSERT WITH CHECK (true);
```

**2. Update `/types/index.ts`** with complete TypeScript types:
- `Category`, `Cartoon`, `Tag`, `Video`, `Submission`
- `CartoonWithRelations` (cartoon + categories[] + tags[])
- `CategoryWithCount` (category + cartoon_count: number)
- `SearchResult` ({ cartoons: Cartoon[], categories: Category[] })
- `Locale = 'ar' | 'en'`
- `SortOrder = 'newest' | 'oldest'`
- `SubmissionStatus = 'pending' | 'reviewed' | 'rejected'`

**3. Create `/lib/supabase.ts`** — browser client with createBrowserClient

**4. Create `/lib/supabase-server.ts`** — server client with createServerClient using cookies

**5. Create `/lib/database.ts`** with typed query functions:
- `getCategories()` → CategoryWithCount[]
- `getCategoryBySlug(slug: string)` → Category | null
- `getCartoonsByCategory(categoryId: string | 'all', options: { sort: SortOrder, page: number, limit: number })` → { cartoons: Cartoon[], total: number }
- `getCartoonById(id: string)` → CartoonWithRelations | null
- `getRelatedCartoons(cartoonId: string, categoryIds: string[], tagIds: string[], limit = 6)` → Cartoon[]
- `searchCartoons(query: string)` → SearchResult
- `getVideos()` → Video[]
- `getAllCartoons(options)` → { cartoons: Cartoon[], total: number }
```

---

## PROMPT 3 — Global Layout, Navigation & Design System

```
Build the global layout, navigation, and design system.

**Design requirements:**
- Full dark mode: bg #0a0a0a, cards #1a1a1a, borders #2a2a2a
- Arabic (RTL) by default, LTR for English — layout direction FLIPS with locale
- Netflix-inspired: image-focused, no clutter, tight grid
- Accent: warm gold #c8a96e
- Fonts: Cairo (Arabic) + Inter (English) via next/font/google

**1. Create `/messages/ar.json`** with all Arabic UI strings (nav, homepage, cartoon detail, search, forms, common labels, error messages, admin).

**2. Create `/messages/en.json`** with all English equivalents.

**3. Build `/components/layout/Navbar.tsx`:**
- Sticky, dark background (#111) with blur on scroll
- Logo: "ناجي العلي – حنظلة" text + small Handala SVG icon (simple outline figure, hands behind back)
- Nav links: Home, Categories, Videos, Send a Cartoon, About Site, About Naji, Supporters
- Language switcher: "AR | EN" pill toggle, switches locale
- Mobile: hamburger → full-screen dark drawer
- Active link: gold underline
- Logo on right (RTL), left (LTR)

**4. Build `/components/layout/Footer.tsx`:**
- Minimal: site name, tagline in Arabic, copyright "© جميع الحقوق محفوظة"
- Dark #111 background

**5. Build `/app/[locale]/layout.tsx`:**
- Apply Cairo font if locale=ar, Inter if locale=en
- Set `<html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>`
- Wrap with NextIntlClientProvider
- Include Navbar + Footer
- Background: #0a0a0a

**6. Build these shared UI components:**
- `Button.tsx` — variants: primary (gold bg), secondary (dark border), ghost (transparent), destructive (red)
- `Badge.tsx` — small pill for tags/categories, dark bg with gold text
- `LoadingSpinner.tsx` — simple spinner in gold color
- `ImageZoom.tsx` — on click: overlay with full image centered, click outside or Esc to close, smooth fade animation
- `SearchInput.tsx` — dark input, search icon, debounced onChange (400ms), clear (×) button, RTL-aware placeholder
- `Skeleton.tsx` — animated shimmer dark placeholder blocks

All components: fully typed TypeScript, RTL/LTR aware using CSS logical properties.
```

---

## PROMPT 4 — Homepage (Category Grid)

```
Build the homepage — a Netflix-style dark grid of category tiles.

Reference the screenshot in the PDF at the project root for the exact visual target.

**Page: `/app/[locale]/page.tsx`** (server component)

Layout:
1. Search bar — centered, max-width 600px
2. Category grid — fills the rest of the page

**Build `/components/categories/CategoryCard.tsx`:**
- Aspect ratio: 16:9 (use padding-bottom trick or aspect-ratio CSS)
- Background image fills the card (object-fit: cover)
- Gradient overlay: transparent → rgba(0,0,0,0.75) bottom-heavy
- Category name at bottom-start (RTL: bottom-right, LTR: bottom-left)
- Arabic name when locale=ar, English when locale=en
- Hover: scale(1.03), slightly brighter overlay — smooth 200ms transition
- Click → `/[locale]/categories/[slug]`
- Use Next.js Image with sizes for performance

**Build `/components/categories/CategoryGrid.tsx`:**
- CSS Grid, gap: 6px (tight, Netflix-style)
- Columns: 2 mobile → 3 tablet → 5 desktop
- First card: "جميع الرسومات" / "All Cartoons" → links to `/[locale]/categories/all`
  - Dark card with a grid/collage icon instead of an image

**Homepage data:**
- Fetch categories server-side with cartoon counts
- Show 25 categories max on homepage
- `loading.tsx`: grid of 25 shimmer skeleton cards

**Placeholder categories (use these 25 Arabic names):**
فلسطين، لبنان، الأنظمة العربية، المخيمات، الاحتلال، الطفل والحرب،
التطبيع، أمريكا، إسرائيل، الخليج، مصر، سوريا، الأردن، العراق،
اليمن، ليبيا، تونس، الثورات، المرأة، الفقر، الحرية، حنظلة،
الإعلام، الدين والسياسة، الوحدة العربية

For cover images, use dark dramatic photos from picsum.photos (e.g., `https://picsum.photos/seed/[category-slug]/800/450`).
```

---

## PROMPT 5 — Category Page & Cartoon Grid

```
Build the category page and cartoon card components.

**Page: `/app/[locale]/categories/[slug]/page.tsx`** (server component)

Layout:
1. Category banner — full-width, 300px tall, cover image blurred behind, category name + description overlaid
2. Controls bar — "الترتيب:" + sort toggle (Newest / Oldest as link-based controls), cartoon count
3. Cartoon grid
4. Pagination (Prev / Next)

**Build `/components/cartoons/CartoonCard.tsx`:**
- Aspect ratio 4:3
- Image fills card with object-cover
- Hover: dark overlay fades in showing:
  - Cartoon title (1-2 lines, truncated)
  - Date (if available)
  - Category badges
- Border: 1px solid #2a2a2a
- Click → `/[locale]/cartoon/[id]`
- Use Next.js Image with blur placeholder (`placeholder="blur"`, `blurDataURL` = tiny dark base64)

**Build `/components/cartoons/CartoonGrid.tsx`:**
- Grid: 2 cols mobile → 3 tablet → 4 desktop
- Gap: 8px

**Sorting:**
- URL params: `?sort=newest` (default) or `?sort=oldest`
- Pure links — no client state — bookmarkable

**Pagination:**
- 12 cartoons per page
- URL param: `?page=1`
- Show "السابق / الأحدث" buttons, disable at boundaries
- Show "الصفحة 2 من 5" / "Page 2 of 5"

**Special case: slug = "all"** → fetch all published cartoons

**404 handling:** If slug doesn't exist → call notFound()

**`loading.tsx`:** shimmer grid matching layout
**`error.tsx`:** dark error card with return home link
```

---

## PROMPT 6 — Cartoon Detail Page

```
Build the individual cartoon detail page — the most important page per the project spec.

**Page: `/app/[locale]/cartoon/[id]/page.tsx`** (server component)

Max-width container: 960px, centered.

**Layout (top to bottom):**

1. **Breadcrumb:** Home → [Category Name] → [Cartoon Title]
   - Links are functional
   - RTL-aware separator (← for RTL, → for LTR)

2. **Cartoon image:**
   - Displayed at full container width
   - Dark background behind it
   - Click → opens ImageZoom overlay (full-screen lightbox)
   - Small "🔍 تكبير" button in corner

3. **Metadata block** (below image, dark card #1a1a1a):
   - Title: large, bold
   - Date: "نُشر في ١٥ يناير ١٩٧٦" (formatted using Arabic numerals for ar locale)
   - Source: newspaper name
   - Categories: clickable gold badges → `/[locale]/categories/[slug]`
   - Tags: smaller silver badges → `/[locale]/search?q=[tag]`

4. **Description / Contextual Analysis:**
   - Shows description_ar or description_en based on locale
   - If both exist: show tabs to switch
   - If description missing: show subtle "لا يوجد وصف متاح حاليًا"

5. **Share section:**
   - "مشاركة هذا العمل" heading
   - Buttons: Copy Link, Share on X (Twitter), Share on WhatsApp
   - Use navigator.share() with fallback to clipboard copy

6. **Related Works:**
   - Section title: "أعمال ذات صلة" / "Related Works"
   - Horizontal scrollable row of up to 6 CartoonCards (smaller variant)
   - Related = query by shared tags first, fill with same category if needed

**SEO:**
- `generateMetadata({ params })` → title, description, OG image (cartoon image_url), OG locale

**View count:**
- Fire-and-forget POST to `/api/increment-view` on page mount (client component wrapper just for this)

**404:** If cartoon not found → notFound()
```

---

## PROMPT 7 — Search Page

```
Build the full-text search functionality.

**Page: `/app/[locale]/search/page.tsx`** (server component with client search input)

**Data fetching:**
Use Supabase FTS via the `searchCartoons(query)` function from `/lib/database.ts`.
Also check if query matches any category name (ar or en) → show as "Category Match" card.

**Page layout:**

1. SearchInput (pre-filled with `?q=` param) — when user types, update URL with router.replace (no full reload), refetch
2. Results summary: "٥ نتائج لـ «حنظلة»" / "5 results for «Handala»"
3. Category match card (if any): large prominent card at top with category name + cover image + "عرض الموضوع ←"
4. Cartoon results: CartoonGrid (same component, 4 cols desktop)
5. Empty state: centered message "لم يتم العثور على نتائج" with Handala SVG, search tips

**Search behavior:**
- Debounce: 400ms after last keystroke
- Minimum 2 characters before searching
- Show LoadingSpinner during fetch
- URL stays in sync (shareable search URLs)

**Arabic search:**
- The tsvector uses 'arabic' config — handles Arabic morphology
- Also search category name_ar/name_en with ILIKE as fallback for short queries

**`/components/ui/SearchInput.tsx`** — ensure:
- `dir="auto"` on the input to handle Arabic/English mixed input
- Clear button (×) resets query and URL
- Escape key clears input
```

---

## PROMPT 8 — Videos, About Pages & Send a Cartoon

```
Build all remaining public pages.

---

### Videos Page — `/app/[locale]/videos/page.tsx`

- Page title: "فيديوهات" / "Videos"
- Responsive grid (3 cols desktop, 2 tablet, 1 mobile)

**`/components/videos/VideoCard.tsx`:**
- Thumbnail: `https://img.youtube.com/vi/[youtube_id]/maxresdefault.jpg`
- Red play button overlay (centered SVG circle + triangle)
- Title below
- Hover: overlay brightens slightly
- Click → opens VideoModal (NOT new tab)

**`/components/videos/VideoModal.tsx`:**
- Full-screen dark overlay (backdrop-blur)
- YouTube iframe: `https://www.youtube.com/embed/[id]?autoplay=1`
- Responsive 16:9 container
- × close button (top-right)
- Click backdrop or press Escape to close

---

### Send a Cartoon — `/app/[locale]/send-cartoon/page.tsx`

Contact/submission form. Submissions go to the `submissions` table for admin review — nothing is auto-published.

**Form (react-hook-form + zod):**
- Name* (text)
- Email* (email)
- Message (textarea, optional)
- Image upload (optional, max 5MB, jpg/png/webp) — upload to Supabase Storage `submissions` bucket
- Honeypot hidden field (bot trap)
- Submit button

**On submit:**
- Client-side validation (Zod schema)
- POST to `/api/submit-cartoon`
- Success: green Arabic message "شكرًا لمشاركتك! سيتم مراجعة رسالتك قريبًا."
- Error: red Arabic message "حدث خطأ. يرجى المحاولة مجددًا."

---

### Static Pages (all with dark layout, max-width 720px, centered):

**About Site — `/app/[locale]/about-site/page.tsx`:**
- Mission statement (Arabic + English placeholder text)
- Why this archive matters

**About Naji — `/app/[locale]/about-naji/page.tsx`:**
- Biography section with timeline (1937 born → 1987 assassinated)
- Placeholder portrait image area

**Supporters — `/app/[locale]/supporters/page.tsx`:**
- Grid of supporter name cards (placeholder)
- Thank you message

All static pages: `generateMetadata()` for SEO.
```

---

## PROMPT 9 — Admin Dashboard

```
Build the complete admin dashboard at `/admin` (no locale prefix, English UI).

**Auth — `/app/admin/login/page.tsx`:**
- Email + password form (Supabase Auth)
- Dark styled form, centered card
- On success → redirect to /admin
- On error → show "Invalid credentials" in red

**`/app/admin/layout.tsx`:**
- Server-side: check Supabase session, redirect to /admin/login if unauthenticated
- Dark sidebar (#141414) with nav links:
  - Dashboard (/admin)
  - Cartoons (/admin/cartoons)
  - Categories (/admin/categories)
  - Videos (/admin/videos)
  - Submissions (/admin/submissions)
  - Tags (/admin/tags)
- Top bar: "Admin Panel" title + "View Site" link + Logout button
- Active link highlighted (gold left border)

---

### Dashboard — `/app/admin/page.tsx`
Stats cards in a row:
- Total Cartoons (+ published count)
- Total Categories
- Total Videos
- Pending Submissions (gold badge if > 0, red if > 5)
- Total Views

---

### Cartoons — `/app/admin/cartoons/`

**List page:**
- Table: thumbnail (40px) | title_ar | categories | date | views | published toggle | Edit | Delete
- Search bar (filter by title)
- Filter by category (dropdown)
- Filter by status (all / published / draft)
- Pagination (20 per page)
- "Add New" button → /admin/cartoons/new

**New/Edit form:**
- title_ar (required)
- title_en
- description_ar (large textarea)
- description_en (large textarea)
- Image upload (drag-drop) → Supabase Storage `cartoons` bucket → show preview
- High-res image upload (optional)
- publication_date (date picker)
- source (text)
- Categories: multi-select checkboxes (all categories listed)
- Tags: tag input with autocomplete from existing tags
- is_published toggle
- Save + Cancel buttons

On save: upsert cartoon → update cartoon_categories → update cartoon_tags

---

### Categories — `/app/admin/categories/`

**List:** cover image | name_ar | name_en | cartoon_count | display_order | Published | Edit | Delete
- Reorder with ↑↓ buttons (updates display_order)
- "Add New" button

**New/Edit form:**
- name_ar (required), name_en (required)
- slug (auto-generated from name_en, editable)
- description_ar, description_en
- Cover image upload → `categories` bucket
- display_order (number)
- is_published toggle

---

### Videos — `/app/admin/videos/`
Fields: title_ar, title_en, description_ar, description_en, youtube_url (auto-extract ID + show preview thumbnail), display_order, is_published.

---

### Submissions — `/app/admin/submissions/`
Table: name | email | submitted | has image | status badge | View | Update Status
- Filter by status (pending / reviewed / rejected)
- "View" → modal with full details: name, email, message, image preview
- Status dropdown in modal + admin_notes textarea + Save button

---

### Tags — `/app/admin/tags/`
Table: name_ar | name_en | slug | usage count | Delete
- "Add Tag" inline form at top

---

**Shared admin components:**
- `AdminTable.tsx` — generic sortable table with pagination
- `ImageUpload.tsx` — drag-drop zone + preview + delete, uploads to Supabase Storage
- `TagInput.tsx` — type to add tags, autocomplete from existing, × to remove
- `ConfirmModal.tsx` — "Are you sure? This cannot be undone." with Confirm/Cancel
- `StatusBadge.tsx` — published (green) / draft (gray) / pending (yellow) / rejected (red)

Use react-hook-form + Zod for all forms.
```

---

## PROMPT 10 — API Routes & Server Actions

```
Create all server actions and API routes.

**1. `/app/api/search/route.ts`** (GET):
- Params: `?q=` and `?locale=`
- Runs Supabase FTS query + category name match
- Returns `{ cartoons: Cartoon[], categories: Category[] }`
- Cache-Control: public, max-age=60

**2. `/app/api/submit-cartoon/route.ts`** (POST):
- Parse JSON body: name, email, message, imageUrl (already uploaded), honeypot
- Validate with Zod
- Reject if honeypot is filled
- Insert into `submissions` table (status: 'pending')
- Return `{ success: true }` or `{ error: '...' }`

**3. `/app/api/increment-view/route.ts`** (POST):
- Body: `{ cartoonId: string }`
- Increment view_count using Supabase RPC or UPDATE
- Simple dedup: check a `view_logs` table (or use a cookie) to avoid counting same visitor twice in 24h
- No auth required

**4. `/lib/actions/cartoon-actions.ts`** (server actions):
- `createCartoon(data)` — auth check, validate, insert cartoon, set cartoon_categories, set cartoon_tags
- `updateCartoon(id, data)` — auth check, upsert, update junctions
- `deleteCartoon(id)` — auth check, delete image from storage, delete row
- `togglePublished(id, current)` — flip is_published

**5. `/lib/actions/category-actions.ts`:**
- `createCategory(data)`
- `updateCategory(id, data)`
- `deleteCategory(id)` — delete cover from storage, delete row
- `reorderCategories(items: { id: string, order: number }[])` — bulk update display_order

**6. `/lib/actions/video-actions.ts`:**
- `createVideo(data)` — extract youtube_id from URL
- `updateVideo(id, data)`
- `deleteVideo(id)`

**7. `/lib/actions/submission-actions.ts`:**
- `updateSubmission(id, { status, admin_notes })`

**8. `/lib/actions/tag-actions.ts`:**
- `createTag({ name_ar, name_en, slug })`
- `deleteTag(id)` — only if no cartoons use it

**9. `/lib/storage.ts`:**
- `uploadToStorage(file: File, bucket: string, path: string)` → returns public URL
- `deleteFromStorage(bucket: string, path: string)`
- `getPublicUrl(bucket: string, path: string)` → string

All server actions must:
- Call `requireAdmin()` (checks Supabase session, throws if not authenticated)
- Validate with Zod
- Return `{ success: boolean; error?: string; data?: unknown }`
- Handle and log errors
```

---

## PROMPT 11 — Performance, SEO & Final Polish

```
Apply performance, SEO, accessibility, and final UI polish across the entire app.

**1. SEO:**
- Root layout metadata: title "ناجي العلي – حنظلة | أرشيف رقمي", description in Arabic and English
- OG image: default dark site image with logo
- `/app/sitemap.ts` — dynamic sitemap: all published cartoon URLs + category URLs
- `/app/robots.ts` — allow all, disallow /admin
- JSON-LD on cartoon pages: `ImageObject` schema with name, description, contentUrl, dateCreated
- `<link rel="canonical">` on all pages
- Arabic page titles use Arabic numerals where relevant

**2. Image optimization:**
- All images: Next.js `<Image>` with proper `sizes` attribute
- Category cards: `sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"`
- Cartoon cards: `sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"`
- Cartoon detail: `sizes="(max-width: 960px) 100vw, 960px"`
- `loading="lazy"` for below-fold images, `priority` for above-fold
- `placeholder="blur"` with tiny base64 dark placeholder for all cards

**3. Fonts:**
- Cairo + Inter via `next/font/google` in root layout
- `display: 'swap'`
- Subset: Arabic for Cairo, Latin for Inter

**4. Loading states — add `loading.tsx` to every route:**
- Category page: wide banner skeleton + grid of 12 shimmer cards
- Cartoon detail: image skeleton + text line skeletons
- Search: spinner centered

**5. Error states — add `error.tsx` to every route:**
- Dark card, gold icon, Arabic + English error message
- "العودة للرئيسية" button

**6. Custom 404 — `/app/not-found.tsx`:**
- Centered Handala SVG (simple line art)
- "٤٠٤ — الصفحة غير موجودة"
- Return home button

**7. Accessibility:**
- All `<Image>` have meaningful Arabic `alt` text
- All icon buttons have `aria-label`
- Focus styles: gold 2px outline, visible on all focusable elements
- Skip to main content link at top of page
- `<html lang>` attribute correct

**8. RTL/LTR audit — fix all components:**
- Replace `ml-`, `mr-`, `pl-`, `pr-` with logical equivalents: `ms-`, `me-`, `ps-`, `pe-`
- Chevron/arrow icons: flip horizontally in RTL using `rtl:rotate-180`
- Text alignment: `text-start` instead of `text-left`
- Flexbox direction: verify no hardcoded `flex-row` that breaks in RTL

**9. Vercel config:**
- `vercel.json`: build command, framework: nextjs
- `.env.local.example`: all vars documented with descriptions

**10. `README.md`** — complete setup guide:
1. Clone + install dependencies
2. Create Supabase project
3. Run migration SQL in Supabase SQL editor
4. Create storage buckets: `cartoons`, `categories`, `submissions` (all public read)
5. Create admin user in Supabase Auth
6. Copy .env.local.example → .env.local, fill values
7. `npm run dev`
8. Deployment: push to GitHub → Vercel import → add env vars → deploy
9. Custom domain: add najicartoon.com in Vercel → update GoDaddy DNS to Vercel nameservers
```

---

## PROMPT 12 — Seed Data & End-to-End Verification

```
Final step: create seed data and verify the complete application works end-to-end.

**1. Create `/supabase/seed.sql`** with realistic placeholder data:

25 categories with Arabic and English names, slugs, placeholder picsum.photos cover images:
- فلسطين / Palestine (slug: palestine)
- لبنان / Lebanon (slug: lebanon)
- الأنظمة العربية / Arab Regimes (slug: arab-regimes)
- المخيمات / Refugee Camps (slug: camps)
- الاحتلال / Occupation (slug: occupation)
- الطفل والحرب / Children and War (slug: children-war)
- التطبيع / Normalization (slug: normalization)
- أمريكا / America (slug: america)
- إسرائيل / Israel (slug: israel)
- الخليج / Gulf (slug: gulf)
- مصر / Egypt (slug: egypt)
- سوريا / Syria (slug: syria)
- الأردن / Jordan (slug: jordan)
- العراق / Iraq (slug: iraq)
- اليمن / Yemen (slug: yemen)
- ليبيا / Libya (slug: libya)
- تونس / Tunisia (slug: tunisia)
- الثورات / Revolutions (slug: revolutions)
- المرأة / Women (slug: women)
- الفقر / Poverty (slug: poverty)
- الحرية / Freedom (slug: freedom)
- حنظلة / Handala (slug: handala)
- الإعلام / Media (slug: media)
- الدين والسياسة / Religion and Politics (slug: religion-politics)
- الوحدة العربية / Arab Unity (slug: arab-unity)

15 tags: حنظلة، الطفولة، المقاومة، العودة، الاحتلال، الصهيونية، الوحدة، الخيانة، الفقر، المرأة، الأنظمة، أمريكا، السلام الكاذب، الثورة، الهوية

60 placeholder cartoons:
- Spread across categories
- Arabic titles and 2-3 sentence contextual descriptions
- Dates between 1973-01-01 and 1987-07-01
- Sources: 'الأسبوع العربي'، 'القبس'، 'السفير'، 'الديار'، 'النهار'
- image_url: picsum.photos with varied seeds
- Multiple cartoon_categories and cartoon_tags per cartoon

6 placeholder videos with real YouTube IDs (search for public "ناجي العلي وثائقي" documentaries)

**2. Create `/scripts/setup.md`** — instructions to run the seed

**3. Final integration verification — go through each flow and fix any broken connections:**
- [ ] Homepage loads category grid (server fetch)
- [ ] Clicking category → category page shows cartoons
- [ ] Sorting (newest/oldest) works via URL params
- [ ] Pagination works
- [ ] Clicking cartoon → detail page loads with all fields
- [ ] Image zoom opens and closes
- [ ] Related works section shows relevant cartoons
- [ ] Share buttons work (copy link at minimum)
- [ ] Search from homepage navigates to /search with results
- [ ] Search page live-updates as user types
- [ ] Videos page shows grid + modal plays on click
- [ ] Send a Cartoon form submits and shows success message
- [ ] Language toggle: AR ↔ EN flips layout direction + content language
- [ ] /admin/login authenticates correctly
- [ ] Admin CRUD: create cartoon with image upload → appears on site
- [ ] Admin: edit cartoon → changes reflected on site
- [ ] Admin: delete cartoon → removed from site
- [ ] Admin: create/reorder categories → homepage reflects order
- [ ] Admin: view submissions from send-a-cartoon form
- [ ] Mobile responsive: test all pages at 375px width
- [ ] RTL correctness: no misaligned elements in Arabic mode

Fix all issues found during this verification pass.
```

---

## Notes for Claude Code

- **Always read the PDF spec** at the project root — it contains the reference screenshot and full requirements in Arabic.
- **Commit after each prompt** with a meaningful git message.
- **The admin at `/admin`** has no locale prefix — it's English only for simplicity.
- **Never disable Supabase RLS** — all data access must go through properly scoped clients.
- **Test with actual Arabic strings** — not lorem ipsum — to catch RTL layout issues early.
- **Supabase Storage buckets** must be created manually in the Supabase dashboard with public read access policies before uploads work.
- **YouTube ID extraction** — parse from URL formats: `youtube.com/watch?v=ID`, `youtu.be/ID`, `youtube.com/embed/ID`.
- **next-intl** requires `[locale]` as the first segment for all public routes — the admin section intentionally bypasses this.
