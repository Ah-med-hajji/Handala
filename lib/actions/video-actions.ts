'use server';

import { revalidatePath } from 'next/cache';
import { createServiceClient } from '@/lib/supabase-server';
import { requireAdmin } from '@/lib/auth';
import { z } from 'zod';

function extractYouTubeId(url: string): string | null {
  const patterns = [
    /youtube\.com\/watch\?v=([^&]+)/,
    /youtu\.be\/([^?]+)/,
    /youtube\.com\/embed\/([^?]+)/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

const videoSchema = z.object({
  title_ar: z.string().min(1),
  title_en: z.string().optional(),
  description_ar: z.string().optional(),
  description_en: z.string().optional(),
  youtube_url: z.string().url(),
  display_order: z.number().default(0),
  is_published: z.boolean().default(true),
});

type VideoInput = z.infer<typeof videoSchema>;

export async function createVideo(input: VideoInput) {
  await requireAdmin();
  if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') return { success: true };
  const data = videoSchema.parse(input);
  const youtube_id = extractYouTubeId(data.youtube_url);
  if (!youtube_id) return { success: false, error: 'Invalid YouTube URL' };

  const supabase = createServiceClient();
  const { error } = await supabase.from('videos').insert({
    title_ar: data.title_ar,
    title_en: data.title_en || null,
    description_ar: data.description_ar || null,
    description_en: data.description_en || null,
    youtube_url: data.youtube_url,
    youtube_id,
    display_order: data.display_order,
    is_published: data.is_published,
  });

  if (error) return { success: false, error: error.message };
  revalidatePath('/ar/videos');
  revalidatePath('/en/videos');
  return { success: true };
}

export async function updateVideo(id: string, input: VideoInput) {
  await requireAdmin();
  if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') return { success: true };
  const data = videoSchema.parse(input);
  const youtube_id = extractYouTubeId(data.youtube_url);
  if (!youtube_id) return { success: false, error: 'Invalid YouTube URL' };

  const supabase = createServiceClient();
  const { error } = await supabase
    .from('videos')
    .update({
      title_ar: data.title_ar,
      title_en: data.title_en || null,
      description_ar: data.description_ar || null,
      description_en: data.description_en || null,
      youtube_url: data.youtube_url,
      youtube_id,
      display_order: data.display_order,
      is_published: data.is_published,
    })
    .eq('id', id);

  if (error) return { success: false, error: error.message };
  revalidatePath('/ar/videos');
  revalidatePath('/en/videos');
  return { success: true };
}

export async function deleteVideo(id: string) {
  await requireAdmin();
  if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') return { success: true };
  const supabase = createServiceClient();
  const { error } = await supabase.from('videos').delete().eq('id', id);
  if (error) return { success: false, error: error.message };
  revalidatePath('/ar/videos');
  revalidatePath('/en/videos');
  return { success: true };
}
