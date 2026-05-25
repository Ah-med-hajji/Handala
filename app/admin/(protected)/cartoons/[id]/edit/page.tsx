import { createServiceClient } from '@/lib/supabase-server';
import { notFound } from 'next/navigation';
import CartoonFormClient from '../../CartoonFormClient';
import { MOCK_CARTOONS, MOCK_CATEGORIES, MOCK_TAGS } from '@/lib/mock-data';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

export default async function EditCartoonPage({ params }: { params: { id: string } }) {
  if (USE_MOCK) {
    const mockCartoon = MOCK_CARTOONS.find(c => c.id === params.id);
    if (!mockCartoon) return notFound();
    return (
      <CartoonFormClient
        cartoon={mockCartoon}
        categories={MOCK_CATEGORIES.map(c => ({ id: c.id, name_ar: c.name_ar, name_en: c.name_en }))}
        tags={MOCK_TAGS}
        selectedCategoryIds={mockCartoon.categoryIds}
        selectedTagIds={mockCartoon.tagIds}
      />
    );
  }

  const supabase = createServiceClient();
  const [
    { data: cartoon },
    { data: categories },
    { data: tags },
    { data: cartoonCategories },
    { data: cartoonTags },
  ] = await Promise.all([
    supabase.from('cartoons').select('*').eq('id', params.id).single(),
    supabase.from('categories').select('id, name_ar, name_en').order('name_ar'),
    supabase.from('tags').select('id, name_ar, name_en, slug, created_at').order('name_ar'),
    supabase.from('cartoon_categories').select('category_id').eq('cartoon_id', params.id),
    supabase.from('cartoon_tags').select('tag_id').eq('cartoon_id', params.id),
  ]);

  if (!cartoon) notFound();

  return (
    <CartoonFormClient
      cartoon={cartoon}
      categories={categories || []}
      tags={tags || []}
      selectedCategoryIds={(cartoonCategories || []).map((c: any) => c.category_id)}
      selectedTagIds={(cartoonTags || []).map((t: any) => t.tag_id)}
    />
  );
}
