import { cookies } from 'next/headers';

export const COOKIE_NAME = 'p11_admin';
export const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export function isAdminAuthed(): boolean {
  return cookies().get(COOKIE_NAME)?.value === '1';
}

export function assertAuthed() {
  if (!isAdminAuthed()) throw new Error('Not authenticated');
}
