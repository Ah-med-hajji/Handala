'use server';

import { revalidatePath } from 'next/cache';
import { createServiceClient } from '@/lib/supabase-server';
import { requireAdmin } from '@/lib/auth';
import type { SubmissionStatus } from '@/types';

export async function updateSubmission(
  id: string,
  data: { status: SubmissionStatus; admin_notes?: string }
) {
  await requireAdmin();
  if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') return { success: true };
  const supabase = createServiceClient();
  const { error } = await supabase
    .from('submissions')
    .update({ status: data.status, admin_notes: data.admin_notes || null })
    .eq('id', id);

  if (error) return { success: false, error: error.message };
  revalidatePath('/admin/submissions');
  return { success: true };
}
