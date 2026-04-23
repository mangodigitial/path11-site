import { isAdminAuthed } from './auth';
import { fetchAllContentForAdmin } from '@/lib/content';
import LoginForm from './LoginForm';
import AdminShell from './AdminShell';

export const dynamic = 'force-dynamic'; // always fresh, no cache

export default async function AdminPage() {
  if (!isAdminAuthed()) {
    return <LoginForm />;
  }
  const content = await fetchAllContentForAdmin();
  return <AdminShell initial={content} />;
}
