import Link from 'next/link';
import { createServiceClient } from '@/lib/supabase-server';
import AssassinationPdfsListClient from './AssassinationPdfsListClient';
import { MOCK_ASSASSINATION_PDFS } from '@/lib/mock-data';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

export default async function AdminAssassinationPdfsPage() {
  let data: {
    id: string;
    title_ar: string;
    title_en: string | null;
    thumbnail_url: string | null;
    pdf_url: string;
    display_order: number;
    is_published: boolean;
  }[];

  if (USE_MOCK) {
    data = MOCK_ASSASSINATION_PDFS.map(p => ({
      id: p.id,
      title_ar: p.title_ar,
      title_en: p.title_en,
      thumbnail_url: p.thumbnail_url,
      pdf_url: p.pdf_url,
      display_order: p.display_order,
      is_published: p.is_published,
    }));
  } else {
    const supabase = createServiceClient();
    const result = await supabase
      .from('assassination_pdfs')
      .select('id, title_ar, title_en, thumbnail_url, pdf_url, display_order, is_published')
      .order('display_order');
    data = result.data || [];
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Assassination PDFs ({data.length})</h1>
        <Link
          href="/admin/assassination-pdfs/new"
          className="bg-accent text-black px-4 py-2 rounded text-sm font-semibold hover:bg-accent/90 transition-colors"
        >
          + New PDF
        </Link>
      </div>
      <AssassinationPdfsListClient pdfs={data} />
    </div>
  );
}
