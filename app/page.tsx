import { fetchSiteContent } from '@/lib/content';
import HomeClient from './HomeClient';

// Re-fetch from Supabase every 60 seconds. Admin saves also trigger
// revalidatePath('/') in app/admin/actions.ts for instant updates.
export const revalidate = 60;

export default async function HomePage() {
  const content = await fetchSiteContent();
  return <HomeClient content={content} />;
}
