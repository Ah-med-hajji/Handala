'use server';

import { revalidatePath } from 'next/cache';
import { createServiceClient } from '@/lib/supabase-server';
import { requireAdmin } from '@/lib/auth';
import { z } from 'zod';

const categorySchema = z.object({
  name_ar: z.string().min(1, 'Arabic name is required'),
  name_en: z.string().min(1, 'English name is required'),
  slug: z.string().min(1),
  description_ar: z.string().optional(),
  description_en: z.string().optional(),
  cover_image_url: z.string().optional(),
  display_order: z.number().default(0),
  is_published: z.boolean().default(true),
});

type CategoryInput = z.infer<typeof categorySchema>;

export async function createCategory(input: CategoryInput) {
  await requireAdmin();
  if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') return { success: true };
  const data = categorySchema.parse(input);
  const supabase = createServiceClient();

  const { error } = await supabase.from('categories').insert({
    ...data,
    cover_image_url: data.cover_image_url || null,
    description_ar: data.description_ar || null,
    description_en: data.description_en || null,
  });

  if (error) return { success: false, error: error.message };
  revalidatePath('/ar');
  revalidatePath('/en');
  return { success: true };
}

export async function updateCategory(id: string, input: CategoryInput) {
  await requireAdmin();
  if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') return { success: true };
  const data = categorySchema.parse(input);
  const supabase = createServiceClient();

  const { error } = await supabase
    .from('categories')
    .update({
      ...data,
      cover_image_url: data.cover_image_url || null,
      description_ar: data.description_ar || null,
      description_en: data.description_en || null,
    })
    .eq('id', id);

  if (error) return { success: false, error: error.message };
  revalidatePath('/ar');
  revalidatePath('/en');
  return { success: true };
}

export async function deleteCategory(id: string) {
  await requireAdmin();
  if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') return { success: true };
  const supabase = createServiceClient();
  const { error } = await supabase.from('categories').delete().eq('id', id);
  if (error) return { success: false, error: error.message };
  revalidatePath('/ar');
  revalidatePath('/en');
  return { success: true };
}

export async function reorderCategories(items: { id: string; order: number }[]) {
  await requireAdmin();
  if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') return { success: true };
  const supabase = createServiceClient();

  await Promise.all(
    items.map(({ id, order }) =>
      supabase.from('categories').update({ display_order: order }).eq('id', id)
    )
  );

  revalidatePath('/ar');
  revalidatePath('/en');
  return { success: true };
}
