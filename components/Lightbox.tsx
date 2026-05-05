'use client';

import { useEffect, useState } from 'react';
import { type ProjectMedia } from '@/lib/content';

type Props = {
  items: ProjectMedia[];
  startIndex?: number;
  title?: string;
  onClose: () => void;
};

export default function Lightbox({ items, startIndex = 0, title, onClose }: Props) {
  const [idx, setIdx] = useState(startIndex);
  const count = items.length;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') setIdx(i => (i + 1) % count);
      if (e.key === 'ArrowLeft')  setIdx(i => (i - 1 + count) % count);
    };
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [count, onClose]);

  if (count === 0) return null;
  const item = items[idx];

  return (
    <div
      className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-sm flex items-center justify-center"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={title || 'Project gallery'}
    >
      {/* Close */}
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        className="absolute top-5 right-5 md:top-8 md:right-8 w-10 h-10 grid place-items-center text-white/70 hover:text-white border border-white/20 hover:border-white/60 rounded-full transition-colors z-10"
        aria-label="Close"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M1 1 L13 13 M13 1 L1 13" />
        </svg>
      </button>

      {/* Title + counter */}
      <div className="absolute top-5 left-5 md:top-8 md:left-8 font-display text-[13px] tracking-[0.02em] z-10">
        {title && <span className="mr-3 text-white">{title}</span>}
        <span className="tabular-nums text-white/70">{String(idx + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}</span>
      </div>

      {/* Prev */}
      {count > 1 && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); setIdx(i => (i - 1 + count) % count); }}
          className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 w-14 h-14 md:w-16 md:h-16 grid place-items-center text-white bg-black/40 hover:bg-black/70 border border-white/50 hover:border-white rounded-full transition-colors z-10 backdrop-blur-sm"
          aria-label="Previous"
        >
          <svg width="18" height="18" viewBox="0 0 14 14" fill="currentColor"><path d="M9 1 L3 7 L9 13 Z" /></svg>
        </button>
      )}

      {/* Next */}
      {count > 1 && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); setIdx(i => (i + 1) % count); }}
          className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 w-14 h-14 md:w-16 md:h-16 grid place-items-center text-white bg-black/40 hover:bg-black/70 border border-white/50 hover:border-white rounded-full transition-colors z-10 backdrop-blur-sm"
          aria-label="Next"
        >
          <svg width="18" height="18" viewBox="0 0 14 14" fill="currentColor"><path d="M5 1 L11 7 L5 13 Z" /></svg>
        </button>
      )}

      {/* Media stage */}
      <div className="relative w-[92vw] h-[82vh] max-w-[1600px]" onClick={(e) => e.stopPropagation()}>
        <MediaPlayer key={`${idx}-${item.url}`} item={item} />
      </div>

      {/* Dot indicator + nav hint */}
      {count > 1 && (
        <div
          className="absolute bottom-5 md:bottom-7 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-2">
            {items.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIdx(i)}
                aria-label={`Go to item ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${i === idx ? 'w-8 bg-white' : 'w-1.5 bg-white/40 hover:bg-white/70'}`}
              />
            ))}
          </div>
          <div className="font-display text-[11px] tracking-[0.08em] text-white/50 uppercase">
            Use arrows or ← → keys
          </div>
        </div>
      )}
    </div>
  );
}

function MediaPlayer({ item }: { item: ProjectMedia }) {
  if (item.kind === 'vimeo') {
    const src = `https://player.vimeo.com/video/${item.url}?autoplay=1&title=0&byline=0&portrait=0`;
    return (
      <iframe
        src={src}
        className="absolute inset-0 w-full h-full"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        frameBorder={0}
      />
    );
  }

  if (item.kind === 'mp4') {
    return (
      <video
        src={item.url}
        autoPlay
        controls
        playsInline
        className="absolute inset-0 w-full h-full object-contain bg-black"
      />
    );
  }

  return (
    <img
      src={item.url}
      alt=""
      className="absolute inset-0 w-full h-full object-contain"
    />
  );
}
