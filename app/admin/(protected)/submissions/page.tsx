import { createServiceClient } from '@/lib/supabase-server';
import SubmissionsClient from './SubmissionsClient';
import type { Submission } from '@/types';
import { MOCK_SUBMISSIONS } from '@/lib/mock-data';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

export default async function AdminSubmissionsPage({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  const status = searchParams.status;
  let submissions: Submission[];

  if (USE_MOCK) {
    submissions = status && status !== 'all'
      ? MOCK_SUBMISSIONS.filter(s => s.status === status)
      : MOCK_SUBMISSIONS;
  } else {
    const supabase = createServiceClient();
    let query = supabase.from('submissions').select('*').order('created_at', { ascending: false });
    if (status && status !== 'all') query = query.eq('status', status);
    const { data } = await query;
    submissions = data || [];
  }

  return <SubmissionsClient submissions={submissions} currentFilter={status || 'all'} />;
}
