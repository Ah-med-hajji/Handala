import Link from 'next/link';
import { createServiceClient } from '@/lib/supabase-server';
import CartoonsListClient from './CartoonsListClient';
import { MOCK_CARTOONS } from '@/lib/mock-data';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

export default async function AdminCartoonsPage({
  searchParams,
}: {
  searchParams: { page?: string; q?: string };
}) {
  const page = parseInt(searchParams.page || '1', 10);
  const q = searchParams.q || '';
  const limit = 20;
  const from = (page - 1) * limit;

  let data: { id: string; title_ar: string; image_url: string; publication_date: string | null; is_published: boolean; view_count: number }[];
  let count: number;

  if (USE_MOCK) {
    let pool = MOCK_CARTOONS;
    if (q) pool = pool.filter(c => c.title_ar.toLowerCase().includes(q.toLowerCase()));
    count = pool.length;
    data = pool.slice(from, from + limit).map(c => ({
      id: c.id, title_ar: c.title_ar, image_url: c.image_url,
      publication_date: c.publication_date, is_published: c.is_published, view_count: c.view_count,
    }));
  } else {
    const supabase = createServiceClient();
    let query = supabase
      .from('cartoons')
      .select('id, title_ar, image_url, publication_date, is_published, view_count', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, from + limit - 1);
    if (q) query = query.ilike('title_ar', `%${q}%`);
    const result = await query;
    data = result.data || [];
    count = result.count || 0;
  }

  const totalPages = Math.ceil(count / limit);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Cartoons ({count})</h1>
        <Link
          href="/admin/cartoons/new"
          className="bg-accent text-black px-4 py-2 rounded text-sm font-semibold hover:bg-accent/90 transition-colors"
        >
          + New Cartoon
        </Link>
      </div>
      <CartoonsListClient
        cartoons={data}
        page={page}
        totalPages={totalPages}
        q={q}
      />
    </div>
  );
}
