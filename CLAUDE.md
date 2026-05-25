# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # start dev server at localhost:3000
npm run build    # production build (also runs type-check)
npm run lint     # ESLint
```

No test suite is configured.

## Mock mode (zero-dependency local preview)

Set `NEXT_PUBLIC_USE_MOCK_DATA=true` in `.env.local` (already set by default). This bypasses Supabase entirely:

- All data comes from in-memory arrays in `lib/mock-data.ts` (25 categories, 15 tags, 60 cartoons, 6 videos, 5 submissions)
- Admin login: any email + password **`admin123`** → sets `mock-admin-session` cookie via `/api/mock-login`
- Image uploads return a `picsum.photos` URL; Supabase Storage is never called
- All server actions (create/update/delete) return `{ success: true }` immediately
- A yellow "⚠️ Preview Mode" banner appears in the admin layout

When `NEXT_PUBLIC_USE_MOCK_DATA=false`, all three Supabase env vars are required:
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
```

## Data layer architecture

```
lib/data.ts          ← always import from here in pages/components
  ├── lib/database.ts         (real: Supabase anon client)
  └── lib/mock-database.ts    (mock: filters/sorts MOCK_* arrays)
```

`lib/data.ts` selects the implementation at module-load time based on `NEXT_PUBLIC_USE_MOCK_DATA`. Both modules export the same 8 functions with identical signatures:

```typescript
getCategories()
getCategoryBySlug(slug)
getCartoonsByCategory(categoryId | 'all', { sort, page, limit })
getAllCartoons({ sort, page, limit })
getCartoonById(id)
getRelatedCartoons(cartoonId, categoryIds, tagIds, limit)
searchCartoons(query)
getVideos()
```

Admin pages that need `tags` for forms import directly from `lib/mock-data.ts` / `createServiceClient()` since `getTags()` is not part of the public data API.

## Routing structure

```
app/
  [locale]/           ← public site (ar | en), defaultLocale=ar
    page.tsx          ← home (cartoon grid)
    categories/[slug] ← cartoons filtered by category
    cartoon/[id]      ← single cartoon detail
    videos/           ← YouTube video gallery
    search/           ← search results (uses /api/search)
    send-cartoon/     ← public submission form
    about-naji/
    about-site/
    supporters/
  admin/              ← no locale prefix
    login/            ← Supabase auth (real) or password form (mock)
    page.tsx          ← dashboard with counts
    cartoons/         ← CRUD, shared CartoonFormClient.tsx
    categories/       ← CRUD
    videos/           ← CRUD
    tags/             ← list + inline create/delete
    submissions/      ← review queue
  api/
    search/           ← GET ?q= → calls searchCartoons()
    increment-view/   ← POST → increments view_count (no-op in mock)
    submit-cartoon/   ← POST → public submission endpoint (no-op in mock)
    mock-login/       ← POST → sets mock-admin-session cookie
    upload/           ← POST → calls lib/storage.ts uploadToStorage()
```

Locale routing is handled by `next-intl` middleware. `/` redirects to `/ar`. All `app/[locale]/**` pages receive a `locale` param and use `useTranslations()` / `getTranslations()` for i18n strings from `messages/ar.json` and `messages/en.json`.

## Auth

- **Real mode**: Supabase Auth session checked in `middleware.ts` and `lib/auth.ts → requireAdmin()`. Admin pages call `requireAdmin()` at the top.
- **Mock mode**: `middleware.ts` checks for `mock-admin-session` cookie; `requireAdmin()` checks the same cookie. No Supabase calls are made.

## Admin pattern

Each admin resource follows: server page (`page.tsx`) fetches data → passes to `*Client.tsx` (`'use client'`) for interactive table/form. Mutations go through `lib/actions/*-actions.ts` (Server Actions with `'use server'`). In mock mode every action returns `{ success: true }` at the top without touching Supabase.

## Types

All shared types live in `types/index.ts`. Key distinction:

- `Cartoon` — flat DB row
- `CartoonWithRelations extends Cartoon` — adds `categories: Category[]` and `tags: Tag[]`
- `MockCartoon extends Cartoon` — adds `categoryIds: string[]` and `tagIds: string[]` (internal to mock layer only)

`buildCartoonWithRelations(c: MockCartoon)` in `lib/mock-data.ts` converts between these.

## Design system

Dark theme only. Tailwind custom tokens (defined in `tailwind.config.ts`):

| Token | Value |
|-------|-------|
| `background` | `#0a0a0a` |
| `card` | `#1a1a1a` |
| `card-hover` | `#222222` |
| `border` | `#2a2a2a` |
| `accent` | `#c8a96e` (gold) |
| `text-primary` | `#f0f0f0` |
| `text-muted` | `#888888` |

Fonts: `font-arabic` (Cairo) for Arabic text, `font-latin` (Inter) for English. The site is RTL-first (Arabic default).

## Supabase schema (real mode)

Tables: `cartoons`, `categories`, `tags`, `videos`, `submissions`, `cartoon_categories` (join), `cartoon_tags` (join). Storage buckets: `cartoons` (images), `categories` (cover images). Admin access uses the service-role client (`lib/supabase-server.ts → createServiceClient()`); public pages use the anon client (`createClient()`).
