import Link from 'next/link';
import { createServiceClient } from '@/lib/supabase-server';
import CategoriesListClient from './CategoriesListClient';
import { MOCK_CATEGORIES, MOCK_CARTOONS } from '@/lib/mock-data';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

export default async function AdminCategoriesPage() {
  let categories: { id: string; name_ar: string; name_en: string; slug: string; cover_image_url: string | null; display_order: number; is_published: boolean; cartoon_count: number }[];

  if (USE_MOCK) {
    categories = MOCK_CATEGORIES.map(cat => ({
      ...cat,
      cartoon_count: MOCK_CARTOONS.filter(c => c.categoryIds.includes(cat.id)).length,
    }));
  } else {
    const supabase = createServiceClient();
    const { data } = await supabase
      .from('categories')
      .select('id, name_ar, name_en, slug, cover_image_url, display_order, is_published, cartoon_categories(count)')
      .order('display_order');
    categories = (data || []).map((c: any) => ({
      ...c,
      cartoon_count: c.cartoon_categories?.[0]?.count ?? 0,
    }));
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Categories ({categories.length})</h1>
        <Link
          href="/admin/categories/new"
          className="bg-accent text-black px-4 py-2 rounded text-sm font-semibold hover:bg-accent/90 transition-colors"
        >
          + New Category
        </Link>
      </div>
      <CategoriesListClient categories={categories} />
    </div>
  );
}
