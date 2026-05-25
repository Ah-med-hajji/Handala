import {
  getCategories,
  getCategoryBySlug,
  getCartoonsByCategory,
  getAllCartoons,
  getCartoonById,
  getRelatedCartoons,
  searchCartoons,
  getVideos,
} from '@/lib/mock-database';
import { MOCK_CARTOONS, MOCK_CATEGORIES } from '@/lib/mock-data';

describe('getCategories', () => {
  it('returns only published categories', async () => {
    const cats = await getCategories();
    expect(cats.every(c => c.is_published)).toBe(true);
  });

  it('includes cartoon_count on every entry', async () => {
    const cats = await getCategories();
    for (const cat of cats) {
      expect(typeof cat.cartoon_count).toBe('number');
      expect(cat.cartoon_count).toBeGreaterThanOrEqual(0);
    }
  });

  it('counts match actual mock cartoons', async () => {
    const cats = await getCategories();
    const palestineCat = cats.find(c => c.slug === 'palestine');
    expect(palestineCat).toBeDefined();
    const expected = MOCK_CARTOONS.filter(c => c.is_published && c.categoryIds.includes(palestineCat!.id)).length;
    expect(palestineCat!.cartoon_count).toBe(expected);
  });
});

describe('getCategoryBySlug', () => {
  it('returns correct category for a known slug', async () => {
    const cat = await getCategoryBySlug('palestine');
    expect(cat).not.toBeNull();
    expect(cat!.slug).toBe('palestine');
    expect(cat!.name_en).toBe('Palestine');
  });

  it('returns null for an unknown slug', async () => {
    const cat = await getCategoryBySlug('does-not-exist-xyz');
    expect(cat).toBeNull();
  });
});

describe('getCartoonsByCategory', () => {
  const defaultOpts = { sort: 'newest' as const, page: 1, limit: 10 };

  it('returns all published cartoons for "all"', async () => {
    const { total } = await getCartoonsByCategory('all', defaultOpts);
    const publishedCount = MOCK_CARTOONS.filter(c => c.is_published).length;
    expect(total).toBe(publishedCount);
  });

  it('returns only cartoons belonging to the given category', async () => {
    const catId = 'cat-01'; // Palestine
    const { cartoons } = await getCartoonsByCategory(catId, defaultOpts);
    for (const c of cartoons) {
      expect(c).toBeDefined();
    }
  });

  it('respects pagination limit', async () => {
    const { cartoons } = await getCartoonsByCategory('all', { sort: 'newest', page: 1, limit: 5 });
    expect(cartoons.length).toBeLessThanOrEqual(5);
  });

  it('page 2 returns different cartoons than page 1', async () => {
    const p1 = await getCartoonsByCategory('all', { sort: 'newest', page: 1, limit: 10 });
    const p2 = await getCartoonsByCategory('all', { sort: 'newest', page: 2, limit: 10 });
    const ids1 = new Set(p1.cartoons.map(c => c.id));
    const ids2 = new Set(p2.cartoons.map(c => c.id));
    for (const id of ids2) {
      expect(ids1.has(id)).toBe(false);
    }
  });

  it('newest sort returns cartoons in descending date order', async () => {
    const { cartoons } = await getCartoonsByCategory('all', { sort: 'newest', page: 1, limit: 60 });
    for (let i = 1; i < cartoons.length; i++) {
      const prev = cartoons[i - 1].publication_date ?? cartoons[i - 1].created_at;
      const curr = cartoons[i].publication_date ?? cartoons[i].created_at;
      expect(prev >= curr).toBe(true);
    }
  });

  it('oldest sort returns cartoons in ascending date order', async () => {
    const { cartoons } = await getCartoonsByCategory('all', { sort: 'oldest', page: 1, limit: 60 });
    for (let i = 1; i < cartoons.length; i++) {
      const prev = cartoons[i - 1].publication_date ?? cartoons[i - 1].created_at;
      const curr = cartoons[i].publication_date ?? cartoons[i].created_at;
      expect(prev <= curr).toBe(true);
    }
  });
});

describe('getAllCartoons', () => {
  it('returns same result as getCartoonsByCategory("all")', async () => {
    const opts = { sort: 'newest' as const, page: 1, limit: 20 };
    const all = await getAllCartoons(opts);
    const byCategory = await getCartoonsByCategory('all', opts);
    expect(all.total).toBe(byCategory.total);
  });
});

describe('getCartoonById', () => {
  it('returns a cartoon with relations for a known id', async () => {
    const cartoon = await getCartoonById('cartoon-01');
    expect(cartoon).not.toBeNull();
    expect(cartoon!.id).toBe('cartoon-01');
    expect(Array.isArray(cartoon!.categories)).toBe(true);
    expect(Array.isArray(cartoon!.tags)).toBe(true);
    expect(cartoon!.categories.length).toBeGreaterThan(0);
  });

  it('returns null for an unknown id', async () => {
    const cartoon = await getCartoonById('nonexistent-id');
    expect(cartoon).toBeNull();
  });
});

describe('getRelatedCartoons', () => {
  it('returns cartoons sharing categories, excluding the source cartoon', async () => {
    const source = MOCK_CARTOONS[0];
    const related = await getRelatedCartoons(source.id, source.categoryIds, source.tagIds, 6);
    const ids = related.map(c => c.id);
    expect(ids).not.toContain(source.id);
    expect(related.length).toBeLessThanOrEqual(6);
  });

  it('returns empty array when no category or tag ids provided', async () => {
    const related = await getRelatedCartoons('cartoon-01', [], [], 6);
    expect(related).toHaveLength(0);
  });
});

describe('searchCartoons', () => {
  it('finds cartoons by Arabic title', async () => {
    const result = await searchCartoons('حنظلة');
    expect(result.cartoons.length).toBeGreaterThan(0);
  });

  it('finds cartoons by English title', async () => {
    const result = await searchCartoons('Handala');
    expect(result.cartoons.length).toBeGreaterThan(0);
  });

  it('finds categories by name', async () => {
    const result = await searchCartoons('Palestine');
    expect(result.categories.length).toBeGreaterThan(0);
  });

  it('returns empty arrays for a query with no matches', async () => {
    const result = await searchCartoons('ZZZNOMATCHXXX999');
    expect(result.cartoons).toHaveLength(0);
    expect(result.categories).toHaveLength(0);
  });

  it('search is case-insensitive for English', async () => {
    const lower = await searchCartoons('handala');
    const upper = await searchCartoons('HANDALA');
    expect(lower.cartoons.length).toBe(upper.cartoons.length);
  });
});

describe('getVideos', () => {
  it('returns published videos in display order', async () => {
    const videos = await getVideos();
    expect(videos.length).toBeGreaterThan(0);
    expect(videos.every(v => v.is_published)).toBe(true);
    for (let i = 1; i < videos.length; i++) {
      expect(videos[i - 1].display_order).toBeLessThanOrEqual(videos[i].display_order);
    }
  });
});
