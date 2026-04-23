import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!url || !anonKey) {
  // Surface a loud error during build/dev if env vars are missing.
  // (In production this throws at first query, which is also fine.)
  console.warn('[supabase] Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

// Single client used both server- and client-side.
// RLS policies are permissive; admin writes are gated at /admin by cookie auth.
export const supabase = createClient(url, anonKey, {
  auth: { persistSession: false },
});

// Helper: upload a File to the `media` bucket, return the public URL.
export async function uploadToMedia(file: File, pathPrefix = 'uploads'): Promise<string> {
  const ext = file.name.split('.').pop() || 'bin';
  const safeName = file.name
    .replace(/\.[^.]+$/, '')
    .replace(/[^a-z0-9-]/gi, '-')
    .toLowerCase()
    .slice(0, 40);
  const key = `${pathPrefix}/${Date.now()}-${safeName}.${ext}`;

  const { error } = await supabase.storage
    .from('media')
    .upload(key, file, { cacheControl: '31536000', upsert: false });

  if (error) throw error;

  const { data } = supabase.storage.from('media').getPublicUrl(key);
  return data.publicUrl;
}

// Helper: delete a media asset by public URL
export async function deleteFromMedia(publicUrl: string): Promise<void> {
  const match = publicUrl.match(/\/media\/(.+)$/);
  if (!match) return;
  await supabase.storage.from('media').remove([match[1]]);
}
