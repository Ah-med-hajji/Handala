import { createClient } from './supabase-server';
import type { Category, CategoryWithCount, Cartoon, CartoonWithRelations, Video, SearchResult, SortOrder } from '@/types';

export async function getCategories(): Promise<CategoryWithCount[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('categories')
    .select(`*, cartoon_categories(count)`)
    .eq('is_published', true)
    .order('display_order');
  if (error) throw error;
  return (data || []).map((cat: any) => ({
    ...cat,
    cartoon_count: cat.cartoon_categories?.[0]?.count ?? 0,
  }));
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single();
  if (error) return null;
  return data;
}

export async function getCartoonsByCategory(
  categoryId: string | 'all',
  options: { sort: SortOrder; page: number; limit: number }
): Promise<{ cartoons: Cartoon[]; total: number }> {
  const supabase = createClient();
  const { sort, page, limit } = options;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase.from('cartoons').select('*', { count: 'exact' }).eq('is_published', true);

  if (categoryId !== 'all') {
    const { data: ids } = await supabase
      .from('cartoon_categories')
      .select('cartoon_id')
      .eq('category_id', categoryId);
    const cartoonIds = (ids || []).map((r: any) => r.cartoon_id);
    if (!cartoonIds.length) return { cartoons: [], total: 0 };
    query = query.in('id', cartoonIds);
  }

  const { data, count, error } = await query
    .order('publication_date', { ascending: sort === 'oldest', nullsFirst: false })
    .range(from, to);

  if (error) throw error;
  return { cartoons: data || [], total: count || 0 };
}

export async function getCartoonById(id: string): Promise<CartoonWithRelations | null> {
  const supabase = createClient();
  const { data: cartoon, error } = await supabase
    .from('cartoons')
    .select(`*, cartoon_categories(categories(*)), cartoon_tags(tags(*))`)
    .eq('id', id)
    .eq('is_published', true)
    .single();
  if (error) return null;
  return {
    ...cartoon,
    categories: (cartoon.cartoon_categories || []).map((cc: any) => cc.categories).filter(Boolean),
    tags: (cartoon.cartoon_tags || []).map((ct: any) => ct.tags).filter(Boolean),
  };
}

export async function getRelatedCartoons(
  cartoonId: string,
  categoryIds: string[],
  tagIds: string[],
  limit = 6
): Promise<Cartoon[]> {
  const supabase = createClient();
  if (!categoryIds.length && !tagIds.length) return [];

  const { data: catIds } = await supabase
    .from('cartoon_categories')
    .select('cartoon_id')
    .in('category_id', categoryIds);

  const ids = Array.from(new Set((catIds || []).map((r: any) => r.cartoon_id))).filter(id => id !== cartoonId);
  if (!ids.length) return [];

  const { data } = await supabase
    .from('cartoons')
    .select('*')
    .eq('is_published', true)
    .in('id', ids)
    .limit(limit);

  return data || [];
}

export async function searchCartoons(query: string): Promise<SearchResult> {
  const supabase = createClient();
  const [cartoonsResult, categoriesResult] = await Promise.all([
    supabase
      .from('cartoons')
      .select('*')
      .eq('is_published', true)
      .or(`title_ar.ilike.%${query}%,title_en.ilike.%${query}%,description_ar.ilike.%${query}%`)
      .limit(24),
    supabase
      .from('categories')
      .select('*')
      .eq('is_published', true)
      .or(`name_ar.ilike.%${query}%,name_en.ilike.%${query}%`)
      .limit(5),
  ]);
  return {
    cartoons: cartoonsResult.data || [],
    categories: categoriesResult.data || [],
  };
}

export async function getVideos(): Promise<Video[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from('videos')
    .select('*')
    .eq('is_published', true)
    .order('display_order');
  return data || [];
}

export async function getAllCartoons(options: {
  sort: SortOrder;
  page: number;
  limit: number;
}): Promise<{ cartoons: Cartoon[]; total: number }> {
  return getCartoonsByCategory('all', options);
}
