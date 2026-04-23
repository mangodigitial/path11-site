'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createClient } from '@supabase/supabase-js';
import { COOKIE_NAME, COOKIE_MAX_AGE, assertAuthed } from './auth';

function requireAdminPin(): string {
  const pin = process.env.ADMIN_PIN;
  if (!pin) throw new Error('ADMIN_PIN is not set. Add it to .env.local');
  return pin;
}

function supabaseAdmin() {
  // Uses anon key — RLS policies are permissive. If you later add RLS,
  // switch this to the service_role key (stored in SUPABASE_SERVICE_ROLE_KEY).
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createClient(url, key, { auth: { persistSession: false } });
}

// ─── Auth ────────────────────────────────────────────────────

export async function loginAction(
  _prev: { error: string | null },
  formData: FormData
): Promise<{ error: string | null }> {
  const input = String(formData.get('pin') ?? '');
  const pin = requireAdminPin();
  if (input !== pin) {
    return { error: 'Incorrect PIN' };
  }
  cookies().set(COOKIE_NAME, '1', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: COOKIE_MAX_AGE,
    path: '/',
  });
  redirect('/admin');
}

export async function logoutAction() {
  cookies().delete(COOKIE_NAME);
  redirect('/admin');
}

// ─── Generic helpers ─────────────────────────────────────────

export async function saveRow(table: string, row: Record<string, any>) {
  assertAuthed();
  const s = supabaseAdmin();
  const { id, ...rest } = row;
  const payload = { ...rest, updated_at: new Date().toISOString() };

  if (id) {
    const { error } = await s.from(table).update(payload).eq('id', id);
    if (error) throw error;
  } else {
    const { error } = await s.from(table).insert(payload);
    if (error) throw error;
  }
  revalidatePath('/');
}

export async function deleteRow(table: string, id: string) {
  assertAuthed();
  const { error } = await supabaseAdmin().from(table).delete().eq('id', id);
  if (error) throw error;
  revalidatePath('/');
}

export async function reorder(table: string, ids: string[]) {
  assertAuthed();
  const s = supabaseAdmin();
  // Update each row with its new order_index
  await Promise.all(
    ids.map((id, idx) =>
      s.from(table).update({ order_index: idx + 1 }).eq('id', id)
    )
  );
  revalidatePath('/');
}

export async function saveConfig(config: Record<string, any>) {
  assertAuthed();
  const { error } = await supabaseAdmin()
    .from('config')
    .update({ ...config, updated_at: new Date().toISOString() })
    .eq('id', 1);
  if (error) throw error;
  revalidatePath('/');
}
