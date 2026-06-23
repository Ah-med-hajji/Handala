import { createClient } from './supabase-server';
import { MOCK_CONTENT, MOCK_SUPPORTERS, MOCK_ASSASSINATION_PDFS } from './mock-data';
import type { SiteContent, Supporter, AssassinationPdf } from '@/types';

export async function getSiteContent(key: string): Promise<SiteContent | null> {
  if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') return MOCK_CONTENT.find(c => c.key === key) || null;
  const supabase = createClient();
  const { data } = await supabase.from('site_content').select('*').eq('key', key).single();
  return data || null;
}

export async function getAllSiteContent(): Promise<SiteContent[]> {
  if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') return MOCK_CONTENT;
  const supabase = createClient();
  const { data } = await supabase.from('site_content').select('*').order('key');
  return data || [];
}

// Keys that have their own hardcoded routes under /[locale]/... and so should
// not show up in the dynamic content dropdown (the navbar links to them
// individually).
const HARDCODED_CONTENT_KEYS = new Set([
  'about_naji',
  'about_site',
  'about_assassination',
]);

// Custom admin-created pages: everything in site_content that doesn't have a
// hardcoded route. These are linked from the navbar's "Content" dropdown and
// rendered by /[locale]/content/[key]/page.tsx.
export async function getCustomContentEntries(): Promise<SiteContent[]> {
  const all = await getAllSiteContent();
  return all.filter(c => !HARDCODED_CONTENT_KEYS.has(c.key));
}

export async function getPublishedSupporters(): Promise<Supporter[]> {
  if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') return MOCK_SUPPORTERS.filter(s => s.is_published);
  const supabase = createClient();
  const { data } = await supabase
    .from('supporters')
    .select('*')
    .eq('is_published', true)
    .order('display_order');
  return data || [];
}

export async function getAllSupporters(): Promise<Supporter[]> {
  if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') return MOCK_SUPPORTERS;
  const supabase = createClient();
  const { data } = await supabase.from('supporters').select('*').order('display_order');
  return data || [];
}

export async function getPublishedAssassinationPdfs(): Promise<AssassinationPdf[]> {
  if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true')
    return MOCK_ASSASSINATION_PDFS.filter(p => p.is_published).sort(
      (a, b) => a.display_order - b.display_order
    );
  const supabase = createClient();
  const { data } = await supabase
    .from('assassination_pdfs')
    .select('*')
    .eq('is_published', true)
    .order('display_order');
  return data || [];
}

export async function getAllAssassinationPdfs(): Promise<AssassinationPdf[]> {
  if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true')
    return [...MOCK_ASSASSINATION_PDFS].sort((a, b) => a.display_order - b.display_order);
  const supabase = createClient();
  const { data } = await supabase.from('assassination_pdfs').select('*').order('display_order');
  return data || [];
}
