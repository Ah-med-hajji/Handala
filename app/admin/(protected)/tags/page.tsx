import { createServiceClient } from '@/lib/supabase-server';
import TagsClient from './TagsClient';
import { MOCK_TAGS, MOCK_CARTOONS } from '@/lib/mock-data';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

export default async function AdminTagsPage() {
  let tagsWithCount: { id: string; name_ar: string; name_en: string | null; slug: string; created_at: string; usage_count: number }[];

  if (USE_MOCK) {
    tagsWithCount = MOCK_TAGS.map(t => ({
      ...t,
      usage_count: MOCK_CARTOONS.filter(c => c.tagIds.includes(t.id)).length,
    }));
  } else {
    const supabase = createServiceClient();
    const { data: tags } = await supabase
      .from('tags')
      .select('*, cartoon_tags(count)')
      .order('name_ar');
    tagsWithCount = (tags || []).map((t: any) => ({
      ...t,
      usage_count: t.cartoon_tags?.[0]?.count ?? 0,
    }));
  }

  return <TagsClient tags={tagsWithCount} />;
}
