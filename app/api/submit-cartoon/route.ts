import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  message: z.string().max(1000).optional(),
  imageUrl: z.string().url().optional().or(z.literal('')),
  honeypot: z.string().max(0, 'Bot detected'),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = schema.parse(body);

    if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
      return NextResponse.json({ success: true });
    }

    const supabase = createClient();
    const { error } = await supabase.from('submissions').insert({
      sender_name: data.name,
      sender_email: data.email,
      message: data.message || null,
      image_url: data.imageUrl || null,
      status: 'pending',
    });

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (e: any) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: e.errors[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Submission failed' }, { status: 500 });
  }
}
