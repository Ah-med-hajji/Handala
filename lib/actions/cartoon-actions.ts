'use server';

import { revalidatePath } from 'next/cache';
import { createServiceClient } from '@/lib/supabase-server';
import { requireAdmin } from '@/lib/auth';
import { z } from 'zod';

const cartoonSchema = z.object({
  title_ar: z.string().min(1, 'Arabic title is required'),
  title_en: z.string().optional(),
  description_ar: z.string().optional(),
  description_en: z.string().optional(),
  image_url: z.string().min(1, 'Image is required'),
  image_high_res_url: z.string().optional(),
  publication_date: z.string().optional(),
  source: z.string().optional(),
  is_published: z.boolean().default(true),
  category_ids: z.array(z.string()).default([]),
  tag_ids: z.array(z.string()).default([]),
});

type CartoonInput = z.infer<typeof cartoonSchema>;

export async function createCartoon(input: CartoonInput) {
  await requireAdmin();
  if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') return { success: true };
  const data = cartoonSchema.parse(input);
  const supabase = createServiceClient();

  const { data: cartoon, error } = await supabase
    .from('cartoons')
    .insert({
      title_ar: data.title_ar,
      title_en: data.title_en || null,
      description_ar: data.description_ar || null,
      description_en: data.description_en || null,
      image_url: data.image_url,
      image_high_res_url: data.image_high_res_url || null,
      publication_date: data.publication_date || null,
      source: data.source || null,
      is_published: data.is_published,
    })
    .select()
    .single();

  if (error) return { success: false, error: error.message };

  if (data.category_ids.length) {
    await supabase.from('cartoon_categories').insert(
      data.category_ids.map(cid => ({ cartoon_id: cartoon.id, category_id: cid }))
    );
  }
  if (data.tag_ids.length) {
    await supabase.from('cartoon_tags').insert(
      data.tag_ids.map(tid => ({ cartoon_id: cartoon.id, tag_id: tid }))
    );
  }

  revalidatePath('/ar');
  revalidatePath('/en');
  return { success: true, data: cartoon };
}

export async function updateCartoon(id: string, input: CartoonInput) {
  await requireAdmin();
  if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') return { success: true };
  const data = cartoonSchema.parse(input);
  const supabase = createServiceClient();

  const { error } = await supabase
    .from('cartoons')
    .update({
      title_ar: data.title_ar,
      title_en: data.title_en || null,
      description_ar: data.description_ar || null,
      description_en: data.description_en || null,
      image_url: data.image_url,
      image_high_res_url: data.image_high_res_url || null,
      publication_date: data.publication_date || null,
      source: data.source || null,
      is_published: data.is_published,
    })
    .eq('id', id);

  if (error) return { success: false, error: error.message };

  await supabase.from('cartoon_categories').delete().eq('cartoon_id', id);
  await supabase.from('cartoon_tags').delete().eq('cartoon_id', id);

  if (data.category_ids.length) {
    await supabase.from('cartoon_categories').insert(
      data.category_ids.map(cid => ({ cartoon_id: id, category_id: cid }))
    );
  }
  if (data.tag_ids.length) {
    await supabase.from('cartoon_tags').insert(
      data.tag_ids.map(tid => ({ cartoon_id: id, tag_id: tid }))
    );
  }

  revalidatePath(`/ar/cartoon/${id}`);
  revalidatePath(`/en/cartoon/${id}`);
  revalidatePath('/ar');
  revalidatePath('/en');
  return { success: true };
}

export async function deleteCartoon(id: string) {
  await requireAdmin();
  if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') return { success: true };
  const supabase = createServiceClient();
  const { error } = await supabase.from('cartoons').delete().eq('id', id);
  if (error) return { success: false, error: error.message };
  revalidatePath('/ar');
  revalidatePath('/en');
  return { success: true };
}

export async function togglePublished(id: string, current: boolean) {
  await requireAdmin();
  if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') return { success: true };
  const supabase = createServiceClient();
  const { error } = await supabase
    .from('cartoons')
    .update({ is_published: !current })
    .eq('id', id);
  if (error) return { success: false, error: error.message };
  revalidatePath('/ar');
  revalidatePath('/en');
  return { success: true };
}
