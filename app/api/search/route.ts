import { NextRequest, NextResponse } from 'next/server';
import { searchCartoons } from '@/lib/data';

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q') || '';
  if (q.length < 2) {
    return NextResponse.json({ cartoons: [], categories: [] });
  }
  try {
    const results = await searchCartoons(q);
    return NextResponse.json(results, {
      headers: { 'Cache-Control': 'public, max-age=60' },
    });
  } catch {
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
