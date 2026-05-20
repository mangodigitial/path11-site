import { fetchSiteContent } from '@/lib/content';
import HoldingClient from './HoldingClient';

// Re-fetch from Supabase every 60 seconds. Admin saves also trigger
// revalidatePath('/') in app/admin/actions.ts for instant updates.
export const revalidate = 60;

// Public site is in holding mode while the next iteration is built.
// To go live again, swap HoldingClient for HomeClient.
export default async function HomePage() {
  const content = await fetchSiteContent();
  return <HoldingClient content={content} />;
}
