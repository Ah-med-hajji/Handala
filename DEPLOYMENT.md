# Deployment Guide — Handala Digital Archive

## Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) account (free tier works)
- A [Vercel](https://vercel.com) account (free tier works)
- The [Vercel CLI](https://vercel.com/docs/cli): `npm i -g vercel`
- The [GitHub CLI](https://cli.github.com): `gh auth login`

---

## 1. Create the Supabase Project

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard) → **New project**
2. Choose a name (e.g. `handala-archive`), set a strong DB password, pick the closest region
3. Wait for the project to finish provisioning (~60 s)
4. Go to **Project Settings → API** and note:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`

---

## 2. Run the Database Schema

1. In your Supabase project, open **SQL Editor → New query**
2. Paste and run the following SQL:

```sql
-- ─── Categories ────────────────────────────────────────────────────────────
create table categories (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique,
  name_ar      text not null,
  name_en      text,
  description_ar text,
  description_en text,
  cover_image_url text,
  is_published boolean not null default true,
  display_order integer not null default 0,
  created_at   timestamptz not null default now()
);

-- ─── Tags ──────────────────────────────────────────────────────────────────
create table tags (
  id         uuid primary key default gen_random_uuid(),
  slug       text not null unique,
  name_ar    text not null,
  name_en    text,
  created_at timestamptz not null default now()
);

-- ─── Cartoons ──────────────────────────────────────────────────────────────
create table cartoons (
  id                  uuid primary key default gen_random_uuid(),
  title_ar            text not null,
  title_en            text,
  description_ar      text,
  description_en      text,
  image_url           text not null,
  image_high_res_url  text,
  publication_date    date,
  source              text,
  is_published        boolean not null default true,
  view_count          integer not null default 0,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- ─── Join tables ───────────────────────────────────────────────────────────
create table cartoon_categories (
  cartoon_id  uuid references cartoons(id) on delete cascade,
  category_id uuid references categories(id) on delete cascade,
  primary key (cartoon_id, category_id)
);

create table cartoon_tags (
  cartoon_id uuid references cartoons(id) on delete cascade,
  tag_id     uuid references tags(id) on delete cascade,
  primary key (cartoon_id, tag_id)
);

-- ─── Videos ────────────────────────────────────────────────────────────────
create table videos (
  id            uuid primary key default gen_random_uuid(),
  title_ar      text not null,
  title_en      text,
  youtube_url   text not null,
  youtube_id    text not null,
  thumbnail_url text,
  is_published  boolean not null default true,
  display_order integer not null default 0,
  created_at    timestamptz not null default now()
);

-- ─── Submissions ───────────────────────────────────────────────────────────
create table submissions (
  id            uuid primary key default gen_random_uuid(),
  submitter_name text,
  submitter_email text,
  description   text not null,
  image_url     text,
  status        text not null default 'pending' check (status in ('pending','reviewed','approved','rejected')),
  admin_notes   text,
  created_at    timestamptz not null default now()
);

-- ─── Site content ──────────────────────────────────────────────────────────
create table site_content (
  id         uuid primary key default gen_random_uuid(),
  key        text not null unique,
  title_ar   text not null,
  title_en   text,
  content_ar text not null,
  content_en text,
  updated_at timestamptz not null default now()
);

-- Seed default content blocks
insert into site_content (key, title_ar, title_en, content_ar, content_en) values
  ('about_naji', 'عن ناجي العلي', 'About Naji Al-Ali',
   'ناجي العلي (1937-1987) رسام كاريكاتير فلسطيني وُلد في قرية الشجرة في الجليل.',
   'Naji Al-Ali (1937–1987) was a Palestinian cartoonist born in the village of Al-Shajara in Galilee.'),
  ('about_site', 'عن الموقع', 'About This Site',
   'هذا الموقع أرشيف رقمي يضم رسومات ناجي العلي.',
   'This site is a digital archive of Naji Al-Ali''s cartoons.');

-- ─── Supporters ────────────────────────────────────────────────────────────
create table supporters (
  id              uuid primary key default gen_random_uuid(),
  name_ar         text not null,
  name_en         text,
  url             text,
  logo_url        text,
  description_ar  text,
  description_en  text,
  display_order   integer not null default 0,
  is_published    boolean not null default true,
  created_at      timestamptz not null default now()
);

-- ─── Updated-at trigger ────────────────────────────────────────────────────
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

create trigger cartoons_updated_at before update on cartoons
  for each row execute function update_updated_at();
create trigger site_content_updated_at before update on site_content
  for each row execute function update_updated_at();

-- ─── Row Level Security ────────────────────────────────────────────────────
alter table categories     enable row level security;
alter table tags            enable row level security;
alter table cartoons        enable row level security;
alter table cartoon_categories enable row level security;
alter table cartoon_tags    enable row level security;
alter table videos          enable row level security;
alter table submissions     enable row level security;
alter table site_content    enable row level security;
alter table supporters      enable row level security;

-- Public read access for published content
create policy "public read categories"    on categories     for select using (is_published = true);
create policy "public read tags"          on tags            for select using (true);
create policy "public read cartoons"      on cartoons        for select using (is_published = true);
create policy "public read cartoon_cats"  on cartoon_categories for select using (true);
create policy "public read cartoon_tags"  on cartoon_tags    for select using (true);
create policy "public read videos"        on videos          for select using (is_published = true);
create policy "public read site_content"  on site_content    for select using (true);
create policy "public read supporters"    on supporters      for select using (is_published = true);

-- Public insert for submissions (the "send a cartoon" form)
create policy "public submit" on submissions for insert with check (true);

-- Service role has full access (bypasses RLS automatically)

-- ─── View count increment (anon-safe RPC) ──────────────────────────────────
create or replace function increment_view_count(cartoon_id uuid)
returns void language sql security definer as $$
  update cartoons set view_count = view_count + 1 where id = cartoon_id;
$$;
```

---

## 3. Set Up Storage Buckets

In Supabase → **Storage → New bucket**:

| Bucket name  | Public | Purpose                   |
|-------------|--------|---------------------------|
| `cartoons`  | ✅ Yes | Cartoon images            |
| `categories`| ✅ Yes | Category cover images     |

For each bucket, add this storage policy (so the admin service role can upload):
- Supabase service role has full access by default — no extra policy needed.

---

## 4. Create an Admin User

In Supabase → **Authentication → Users → Invite user**, enter your admin email.
The invited user can then set a password via the email link.

Alternatively, create one programmatically:

```sql
-- Run in SQL editor (replace with your email and a strong password)
select supabase_admin.create_user(
  '{"email": "admin@example.com", "password": "YourStrongPassword123!", "email_confirm": true}'::jsonb
);
```

---

## 5. Configure Environment Variables

Create `.env.local` at the project root:

```bash
NEXT_PUBLIC_USE_MOCK_DATA=false

NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
```

Test locally:

```bash
npm run dev        # http://localhost:3000
npm run build      # verify no type errors
npm test           # 69 tests should pass
```

---

## 6. Push to GitHub

```bash
cd /path/to/handhala

git init
git add .
git commit -m "feat: Handala digital archive — initial release"

# Create repo on GitHub (requires GitHub CLI)
gh repo create Handala --public --source=. --remote=origin --push
```

---

## 7. Deploy to Vercel

### Option A — Vercel Dashboard (recommended for first deploy)

1. Go to [https://vercel.com/new](https://vercel.com/new)
2. Import the `Handala` GitHub repository
3. Framework preset: **Next.js** (auto-detected)
4. Add environment variables (from step 5) under **Environment Variables**:
   - `NEXT_PUBLIC_USE_MOCK_DATA` = `false`
   - `NEXT_PUBLIC_SUPABASE_URL` = your URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your anon key
   - `SUPABASE_SERVICE_ROLE_KEY` = your service role key
5. Click **Deploy**

### Option B — Vercel CLI

```bash
npm i -g vercel
vercel login

vercel                  # follow prompts, link to your team/account
vercel env add NEXT_PUBLIC_USE_MOCK_DATA
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel --prod           # production deploy
```

---

## 8. Automate Deployment on Push to `main`

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npx vercel --token ${{ secrets.VERCEL_TOKEN }} --prod --yes
        env:
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
```

Add these secrets in **GitHub repo → Settings → Secrets and variables → Actions**:

| Secret | Where to find |
|--------|--------------|
| `VERCEL_TOKEN` | Vercel → Account Settings → Tokens → Create |
| `VERCEL_ORG_ID` | Run `vercel env ls` or `.vercel/project.json` after first deploy |
| `VERCEL_PROJECT_ID` | Same `.vercel/project.json` file |

---

## 9. Custom Domain (optional)

In Vercel → your project → **Settings → Domains**, add your domain and follow the DNS instructions.

---

## 10. Go-Live Checklist

- [ ] All three Supabase env vars set in Vercel production environment
- [ ] `NEXT_PUBLIC_USE_MOCK_DATA=false` in Vercel (not `true`)
- [ ] SQL schema applied and default `site_content` rows seeded
- [ ] Storage buckets `cartoons` and `categories` created and public
- [ ] Admin user created in Supabase Auth
- [ ] Verify `/admin/login` → can log in → dashboard shows real data
- [ ] Upload at least one cartoon image via the admin panel
- [ ] Test the public site: home, category pages, single cartoon, search
- [ ] Test the "Send a Cartoon" form — submission appears in `/admin/submissions`
- [ ] `npm run build` exits with code 0 (no TypeScript errors)
- [ ] `npm test` — all 69 tests pass
- [ ] GitHub Actions CI running green on the `main` branch

---

## Switching Back to Mock Mode

Set `NEXT_PUBLIC_USE_MOCK_DATA=true` in `.env.local` and restart the dev server.
Admin password: any email + `admin123`.
No Supabase connection is made — all data is served from in-memory arrays.
