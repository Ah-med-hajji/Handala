'use server';

import { revalidatePath } from 'next/cache';
import { createServiceClient } from '@/lib/supabase-server';
import { requireAdmin } from '@/lib/auth';
import { z } from 'zod';

const pdfSchema = z.object({
  title_ar: z.string().min(1, 'Arabic title is required'),
  title_en: z.string().optional(),
  title_fr: z.string().optional(),
  title_es: z.string().optional(),
  description_ar: z.string().optional(),
  description_en: z.string().optional(),
  description_fr: z.string().optional(),
  description_es: z.string().optional(),
  pdf_url: z.string().min(1, 'PDF file is required'),
  thumbnail_url: z.string().optional(),
  display_order: z.number().default(0),
  is_published: z.boolean().default(true),
});

type PdfInput = z.infer<typeof pdfSchema>;

function revalidateAll() {
  for (const locale of ['ar', 'en', 'fr', 'es']) {
    revalidatePath(`/${locale}/about-assassination`);
  }
}

export async function createAssassinationPdf(input: PdfInput) {
  await requireAdmin();
  if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') return { success: true };
  const data = pdfSchema.parse(input);
  const supabase = createServiceClient();

  const { error } = await supabase.from('assassination_pdfs').insert({
    title_ar: data.title_ar,
    title_en: data.title_en || null,
    title_fr: data.title_fr || null,
    title_es: data.title_es || null,
    description_ar: data.description_ar || null,
    description_en: data.description_en || null,
    description_fr: data.description_fr || null,
    description_es: data.description_es || null,
    pdf_url: data.pdf_url,
    thumbnail_url: data.thumbnail_url || null,
    display_order: data.display_order,
    is_published: data.is_published,
  });

  if (error) return { success: false, error: error.message };
  revalidateAll();
  return { success: true };
}

export async function updateAssassinationPdf(id: string, input: PdfInput) {
  await requireAdmin();
  if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') return { success: true };
  const data = pdfSchema.parse(input);
  const supabase = createServiceClient();

  const { error } = await supabase
    .from('assassination_pdfs')
    .update({
      title_ar: data.title_ar,
      title_en: data.title_en || null,
      title_fr: data.title_fr || null,
      title_es: data.title_es || null,
      description_ar: data.description_ar || null,
      description_en: data.description_en || null,
      description_fr: data.description_fr || null,
      description_es: data.description_es || null,
      pdf_url: data.pdf_url,
      thumbnail_url: data.thumbnail_url || null,
      display_order: data.display_order,
      is_published: data.is_published,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) return { success: false, error: error.message };
  revalidateAll();
  return { success: true };
}

export async function deleteAssassinationPdf(id: string) {
  await requireAdmin();
  if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') return { success: true };
  const supabase = createServiceClient();
  const { error } = await supabase.from('assassination_pdfs').delete().eq('id', id);
  if (error) return { success: false, error: error.message };
  revalidateAll();
  return { success: true };
}
