'use server';

import { revalidatePath } from 'next/cache';
import { createServiceClient } from '@/lib/supabase-server';
import { requireAdmin } from '@/lib/auth';

export async function updateSiteContent(
  key: string,
  input: { title_ar: string; title_en: string; content_ar: string; content_en: string }
) {
  await requireAdmin();
  if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') return { success: true };
  const supabase = createServiceClient();
  const { error } = await supabase
    .from('site_content')
    .upsert({ key, ...input, updated_at: new Date().toISOString() }, { onConflict: 'key' });
  if (error) return { success: false, error: error.message };
  revalidatePath('/ar/about-naji');
  revalidatePath('/en/about-naji');
  revalidatePath('/ar/about-site');
  revalidatePath('/en/about-site');
  return { success: true };
}
