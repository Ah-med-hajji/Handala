'use server';

import { revalidatePath } from 'next/cache';
import { createServiceClient } from '@/lib/supabase-server';
import { requireAdmin } from '@/lib/auth';
import { z } from 'zod';

const tagSchema = z.object({
  name_ar: z.string().min(1),
  name_en: z.string().optional(),
  name_fr: z.string().optional(),
  name_es: z.string().optional(),
  slug: z.string().min(1),
});

export async function createTag(input: z.infer<typeof tagSchema>) {
  await requireAdmin();
  if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') return { success: true };
  const data = tagSchema.parse(input);
  const supabase = createServiceClient();

  const { error } = await supabase.from('tags').insert({
    name_ar: data.name_ar,
    name_en: data.name_en || null,
    name_fr: data.name_fr || null,
    name_es: data.name_es || null,
    slug: data.slug,
  });

  if (error) return { success: false, error: error.message };
  revalidatePath('/admin/tags');
  return { success: true };
}

export async function deleteTag(id: string) {
  await requireAdmin();
  if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') return { success: true };
  const supabase = createServiceClient();

  // Check if tag is used
  const { count } = await supabase
    .from('cartoon_tags')
    .select('*', { count: 'exact', head: true })
    .eq('tag_id', id);

  if (count && count > 0) {
    return { success: false, error: `Tag is used by ${count} cartoon(s). Remove from cartoons first.` };
  }

  const { error } = await supabase.from('tags').delete().eq('id', id);
  if (error) return { success: false, error: error.message };
  revalidatePath('/admin/tags');
  return { success: true };
}
