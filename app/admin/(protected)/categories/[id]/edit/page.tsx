import { createServiceClient } from '@/lib/supabase-server';
import { notFound } from 'next/navigation';
import EditCategoryClient from './EditCategoryClient';
import { MOCK_CATEGORIES } from '@/lib/mock-data';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

export default async function EditCategoryPage({ params }: { params: { id: string } }) {
  if (USE_MOCK) {
    const category = MOCK_CATEGORIES.find(c => c.id === params.id);
    if (!category) return notFound();
    return <EditCategoryClient category={category} />;
  }
  const supabase = createServiceClient();
  const { data: category } = await supabase.from('categories').select('*').eq('id', params.id).single();
  if (!category) return notFound();
  return <EditCategoryClient category={category} />;
}
