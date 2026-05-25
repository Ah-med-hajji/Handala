import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase-server';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

export async function POST() {
  if (USE_MOCK) {
    const cookieStore = cookies();
    cookieStore.delete('mock-admin-session');
    return NextResponse.json({ success: true });
  }
  const supabase = createClient();
  await supabase.auth.signOut();
  return NextResponse.json({ success: true });
}
