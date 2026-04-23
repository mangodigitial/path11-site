import { supabase } from './supabase';

// ═════════════════════════════════════════════════════════════
// TYPES
// ═════════════════════════════════════════════════════════════

export type HeroTile = {
  label: string;
  meta: string;
  image_url?: string | null;
  video_url?: string | null;
  video_type?: 'vimeo' | 'mp4' | null;
};

export type HeroTake = {
  id: string;
  order_index: number;
  tiles: HeroTile[];
  published: boolean;
};

export type Project = {
  id: string;
  slug: string;
  order_index: number;
  title: string;
  location: string | null;
  category: string | null;
  year: string | null;
  services: string[];
  image_url: string | null;
  video_url: string | null;
  video_type: 'vimeo' | 'mp4' | null;
  description: string | null;
  size: 'hero' | 'tall' | 'wide' | 'square';
  published: boolean;
};

export type Service = {
  id: string;
  slug: string;
  order_index: number;
  num: string;
  nav: string;
  title: string;
  summary: string | null;
  description: string | null;
  deliverables: string[];
  thumb_image_url: string | null;
  published: boolean;
};

export type TeamMember = {
  id: string;
  order_index: number;
  name: string;
  role: string;
  bio: string | null;
  photo_url: string | null;
  is_founder: boolean;
  published: boolean;
};

export type Config = {
  id: 1;
  tagline: string | null;
  sub_copy: string | null;
  founder_quote: string | null;
  email: string;
  studios: string[];
};

export type SiteContent = {
  heroTakes: HeroTake[];
  heroTakesMobile: HeroTake[]; // flattened — each tile becomes its own take
  projects: Project[];
  services: Service[];
  team: TeamMember[];
  founder: TeamMember | null;
  config: Config;
};

// ═════════════════════════════════════════════════════════════
// FETCHERS
// ═════════════════════════════════════════════════════════════

const FALLBACK_CONFIG: Config = {
  id: 1,
  tagline: 'One studio for the full story of a hotel.',
  sub_copy: null,
  founder_quote: null,
  email: 'hello@path11.com',
  studios: ['London', 'Dubai', 'New York', 'Sydney'],
};

export async function fetchSiteContent(): Promise<SiteContent> {
  // Parallel fetch everything at once
  const [heroRes, projRes, svcRes, teamRes, cfgRes] = await Promise.all([
    supabase.from('hero_takes').select('*').eq('published', true).order('order_index'),
    supabase.from('projects').select('*').eq('published', true).order('order_index'),
    supabase.from('services').select('*').eq('published', true).order('order_index'),
    supabase.from('team').select('*').eq('published', true).order('order_index'),
    supabase.from('config').select('*').eq('id', 1).single(),
  ]);

  const heroTakes: HeroTake[] = (heroRes.data ?? []).map((r) => ({
    id: r.id,
    order_index: r.order_index,
    tiles: Array.isArray(r.tiles) ? (r.tiles as HeroTile[]) : [],
    published: r.published,
  }));

  // Flatten for mobile
  const heroTakesMobile: HeroTake[] = heroTakes.flatMap((take, idx) =>
    take.tiles.map((tile, tileIdx) => ({
      id: `${take.id}-${tileIdx}`,
      order_index: idx * 10 + tileIdx,
      tiles: [tile],
      published: true,
    }))
  );

  const team: TeamMember[] = (teamRes.data ?? []) as TeamMember[];
  const founder = team.find((t) => t.is_founder) ?? team[0] ?? null;

  return {
    heroTakes,
    heroTakesMobile,
    projects: (projRes.data ?? []) as Project[],
    services: (svcRes.data ?? []) as Service[],
    team,
    founder,
    config: (cfgRes.data as Config) ?? FALLBACK_CONFIG,
  };
}

// Admin fetcher — returns everything including unpublished
export async function fetchAllContentForAdmin(): Promise<{
  heroTakes: HeroTake[];
  projects: Project[];
  services: Service[];
  team: TeamMember[];
  config: Config;
}> {
  const [heroRes, projRes, svcRes, teamRes, cfgRes] = await Promise.all([
    supabase.from('hero_takes').select('*').order('order_index'),
    supabase.from('projects').select('*').order('order_index'),
    supabase.from('services').select('*').order('order_index'),
    supabase.from('team').select('*').order('order_index'),
    supabase.from('config').select('*').eq('id', 1).single(),
  ]);

  return {
    heroTakes: (heroRes.data ?? []).map((r) => ({
      id: r.id,
      order_index: r.order_index,
      tiles: Array.isArray(r.tiles) ? (r.tiles as HeroTile[]) : [],
      published: r.published,
    })),
    projects: (projRes.data ?? []) as Project[],
    services: (svcRes.data ?? []) as Service[],
    team: (teamRes.data ?? []) as TeamMember[],
    config: (cfgRes.data as Config) ?? FALLBACK_CONFIG,
  };
}

// ═════════════════════════════════════════════════════════════
// UTIL — Vimeo ID extraction
// ═════════════════════════════════════════════════════════════

export function parseVideoInput(input: string): { url: string; type: 'vimeo' | 'mp4' | null } {
  const trimmed = input.trim();
  if (!trimmed) return { url: '', type: null };

  // Pure numeric string → treat as Vimeo ID
  if (/^\d+$/.test(trimmed)) {
    return { url: trimmed, type: 'vimeo' };
  }

  // Vimeo URL
  const vimeoMatch = trimmed.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeoMatch) {
    return { url: vimeoMatch[1], type: 'vimeo' };
  }

  // MP4/WebM direct URL
  if (/\.(mp4|webm|mov)(\?|$)/i.test(trimmed)) {
    return { url: trimmed, type: 'mp4' };
  }

  // Supabase storage URL — assume video if they gave us one
  if (trimmed.includes('/storage/v1/object/public/')) {
    return { url: trimmed, type: 'mp4' };
  }

  // Default: treat as MP4 URL
  return { url: trimmed, type: 'mp4' };
}

export function vimeoEmbedUrl(vimeoId: string, opts: { autoplay?: boolean; loop?: boolean; muted?: boolean } = {}): string {
  const params = new URLSearchParams({
    autoplay: opts.autoplay ? '1' : '0',
    loop: opts.loop ? '1' : '0',
    muted: opts.muted ? '1' : '0',
    background: opts.autoplay && opts.loop ? '1' : '0',
    controls: '0',
    title: '0',
    byline: '0',
    portrait: '0',
  });
  return `https://player.vimeo.com/video/${vimeoId}?${params.toString()}`;
}

// ═════════════════════════════════════════════════════════════
// STATIC CONSTANTS (not content — structural)
// ═════════════════════════════════════════════════════════════

export const NAV_ITEMS = [
  { label: 'Work',     href: '#work' },
  { label: 'Services', href: '#services' },
  { label: 'Studio',   href: '#studio' },
  { label: 'Contact',  href: '#contact' },
];
