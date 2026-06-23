import { createServiceClient } from '@/lib/supabase-server';
import { notFound } from 'next/navigation';
import AssassinationPdfFormClient from '../../AssassinationPdfFormClient';
import { MOCK_ASSASSINATION_PDFS } from '@/lib/mock-data';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

export default async function EditAssassinationPdfPage({
  params,
}: {
  params: { id: string };
}) {
  if (USE_MOCK) {
    const pdf = MOCK_ASSASSINATION_PDFS.find(p => p.id === params.id);
    if (!pdf) return notFound();
    return <AssassinationPdfFormClient pdf={pdf} />;
  }
  const supabase = createServiceClient();
  const { data: pdf } = await supabase
    .from('assassination_pdfs')
    .select('*')
    .eq('id', params.id)
    .single();
  if (!pdf) return notFound();
  return <AssassinationPdfFormClient pdf={pdf} />;
}
