'use server';

import { revalidatePath } from 'next/cache';
import { createServiceClient } from '@/lib/supabase-server';
import { requireAdmin } from '@/lib/auth';
import { z } from 'zod';

const supporterSchema = z.object({
  name_ar: z.string().min(1, 'Arabic name is required'),
  name_en: z.string().optional(),
  url: z.string().optional(),
  logo_url: z.string().optional(),
  description_ar: z.string().optional(),
  description_en: z.string().optional(),
  display_order: z.number().default(0),
  is_published: z.boolean().default(true),
});

type SupporterInput = z.infer<typeof supporterSchema>;

export async function createSupporter(input: SupporterInput) {
  await requireAdmin();
  if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') return { success: true };
  const data = supporterSchema.parse(input);
  const supabase = createServiceClient();
  const { error } = await supabase.from('supporters').insert({
    ...data,
    name_en: data.name_en || null,
    url: data.url || null,
    logo_url: data.logo_url || null,
    description_ar: data.description_ar || null,
    description_en: data.description_en || null,
  });
  if (error) return { success: false, error: error.message };
  revalidatePath('/ar/supporters');
  revalidatePath('/en/supporters');
  return { success: true };
}

export async function updateSupporter(id: string, input: SupporterInput) {
  await requireAdmin();
  if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') return { success: true };
  const data = supporterSchema.parse(input);
  const supabase = createServiceClient();
  const { error } = await supabase
    .from('supporters')
    .update({
      ...data,
      name_en: data.name_en || null,
      url: data.url || null,
      logo_url: data.logo_url || null,
      description_ar: data.description_ar || null,
      description_en: data.description_en || null,
    })
    .eq('id', id);
  if (error) return { success: false, error: error.message };
  revalidatePath('/ar/supporters');
  revalidatePath('/en/supporters');
  return { success: true };
}

export async function deleteSupporter(id: string) {
  await requireAdmin();
  if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') return { success: true };
  const supabase = createServiceClient();
  const { error } = await supabase.from('supporters').delete().eq('id', id);
  if (error) return { success: false, error: error.message };
  revalidatePath('/ar/supporters');
  revalidatePath('/en/supporters');
  return { success: true };
}
