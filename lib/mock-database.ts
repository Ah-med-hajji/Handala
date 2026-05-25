import type { Category, CategoryWithCount, Cartoon, CartoonWithRelations, Tag, Video, SearchResult } from '@/types';
import type { SortOrder } from '@/types';
import { MOCK_CATEGORIES, MOCK_TAGS, MOCK_CARTOONS, MOCK_VIDEOS, buildCartoonWithRelations } from './mock-data';

// ─── Categories ────────────────────────────────────────────────────────────────

export async function getCategories(): Promise<CategoryWithCount[]> {
  return MOCK_CATEGORIES.filter(c => c.is_published).map(cat => ({
    ...cat,
    cartoon_count: MOCK_CARTOONS.filter(c => c.is_published && c.categoryIds.includes(cat.id)).length,
  }));
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  return MOCK_CATEGORIES.find(c => c.slug === slug && c.is_published) ?? null;
}

// ─── Cartoons ─────────────────────────────────────────────────────────────────

function sortCartoons(cartoons: typeof MOCK_CARTOONS, sort: SortOrder) {
  return [...cartoons].sort((a, b) => {
    const da = a.publication_date ?? a.created_at;
    const db = b.publication_date ?? b.created_at;
    return sort === 'newest' ? db.localeCompare(da) : da.localeCompare(db);
  });
}

export async function getCartoonsByCategory(
  categoryId: string | 'all',
  options: { sort: SortOrder; page: number; limit: number }
): Promise<{ cartoons: Cartoon[]; total: number }> {
  const { sort, page, limit } = options;
  let pool = MOCK_CARTOONS.filter(c => c.is_published);
  if (categoryId !== 'all') pool = pool.filter(c => c.categoryIds.includes(categoryId));
  const sorted = sortCartoons(pool, sort);
  const total = sorted.length;
  const cartoons = sorted.slice((page - 1) * limit, page * limit);
  return { cartoons, total };
}

export async function getAllCartoons(
  options: { sort: SortOrder; page: number; limit: number }
): Promise<{ cartoons: Cartoon[]; total: number }> {
  return getCartoonsByCategory('all', options);
}

export async function getCartoonById(id: string): Promise<CartoonWithRelations | null> {
  const found = MOCK_CARTOONS.find(c => c.id === id && c.is_published);
  return found ? buildCartoonWithRelations(found) : null;
}

export async function getRelatedCartoons(
  cartoonId: string,
  categoryIds: string[],
  tagIds: string[],
  limit = 6
): Promise<Cartoon[]> {
  return MOCK_CARTOONS
    .filter(c => c.is_published && c.id !== cartoonId)
    .filter(c => c.categoryIds.some(id => categoryIds.includes(id)) || c.tagIds.some(id => tagIds.includes(id)))
    .slice(0, limit);
}

// ─── Search ───────────────────────────────────────────────────────────────────

export async function searchCartoons(query: string): Promise<SearchResult> {
  const q = query.toLowerCase();
  const cartoons = MOCK_CARTOONS.filter(c =>
    c.is_published && (
      c.title_ar.toLowerCase().includes(q) ||
      (c.title_en?.toLowerCase().includes(q) ?? false) ||
      (c.description_ar?.toLowerCase().includes(q) ?? false) ||
      (c.description_en?.toLowerCase().includes(q) ?? false)
    )
  );
  const categories = MOCK_CATEGORIES.filter(c =>
    c.is_published && (
      c.name_ar.toLowerCase().includes(q) ||
      c.name_en.toLowerCase().includes(q) ||
      (c.description_ar?.toLowerCase().includes(q) ?? false) ||
      (c.description_en?.toLowerCase().includes(q) ?? false)
    )
  );
  return { cartoons, categories };
}

// ─── Videos ───────────────────────────────────────────────────────────────────

export async function getVideos(): Promise<Video[]> {
  return MOCK_VIDEOS.filter(v => v.is_published).sort((a, b) => a.display_order - b.display_order);
}

// ─── Tags (admin read) ────────────────────────────────────────────────────────

export async function getTags(): Promise<Tag[]> {
  return MOCK_TAGS;
}
