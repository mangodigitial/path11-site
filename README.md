# Path 11

Cinema for the world's most inspired places. Next.js 14 + Tailwind + Supabase-backed CMS.

## Stack

- **Next.js 14** (App Router, React Server Components)
- **TypeScript** (strict)
- **Tailwind CSS** (custom theme)
- **Supabase** (Postgres + Storage) — content and media
- **next/font** — Archivo, Fraunces, JetBrains Mono (self-hosted, zero layout shift)

## Setup

### 1. Supabase

If you still have the old Path 11 Supabase project, sign in at <https://supabase.com/dashboard> — you'll reuse it. If starting fresh, create a new project.

Go to **SQL Editor → New query**, paste the entire contents of `supabase-schema.sql`, and run it. This:
- Drops the old `hero_takes`, `projects`, `services`, `team`, `config`, `reels`, `ai_videos` tables (if present)
- Creates the new schema with RLS policies
- Creates the public `media` storage bucket with upload policies
- Seeds the tables with the current site content so the public site looks right immediately

### 2. Environment variables

Copy `.env.example` to `.env.local` and fill in:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
ADMIN_PIN=choose-a-strong-pin
```

Get the URL and anon key from **Supabase → Settings → API**. The `ADMIN_PIN` is server-only — it's never sent to the browser. Rotate it whenever you want by updating the env var in Vercel.

### 3. Install and run

```bash
npm install
npm run dev
```

Public site at <http://localhost:3000>. Admin at <http://localhost:3000/admin>.

### 4. Deploy

Push to GitHub, import into Vercel, add the same three env vars in Vercel's project settings. `npm run build` is the build command, no other config needed.

## Editing content

Everything on the public site is editable at `/admin`. Five sections:

**Hero Takes** — the cycling hero. Each take has 1–3 tiles (desktop shows them side-by-side in a three-up; mobile automatically flattens multi-tile takes into individual full-screen takes). Each tile accepts:
- A label and meta line shown in the caption
- An uploaded image (drops into the `media/hero/` bucket)
- A video — paste a Vimeo URL, Vimeo ID, or a direct `.mp4` URL. Vimeo gets embedded as a background player; direct MP4 renders via `<video>`. If no video, the image is used. If no image either, a cinematic gradient stand-in is used.

**Projects** — the work grid. Same image/video support as hero tiles. The slug is used for hash links (`#project-{slug}`).

**Services** — the 8 disciplines (films, aerial, post, stills, AI, websites, social, marketing). Each gets a thumbnail that appears in the contact-sheet grid in the tagline section and as the preview in the services detail area.

**Team** — founder + department heads. Mark exactly one member as "founder" — their photo anchors the Studio section and their role appears under the founder quote. Others appear in the three-up heads-of-department strip.

**Settings** — tagline, sub-copy, founder quote, contact email, list of studio cities.

### Video hosting recommendation

For production, host videos on **Vimeo Pro/Business** (around $20–50/month). Benefits over self-hosted MP4s:
- Adaptive bitrate (HD on fast connections, SD on slow)
- Global CDN
- Proper mobile/iOS autoplay behaviour
- Background-player mode that removes all controls and loops silently

For a hotel production studio this pays for itself the first time a client watches the hero on LTE without buffering.

If you'd rather self-host: upload a compressed 1080p MP4 (~5 MB for a 15s loop) directly to the `media` bucket via any editor's video field. The Hero renders it with `<video autoPlay muted loop playsInline>`.

## Structure

```
path11-next/
├── supabase-schema.sql   # Run this once in Supabase SQL editor
├── .env.example
├── app/
│   ├── layout.tsx        # Root layout, fonts, metadata
│   ├── page.tsx          # Home — server component, fetches from Supabase
│   ├── HomeClient.tsx    # Client shell holding take-index state
│   ├── globals.css       # Tailwind + cinematic gradients + grain
│   └── admin/
│       ├── page.tsx      # Auth gate
│       ├── LoginForm.tsx # PIN entry
│       ├── AdminShell.tsx # Tabbed editor with all 5 sections
│       └── actions.ts    # Server actions: login, save, delete, etc
├── components/
│   ├── TopBar.tsx        # Nav + Start + Take counter button
│   ├── Hero.tsx          # Tiles with video/image/gradient rendering
│   ├── Tagline.tsx       # Headline + contact sheet
│   ├── WorkGrid.tsx      # Project mosaic
│   ├── Services.tsx      # Cream section, vertical-tab nav
│   ├── Team.tsx          # Founder quote + team portraits
│   ├── CTA.tsx           # Start a Project band
│   └── Footer.tsx        # Wordmark + links + newsletter
├── lib/
│   ├── supabase.ts       # Client + upload/delete helpers
│   ├── content.ts        # Types, fetchers, Vimeo parser
│   └── useIsDesktop.ts   # Viewport hook
└── tailwind.config.ts    # Design tokens
```

## Design tokens

| Token        | Value     | Usage                          |
|--------------|-----------|--------------------------------|
| `ink`        | `#0A1316` | Primary background             |
| `ink-soft`   | `#0D181C` | Lifted surfaces                |
| `cream`      | `#F0E8DA` | Warm body text                 |
| `cream-page` | `#F1ECE1` | Contrast section background    |
| `brass`      | `#C9A961` | Accent                         |
| `brass-deep` | `#8C7239` | Accent on cream bg             |

Fonts:
- **Archivo Black (900)** / **Archivo Thin (100)** — the PATH 11 logotype (weight contrast, no italic)
- **Archivo 400/500** — nav, body, UI labels
- **Fraunces (300)** — serif headlines, taglines, quotes

## Security notes

- The admin PIN is server-side only (`ADMIN_PIN`, not `NEXT_PUBLIC_`), never exposed to the browser. Auth is an `httpOnly` cookie set by a server action.
- Supabase RLS is **permissive** (anyone with the anon key can read/write). The PIN gate on `/admin` is what actually protects writes. If you need defence-in-depth, the path is: add a Supabase JWT auth for the admin user, then tighten the RLS policies to require a valid JWT. The current setup is appropriate for a small team with trusted collaborators.
- The `media` storage bucket is public-read. Don't put anything sensitive in it.

## Roadmap

Things the current build deliberately doesn't do, in rough priority order:
1. `/work/[slug]` individual project pages — the data's all there in `projects`, just need the route.
2. OG image generation — dynamic social cards per project.
3. Rich-text editor for project descriptions (current is plain textarea).
4. Drag-to-reorder in admin (currently numeric `order_index` field).
5. Bulk image upload.
6. Image cropping / thumbnail generation on upload.
7. Newsletter hookup (Mailchimp / Klaviyo / Resend).
8. Analytics.

## License

© Path 11 Productions Ltd. All rights reserved.
