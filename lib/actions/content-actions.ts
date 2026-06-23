'use server';

import { revalidatePath } from 'next/cache';
import { createServiceClient } from '@/lib/supabase-server';
import { requireAdmin } from '@/lib/auth';

const HARDCODED_KEYS = ['about_naji', 'about_site', 'about_assassination'];

function revalidatePublic(key: string) {
  // Hit each locale's known hardcoded pages and the dynamic content route so
  // the navbar dropdown (in the locale layout) reflects new/edited entries
  // without a redeploy.
  for (const locale of ['ar', 'en', 'fr', 'es']) {
    revalidatePath(`/${locale}/about-naji`);
    revalidatePath(`/${locale}/about-site`);
    revalidatePath(`/${locale}/about-assassination`);
    revalidatePath(`/${locale}/content/${key}`);
  }
  // Re-render the layout (which fetches the dropdown items) for every page.
  revalidatePath('/', 'layout');
}

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
  revalidatePublic(key);
  return { success: true };
}

function isValidKey(key: string) {
  return /^[a-z0-9_]+$/.test(key) && key.length >= 2 && key.length <= 64;
}

export async function createSiteContent(input: {
  key: string;
  title_ar: string;
  title_en: string;
  title_fr: string;
  title_es: string;
  content_ar: string;
  content_en: string;
  content_fr: string;
  content_es: string;
}) {
  await requireAdmin();
  if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') return { success: true };
  const key = input.key.trim().toLowerCase();
  if (!isValidKey(key)) {
    return {
      success: false,
      error: 'Page key must be 2–64 chars: lowercase letters, numbers, underscores only.',
    };
  }
  if (!input.title_ar.trim() || !input.content_ar.trim()) {
    return { success: false, error: 'Arabic title and content are required.' };
  }
  const supabase = createServiceClient();
  const { data: existing } = await supabase
    .from('site_content')
    .select('id')
    .eq('key', key)
    .maybeSingle();
  if (existing) {
    return { success: false, error: `A page with the key "${key}" already exists.` };
  }
  const { error } = await supabase.from('site_content').insert({
    key,
    title_ar: input.title_ar,
    title_en: input.title_en || null,
    title_fr: input.title_fr || null,
    title_es: input.title_es || null,
    content_ar: input.content_ar,
    content_en: input.content_en || null,
    content_fr: input.content_fr || null,
    content_es: input.content_es || null,
  });
  if (error) return { success: false, error: error.message };
  revalidatePublic(key);
  return { success: true, key };
}

export async function deleteSiteContent(key: string) {
  await requireAdmin();
  if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') return { success: true };
  if (HARDCODED_KEYS.includes(key)) {
    return { success: false, error: 'This page is built into the site and cannot be deleted.' };
  }
  const supabase = createServiceClient();
  const { error } = await supabase.from('site_content').delete().eq('key', key);
  if (error) return { success: false, error: error.message };
  revalidatePublic(key);
  return { success: true };
}
