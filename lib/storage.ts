import { createServiceClient } from './supabase-server';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

export async function uploadToStorage(
  file: File,
  bucket: string,
  path: string
): Promise<string> {
  if (USE_MOCK) {
    return `https://picsum.photos/seed/${Date.now()}/800/600`;
  }
  const supabase = createServiceClient();
  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    upsert: true,
    contentType: file.type,
  });
  if (error) throw error;
  return getPublicUrl(bucket, path);
}

export function getPublicUrl(bucket: string, path: string): string {
  if (USE_MOCK) {
    return `https://picsum.photos/seed/${path}/800/600`;
  }
  const supabase = createServiceClient();
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

export async function deleteFromStorage(bucket: string, path: string): Promise<void> {
  if (USE_MOCK) return;
  const supabase = createServiceClient();
  const { error } = await supabase.storage.from(bucket).remove([path]);
  if (error) throw error;
}
