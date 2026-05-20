'use client';

import { useEffect, useState } from 'react';
import { type HeroTile, type SiteContent, vimeoEmbedUrl } from '@/lib/content';
import { useIsDesktop } from '@/lib/useIsDesktop';

const AUTO_ADVANCE_MS = 7000;

export default function HoldingClient({ content }: { content: SiteContent }) {
  const isDesktop = useIsDesktop();
  const takes = isDesktop ? content.heroTakes : content.heroTakesMobile;

  const [idx, setIdx] = useState(0);
  const total = Math.max(1, takes.length);
  const safe = takes.length > 0 ? idx % takes.length : 0;
  const tiles = takes[safe]?.tiles ?? [];

  useEffect(() => {
    if (takes.length <= 1) return;
    const t = setInterval(() => setIdx(i => i + 1), AUTO_ADVANCE_MS);
    return () => clearInterval(t);
  }, [takes.length]);

  const email = content.config.email;

  return (
    <main className="relative h-screen min-h-[640px] md:min-h-[720px] overflow-hidden">
      {/* Showreel tiles — same layout as the live Hero */}
      <Showreel tiles={tiles} key={safe} />

      {/* Vignette over the footage so the holding copy stays legible */}
      <div className="absolute inset-0 bg-black/35 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/70 pointer-events-none" />

      {/* Wordmark, blends with the footage like the live header */}
      <div className="absolute inset-x-0 top-0 z-10 px-5 pointer-events-none" style={{ mixBlendMode: 'difference' }}>
        <h1
          className="text-center text-white select-none font-display"
          style={{
            fontSize: 'clamp(72px, 18vw, 340px)',
            lineHeight: 0.85,
            letterSpacing: '-0.045em',
            transform: 'translateY(60px)',
          }}
        >
          <span className="font-black">PATH</span> <span className="font-thin">11</span>
        </h1>
      </div>

      {/* Holding copy */}
      <div className="absolute inset-x-0 bottom-[18%] md:bottom-[22%] z-10 flex flex-col items-center px-6 text-center">
        <div className="font-display text-[11px] md:text-[12px] tracking-[0.32em] text-white/60 uppercase mb-5 animate-fade-up">
          A new chapter
        </div>
        <p
          className="font-serif text-white/95 leading-[1.15] max-w-[820px] animate-fade-up"
          style={{ fontSize: 'clamp(26px, 4.2vw, 56px)', animationDelay: '120ms' }}
        >
          Something cinematic is on the way.
        </p>
        <p
          className="mt-5 font-display text-[13px] md:text-[15px] tracking-[0.01em] text-white/70 max-w-[560px] animate-fade-up"
          style={{ animationDelay: '240ms' }}
        >
          We&rsquo;re crafting the next iteration of Path 11 &mdash; new films, new stories,
          new ways to spend time with the places we love. Back soon.
        </p>

        {email && (
          <a
            href={`mailto:${email}`}
            className="mt-9 inline-block font-display text-[13px] md:text-[14px] tracking-[0.02em] text-white border-b border-white/50 pb-1 hover:border-white transition-colors animate-fade-up"
            style={{ animationDelay: '360ms' }}
          >
            Start a project &mdash; {email}
          </a>
        )}
      </div>

      {/* Reel indicators — click to jump, mirrors the "next take" affordance */}
      {takes.length > 1 && (
        <div className="absolute inset-x-0 bottom-7 md:bottom-9 z-10 flex justify-center gap-2.5">
          {takes.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              aria-label={`Show reel ${i + 1} of ${total}`}
              className={`h-[3px] rounded-full transition-all duration-500 ${
                i === safe ? 'w-9 bg-white' : 'w-4 bg-white/30 hover:bg-white/60'
              }`}
            />
          ))}
        </div>
      )}
    </main>
  );
}

/**
 * Same multi-tile / single-tile layout as components/Hero.tsx so the showreel
 * looks identical to the live site, minus the per-tile label chrome.
 */
function Showreel({ tiles }: { tiles: HeroTile[] }) {
  const count = tiles.length;
  return (
    <div
      className="absolute inset-0 grid transition-[grid-template-columns] duration-700 ease-[cubic-bezier(.2,.8,.2,1)]"
      style={{
        gridTemplateColumns: count === 1 ? '1fr' : count === 2 ? '1fr 1fr' : '1fr 1fr 1fr',
        gap: count > 1 ? '2px' : '0',
      }}
    >
      {tiles.map((t, i) => (
        <div
          key={`${t.label}-${i}`}
          className="relative overflow-hidden animate-fade-up"
          style={{ animationDelay: `${i * 80}ms` }}
        >
          <TileMedia tile={t} />
        </div>
      ))}
    </div>
  );
}

function TileMedia({ tile }: { tile: HeroTile }) {
  const { video_url, video_type, image_url } = tile;

  if (video_url && video_type === 'vimeo') {
    return (
      <div className="absolute inset-0">
        <iframe
          src={vimeoEmbedUrl(video_url, { autoplay: true, loop: true, muted: true })}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[177.77vh] h-[56.25vw] min-w-full min-h-full"
          allow="autoplay; fullscreen"
          frameBorder={0}
        />
      </div>
    );
  }

  if (video_url && video_type === 'mp4') {
    return (
      <video
        src={video_url}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      />
    );
  }

  if (image_url) {
    return (
      <div className="absolute inset-[-5%] animate-drift">
        <img src={image_url} alt={tile.label} className="absolute inset-0 w-full h-full object-cover" />
      </div>
    );
  }

  return (
    <div
      className="absolute inset-[-5%] animate-drift"
      style={{
        background:
          'radial-gradient(ellipse at 40% 50%, rgba(201,169,97,0.4), transparent 60%), linear-gradient(160deg, #1a1410 0%, #0a0806 100%)',
      }}
    />
  );
}
