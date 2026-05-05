-- ═══════════════════════════════════════════════════════════════
-- Path 11 — Supabase schema
-- Run this in the Supabase SQL editor: https://supabase.com/dashboard
-- This wipes the previous Path 11 tables and rebuilds from scratch.
-- ═══════════════════════════════════════════════════════════════

-- Drop old tables if they exist (safe: no-op if not present)
drop table if exists hero_takes cascade;
drop table if exists projects cascade;
drop table if exists services cascade;
drop table if exists team cascade;
drop table if exists config cascade;

-- Legacy tables from the previous Path 11 site — drop them too
drop table if exists reels cascade;
drop table if exists ai_videos cascade;

-- ─── Extensions ──────────────────────────────────────────────
create extension if not exists "pgcrypto";

-- ─── Hero takes ──────────────────────────────────────────────
create table hero_takes (
  id           uuid primary key default gen_random_uuid(),
  order_index  int  not null default 0,
  tiles        jsonb not null default '[]'::jsonb,
  -- Each tile: { label, meta, image_url, video_url, video_type }
  -- video_type: 'vimeo' | 'mp4' | null
  published    boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- ─── Projects (work grid) ────────────────────────────────────
create table projects (
  id           uuid primary key default gen_random_uuid(),
  slug         text unique not null,
  order_index  int not null default 0,
  title        text not null,
  location     text,
  category     text,
  year         text,
  services     text[] not null default '{}',
  image_url    text,
  video_url    text,
  video_type   text,                     -- 'vimeo' | 'mp4' | null
  media        jsonb not null default '[]'::jsonb,
  -- Each gallery item: { kind: 'image' | 'vimeo' | 'mp4', url: string }
  description  text,
  size         text not null default 'wide', -- 'hero' | 'tall' | 'wide' | 'square'
  published    boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- If you already ran the schema before the `media` column was added, run:
--   alter table projects add column if not exists media jsonb not null default '[]'::jsonb;

-- ─── Services ────────────────────────────────────────────────
create table services (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,
  order_index   int not null default 0,
  num           text not null,           -- '01', '02', etc
  nav           text not null,           -- 'Films'
  title         text not null,           -- 'Cinematic Brand Films'
  summary       text,
  description   text,
  deliverables  text[] not null default '{}',
  thumb_image_url text,
  published     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ─── Team ────────────────────────────────────────────────────
create table team (
  id           uuid primary key default gen_random_uuid(),
  order_index  int not null default 0,
  name         text not null,
  role         text not null,
  bio          text,
  photo_url    text,
  is_founder   boolean not null default false,
  published    boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- ─── Config (singleton row) ──────────────────────────────────
create table config (
  id             int primary key default 1 check (id = 1),
  tagline        text,
  sub_copy       text,
  founder_quote  text,
  email          text default 'hello@path11.com',
  studios        text[] not null default '{London,Dubai,"New York",Sydney}',
  updated_at     timestamptz not null default now()
);

-- ─── Row-level security ──────────────────────────────────────
-- Permissive policies — writes are gated at the app level by PIN auth.
-- If you need stricter security later, swap these for policies that
-- require a JWT claim.
alter table hero_takes enable row level security;
alter table projects   enable row level security;
alter table services   enable row level security;
alter table team       enable row level security;
alter table config     enable row level security;

create policy "public read hero_takes"  on hero_takes for select using (true);
create policy "public read projects"    on projects   for select using (true);
create policy "public read services"    on services   for select using (true);
create policy "public read team"        on team       for select using (true);
create policy "public read config"      on config     for select using (true);

create policy "public write hero_takes" on hero_takes for all using (true) with check (true);
create policy "public write projects"   on projects   for all using (true) with check (true);
create policy "public write services"   on services   for all using (true) with check (true);
create policy "public write team"       on team       for all using (true) with check (true);
create policy "public write config"     on config     for all using (true) with check (true);

-- ─── Storage bucket for uploads ──────────────────────────────
insert into storage.buckets (id, name, public)
  values ('media', 'media', true)
  on conflict (id) do nothing;

drop policy if exists "media public read" on storage.objects;
drop policy if exists "media public write" on storage.objects;
drop policy if exists "media public delete" on storage.objects;

create policy "media public read"   on storage.objects for select using (bucket_id = 'media');
create policy "media public write"  on storage.objects for insert with check (bucket_id = 'media');
create policy "media public delete" on storage.objects for delete using (bucket_id = 'media');
create policy "media public update" on storage.objects for update using (bucket_id = 'media') with check (bucket_id = 'media');

-- ═══════════════════════════════════════════════════════════════
-- SEED DATA — mirrors the current hardcoded content
-- ═══════════════════════════════════════════════════════════════

insert into config (id, tagline, sub_copy, founder_quote, email) values (
  1,
  'One studio for the full story of a hotel. Filmed, built, launched, and grown.',
  'Eight disciplines, four studios, one creative team. We shoot the film and we build the website it lives on. We run the social channels it gets cut into. We spend the marketing budget that gets guests through the door.',
  'We started Path 11 because the hospitality industry deserved one team for the entire story of a hotel — the film, the website, the social, the bookings. Not four agencies. Not four invoices. Not four different answers to what the brand is.',
  'hello@path11.com'
);

-- Hero takes — 6 configurations, mix of single + three-up
insert into hero_takes (order_index, tiles) values
  (1, '[{"label":"The Aman Nai Lert","meta":"Bangkok / Brand Film / 2025"}]'::jsonb),
  (2, '[{"label":"One Barangaroo","meta":"Sydney / Launch Film"},{"label":"Park Hyatt Kyoto","meta":"Japan / Seasonal"},{"label":"Mandarin Oriental","meta":"Lago di Como"}]'::jsonb),
  (3, '[{"label":"Rosewood Miramar","meta":"Montecito / Resort Film / 2024"}]'::jsonb),
  (4, '[{"label":"The Lana Dubai","meta":"Dubai / Hero Film"},{"label":"The Aman Nai Lert","meta":"Bangkok"},{"label":"Rosewood Miramar","meta":"Montecito"}]'::jsonb),
  (5, '[{"label":"Mandarin Oriental","meta":"Lago di Como / Brand Film / 2023"}]'::jsonb),
  (6, '[{"label":"Park Hyatt Kyoto","meta":"Japan"},{"label":"One Barangaroo","meta":"Sydney"},{"label":"The Aman Nai Lert","meta":"Bangkok"}]'::jsonb);

-- Projects
insert into projects (slug, order_index, title, location, category, year, services, size) values
  ('aman-nai-lert',    1, 'The Aman Nai Lert', 'Bangkok',       'Luxury Hotel', '2025', '{"Brand Film","Aerial","Photography"}',   'hero'),
  ('one-barangaroo',   2, 'One Barangaroo',    'Sydney',        'Real Estate',  '2025', '{"Launch Film","Aerial","Lifestyle"}',    'tall'),
  ('rosewood-miramar', 3, 'Rosewood Miramar',  'Montecito',     'Resort Film',  '2024', '{"Brand Film","Social","Website"}',       'wide'),
  ('lana-dubai',       4, 'The Lana Dubai',    'Dubai',         'Hotel Launch', '2024', '{"Hero Film","Website","Marketing"}',     'square'),
  ('park-hyatt-kyoto', 5, 'Park Hyatt Kyoto',  'Japan',         'Brand Film',   '2024', '{"Seasonal Film","Photography","Social"}','wide'),
  ('mandarin-oriental',6, 'Mandarin Oriental', 'Lago di Como',  'Luxury Hotel', '2023', '{"Brand Film","FPV","Website"}',          'tall');

-- Services (8)
insert into services (slug, order_index, num, nav, title, summary, description, deliverables) values
  ('films',     1, '01', 'Films',     'Cinematic Brand Films',      'Narrative. Architectural. Uncompromising.',              'Story-driven films that define luxury experiences. Shot on cinema-grade 4K, 6K, and 8K, directed by a team who came up through features and high-end commercial. Every frame earns its place.', '{"Brand Films","Launch Campaigns","Hero Content","Documentary"}'),
  ('aerial',    2, '02', 'Aerial',    'Aerial & FPV',               'Reveals that render the familiar extraordinary.',        'Licensed cinematic drone and FPV operations across 40+ countries. We fly what most studios subcontract — tighter creative control, frames that are genuinely ours.', '{"FPV Sequences","Architectural Reveals","Topographical","Lifestyle Aerial"}'),
  ('post',      3, '03', 'Post',      'Post Production',            'Colour, sound, finish — in-house.',                       'Hollywood-grade colour science, immersive sound design, and VFX handled under one roof. Nothing shipped to third-party post houses. The look you signed off on is the look that ships.', '{"Colour Grade","Sound Design","VFX & Compositing","Finishing"}'),
  ('stills',    4, '04', 'Stills',    'Stills & Photography',       'One crew. One visual language.',                          'Architectural, editorial, and lifestyle stills shot alongside motion — same directors, same lens choices, same colour language. Your film and your stills finally feel like the same brand.', '{"Architectural","Editorial","Lifestyle","Campaign"}'),
  ('ai',        5, '05', 'AI',        'AI & Generative Video',      'The impossible shot, rendered.',                          'Pre-opening teasers before the walls are painted. Impossible camera moves. Dream sequences. We combine generative video with traditional craft so the seam never shows.', '{"Concept Films","Pre-opening Teasers","Generative Sequences"}'),
  ('websites',  6, '06', 'Websites',  'Website Build',              'The film''s other home.',                                  'Fast, cinematic, bookable. We build hotel websites in Next.js — editorial layouts, proper performance, and booking engines that convert. The film is the hero; the site is the room it plays in.', '{"Bespoke Site Build","Booking Integration","Headless CMS","Performance & SEO"}'),
  ('social',    7, '07', 'Social',    'Social Media',               'The film, cut a hundred ways.',                           'Managed channels built from your production footage — Reels, Stories, long-form. Weekly rhythm, original stills, responses within the hour. Our editors sit in your feed as well as your edit suite.', '{"Channel Management","Daily Content","Community","Creator Partnerships"}'),
  ('marketing', 8, '08', 'Marketing', 'Digital Marketing',          'Films that book rooms.',                                  'Paid media, retargeting, metasearch, and CRM — built around your film, not bolted on. We measure on heads in beds, not impressions. One agency for the creative and the spend.', '{"Paid Social & Search","Metasearch & OTA","CRM & Email","Attribution & Reporting"}');

-- Team
insert into team (order_index, name, role, bio, is_founder) values
  (1, 'Alex Morgan',  'Founder & Director',      'Fifteen years directing for Four Seasons, Aman, and Rosewood. Previously head of film at a London agency.', true),
  (2, 'Suki Tanaka',  'Director of Photography', 'Award-winning DP with a feature-film background. Specialist in natural light and architectural storytelling.', false),
  (3, 'James Osei',   'Head of Post & Web',      'Colourist, editor, and web build lead. Previously at MPC and Framestore. Obsessive about every frame and every millisecond of page load.', false),
  (4, 'Lena Vogt',    'Head of Digital',         'Runs social, paid, and CRM. Background in performance marketing for luxury hospitality groups across Europe and the Middle East.', false);

-- ── Migration: client logos ──
-- Adds a nullable column for an SVG/PNG client logo rendered centred over each
-- project card on the home page. Run this against the live database — existing
-- rows are unaffected because the column is nullable.
alter table projects add column if not exists client_logo_url text;
