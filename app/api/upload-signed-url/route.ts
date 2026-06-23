import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { createServiceClient } from '@/lib/supabase-server';

// Returns a signed upload URL the browser can PUT a file to directly,
// bypassing the Vercel function body-size cap (~4.5 MB). Used for PDFs.
export async function POST(req: NextRequest) {
  try {
    await requireAdmin();

    const body = (await req.json()) as { fileName?: string; bucket?: string };
    const { fileName, bucket } = body;
    if (!fileName || !bucket) {
      return NextResponse.json(
        { error: 'Missing fileName or bucket' },
        { status: 400 }
      );
    }

    const ext = fileName.split('.').pop() || 'bin';
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
      return NextResponse.json({
        signedUrl: '',
        token: 'mock',
        path,
        publicUrl: `https://picsum.photos/seed/${path}/600/800`,
        mock: true,
      });
    }

    const supabase = createServiceClient();
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUploadUrl(path);
    if (error || !data) {
      return NextResponse.json(
        { error: error?.message || 'Failed to create signed URL' },
        { status: 500 }
      );
    }
    const { data: pub } = supabase.storage.from(bucket).getPublicUrl(path);
    return NextResponse.json({
      signedUrl: data.signedUrl,
      token: data.token,
      path: data.path,
      publicUrl: pub.publicUrl,
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || 'Upload URL request failed' },
      { status: 500 }
    );
  }
}
