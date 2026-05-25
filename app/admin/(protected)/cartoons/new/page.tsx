import { createServiceClient } from '@/lib/supabase-server';
import CartoonFormClient from '../CartoonFormClient';
import { MOCK_CATEGORIES, MOCK_TAGS } from '@/lib/mock-data';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

export default async function NewCartoonPage() {
  if (USE_MOCK) {
    return (
      <CartoonFormClient
        categories={MOCK_CATEGORIES.map(c => ({ id: c.id, name_ar: c.name_ar, name_en: c.name_en }))}
        tags={MOCK_TAGS}
      />
    );
  }

  const supabase = createServiceClient();
  const [{ data: categories }, { data: tags }] = await Promise.all([
    supabase.from('categories').select('id, name_ar, name_en').order('name_ar'),
    supabase.from('tags').select('id, name_ar, name_en, slug, created_at').order('name_ar'),
  ]);

  return (
    <CartoonFormClient
      categories={categories || []}
      tags={tags || []}
    />
  );
}
