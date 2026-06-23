'use server';

import { revalidatePath } from 'next/cache';
import { createServiceClient } from '@/lib/supabase-server';
import { requireAdmin } from '@/lib/auth';

export async function updateSiteContent(
  key: string,
  input: {
    title_ar: string;
    title_en: string;
    title_fr: string;
    title_es: string;
    content_ar: string;
    content_en: string;
    content_fr: string;
    content_es: string;
  }
) {
  await requireAdmin();
  if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') return { success: true };
  const supabase = createServiceClient();
  const { error } = await supabase
    .from('site_content')
    .upsert(
      {
        key,
        title_ar: input.title_ar,
        title_en: input.title_en || null,
        title_fr: input.title_fr || null,
        title_es: input.title_es || null,
        content_ar: input.content_ar,
        content_en: input.content_en || null,
        content_fr: input.content_fr || null,
        content_es: input.content_es || null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'key' }
    );
  if (error) return { success: false, error: error.message };
  for (const locale of ['ar', 'en', 'fr', 'es']) {
    revalidatePath(`/${locale}/about-naji`);
    revalidatePath(`/${locale}/about-site`);
    revalidatePath(`/${locale}/about-assassination`);
  }
  return { success: true };
}
