'use client';

import { useState } from 'react';
import { type Service } from '@/lib/content';

type Props = { services: Service[] };

export default function Services({ services }: Props) {
  const [active, setActive] = useState(0);
  if (services.length === 0) return null;
  const s = services[Math.min(active, services.length - 1)];

  return (
    <section id="services" className="bg-cream-page text-ink py-28 md:py-40 px-6 md:px-10">
      <div className="max-w-[1600px] mx-auto">
        <div className="mb-16 md:mb-24">
          <div className="font-display text-[11px] tracking-[0.02em] text-ink/50 mb-3">
            Services / 01 to {services.length.toString().padStart(2, '0')}
          </div>
          <h2 className="font-serif font-light text-[clamp(38px,5.5vw,84px)] leading-[1.02] tracking-[-0.025em] max-w-[1100px]">
            From first frame to final booking. All under one roof.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1.1fr_140px_1fr] gap-10 md:gap-16 items-start">
          {/* Left — preview */}
          <div className="relative aspect-[4/5] overflow-hidden transition-all duration-700 ease-[cubic-bezier(.2,.8,.2,1)]"
               style={{ background: s.thumb_image_url ? '#000' : 'radial-gradient(ellipse at 50% 40%, rgba(201,169,97,0.4), transparent 60%), linear-gradient(160deg, #1a1410, #0a0806)' }}>
            {s.thumb_image_url && (
              <img src={s.thumb_image_url} alt={s.title}
                   className="absolute inset-0 w-full h-full object-cover" />
            )}
            <div className="absolute inset-0 pointer-events-none" style={{ boxShadow: 'inset 0 0 80px rgba(0,0,0,0.4)' }} />
            <div className="absolute top-5 left-5 right-5 flex justify-between font-display text-[11px] tracking-[0.02em] text-cream/80">
              <span>{s.num} / {services.length.toString().padStart(2, '0')}</span>
              <span>Path 11</span>
            </div>
            <div className="absolute bottom-5 left-5 right-5">
              <div className="font-serif text-[clamp(26px,3.5vw,44px)] leading-[1.1] text-cream">{s.nav}</div>
            </div>
            {['top-3 left-3', 'top-3 right-3', 'bottom-3 left-3', 'bottom-3 right-3'].map((pos) => (
              <div key={pos} className={`absolute ${pos} w-3 h-3`}>
                <div className="w-full h-px bg-cream/40" />
                <div className="h-full w-px bg-cream/40" />
              </div>
            ))}
          </div>

          {/* Middle — rail */}
          <div>
            <div className="font-display text-[10px] tracking-[0.04em] text-ink/50 uppercase mb-4">Disciplines</div>
            <ul>
              {services.map((sv, i) => (
                <li key={sv.id}>
                  <button onClick={() => setActive(i)}
                          className="group w-full flex items-center gap-3 py-2 text-left"
                          aria-pressed={active === i}>
                    <span className={`font-display text-[11px] tracking-[0.02em] transition-colors ${active === i ? 'text-ink' : 'text-ink/30'}`}>{sv.num}</span>
                    <span className={`h-px transition-all duration-500 ${active === i ? 'w-6 bg-brass-deep' : 'w-3 bg-ink/15 group-hover:w-5 group-hover:bg-ink/40'}`} />
                    <span className={`font-serif text-[17px] transition-colors ${active === i ? 'text-ink' : 'text-ink/50 group-hover:text-ink/80'}`}>{sv.nav}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Right — detail */}
          <div id={s.slug}>
            <div className="font-display text-[11px] tracking-[0.02em] text-brass-deep mb-5">
              {s.num} / {services.length.toString().padStart(2, '0')} — {s.nav}
            </div>
            <h3 className="font-serif font-light text-[clamp(30px,3.5vw,46px)] leading-[1.05] tracking-[-0.02em] mb-3">{s.title}</h3>
            {s.summary && <p className="font-serif text-[20px] text-ink/60 mb-8 leading-snug">{s.summary}</p>}
            {s.description && <p className="font-display text-[17px] leading-[1.6] text-ink/80 mb-10 max-w-[520px]">{s.description}</p>}

            {s.deliverables.length > 0 && (
              <div className="border-t border-ink/10 pt-6">
                <div className="font-display text-[10px] tracking-[0.04em] uppercase text-ink/50 mb-4">What we deliver</div>
                <ul className="grid grid-cols-2 gap-x-6 gap-y-2">
                  {s.deliverables.map((d) => (
                    <li key={d} className="flex items-baseline gap-3 font-serif text-[17px] text-ink/90">
                      <span className="w-1 h-1 bg-brass-deep rounded-full shrink-0 translate-y-[-3px]" />{d}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
