import { createClient as createSbClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Hit Supabase every day so the free-tier project doesn't get auto-paused
// after 7 days of inactivity. Vercel Cron triggers this route (see vercel.json).
// Requests are authenticated via the CRON_SECRET env var Vercel injects as a
// Bearer token; manual triggers from a terminal must pass the same secret.
export async function GET(request: Request) {
  if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
    return NextResponse.json({ ok: true, skipped: 'mock mode' });
  }

  const authHeader = request.headers.get('authorization');
  const expected = `Bearer ${process.env.CRON_SECRET}`;
  if (!process.env.CRON_SECRET || authHeader !== expected) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    return NextResponse.json(
      { ok: false, error: 'supabase env vars missing' },
      { status: 500 },
    );
  }

  const supabase = createSbClient(url, key, { auth: { persistSession: false } });

  const { count, error } = await supabase
    .from('cartoons')
    .select('id', { count: 'exact', head: true });

  if (error) {
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 },
    );
  }

  return NextResponse.json({
    ok: true,
    pinged: 'cartoons',
    count: count ?? 0,
    at: new Date().toISOString(),
  });
}
