import { createClient } from './supabase-server';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export async function getSession() {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

export async function requireAdmin() {
  if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
    const cookieStore = cookies();
    if (cookieStore.get('mock-admin-session')?.value !== 'true') {
      redirect('/admin/login');
    }
    return { user: { id: 'mock', email: 'admin@example.com' } };
  }
  const session = await getSession();
  if (!session) redirect('/admin/login');
  return session;
}
