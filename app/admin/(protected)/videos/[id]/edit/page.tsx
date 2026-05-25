import { createServiceClient } from '@/lib/supabase-server';
import { notFound } from 'next/navigation';
import EditVideoClient from './EditVideoClient';
import { MOCK_VIDEOS } from '@/lib/mock-data';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

export default async function EditVideoPage({ params }: { params: { id: string } }) {
  if (USE_MOCK) {
    const video = MOCK_VIDEOS.find(v => v.id === params.id);
    if (!video) return notFound();
    return <EditVideoClient video={video} />;
  }
  const supabase = createServiceClient();
  const { data: video } = await supabase.from('videos').select('*').eq('id', params.id).single();
  if (!video) return notFound();
  return <EditVideoClient video={video} />;
}
