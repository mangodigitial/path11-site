'use client';

import { type HeroTile, vimeoEmbedUrl } from '@/lib/content';

type Props = {
  tiles: HeroTile[];
  studios: string[];
};

export default function Hero({ tiles, studios }: Props) {
  const count = tiles.length;

  return (
    <section id="top" className="relative h-screen min-h-[640px] md:min-h-[720px] overflow-hidden">
      <div
        className="absolute inset-0 grid transition-[grid-template-columns] duration-700 ease-[cubic-bezier(.2,.8,.2,1)]"
        style={{
          gridTemplateColumns: count === 1 ? '1fr' : count === 2 ? '1fr 1fr' : '1fr 1fr 1fr',
          gap: count > 1 ? '2px' : '0',
        }}
      >
        {tiles.map((t, i) => (
          <div key={`${t.label}-${i}`} className="relative overflow-hidden animate-fade-up"
               style={{ animationDelay: `${i * 80}ms` }}>
            <TileMedia tile={t} />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/70 pointer-events-none" />

            {count > 1 && (
              <div className="absolute bottom-8 left-6 md:left-8 right-6 z-10">
                <h3 className="font-serif text-[18px] md:text-[22px] leading-tight text-white">{t.label}</h3>
                <div className="font-display text-[11px] md:text-[12px] tracking-[0.02em] text-white/60 mt-1">{t.meta}</div>
              </div>
            )}

            {count === 1 && (
              <div className="absolute bottom-24 left-1/2 -translate-x-1/2 text-center z-10 px-6 w-full max-w-[520px]">
                <div className="font-serif text-[18px] md:text-[22px] leading-tight text-white/90 mb-1">{t.label}</div>
                <div className="font-display text-[11px] tracking-[0.02em] text-white/50">{t.meta}</div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Logotype */}
      <div className="absolute inset-x-0 top-0 z-10 px-5 pointer-events-none" style={{ mixBlendMode: 'difference' }}>
        <h1 className="text-center text-white select-none font-display"
            style={{ fontSize: 'clamp(72px, 18vw, 340px)', lineHeight: 0.85, letterSpacing: '-0.045em', transform: 'translateY(60px)' }}>
          <span className="font-black">PATH</span> <span className="font-thin">11</span>
        </h1>
      </div>

      <div className="absolute left-6 md:left-10 right-6 md:right-10 bottom-6 md:bottom-7 z-[5] flex justify-between items-end text-white/60">
        <div className="hidden sm:flex gap-5 font-display text-[12px] tracking-[0.02em]">
          {studios.map((s, i) => (
            <span key={s} className="flex items-center gap-5">
              {s}{i < studios.length - 1 && <span className="text-white/30">/</span>}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-3 font-display text-[12px] tracking-[0.02em]">
          <span>Scroll</span>
          <span className="w-6 h-6 border border-white/30 rounded-full grid place-items-center relative">
            <span className="w-1 h-1 bg-white rounded-full animate-bob" />
          </span>
        </div>
      </div>
    </section>
  );
}

/**
 * Renders the best available media for a tile:
 *   video_url (vimeo) → iframe embed
 *   video_url (mp4)   → <video autoplay muted loop>
 *   image_url         → <img>
 *   neither           → animated gradient fallback
 */
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
        <img src={image_url} alt={tile.label}
             className="absolute inset-0 w-full h-full object-cover" />
      </div>
    );
  }

  // Fallback — cinematic gradient so the tile still looks intentional empty
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
