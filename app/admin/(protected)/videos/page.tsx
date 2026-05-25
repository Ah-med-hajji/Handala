import Link from 'next/link';
import { createServiceClient } from '@/lib/supabase-server';
import VideosListClient from './VideosListClient';
import { MOCK_VIDEOS } from '@/lib/mock-data';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

export default async function AdminVideosPage() {
  let data: { id: string; title_ar: string; title_en: string | null; youtube_id: string; display_order: number; is_published: boolean }[];

  if (USE_MOCK) {
    data = MOCK_VIDEOS.map(v => ({
      id: v.id, title_ar: v.title_ar, title_en: v.title_en,
      youtube_id: v.youtube_id, display_order: v.display_order, is_published: v.is_published,
    }));
  } else {
    const supabase = createServiceClient();
    const result = await supabase
      .from('videos')
      .select('id, title_ar, title_en, youtube_id, display_order, is_published')
      .order('display_order');
    data = result.data || [];
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Videos ({data.length})</h1>
        <Link
          href="/admin/videos/new"
          className="bg-accent text-black px-4 py-2 rounded text-sm font-semibold hover:bg-accent/90 transition-colors"
        >
          + New Video
        </Link>
      </div>
      <VideosListClient videos={data} />
    </div>
  );
}
