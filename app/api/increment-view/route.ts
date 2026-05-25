import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

export async function POST(req: NextRequest) {
  try {
    const { cartoonId } = await req.json();
    if (!cartoonId || typeof cartoonId !== 'string') {
      return NextResponse.json({ error: 'Missing cartoonId' }, { status: 400 });
    }

    if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
      return NextResponse.json({ success: true });
    }

    const supabase = createClient();

    // Try RPC first, fall back to manual increment
    const rpcResult = await supabase.rpc('increment_view_count', { p_cartoon_id: cartoonId });
    if (rpcResult.error) {
      const { data } = await supabase
        .from('cartoons')
        .select('view_count')
        .eq('id', cartoonId)
        .single();
      if (data) {
        await supabase
          .from('cartoons')
          .update({ view_count: (data.view_count || 0) + 1 })
          .eq('id', cartoonId);
      }
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
