import { type Service, type Config } from '@/lib/content';

type Props = {
  services: Service[];
  config: Config;
};

export default function Tagline({ services, config }: Props) {
  return (
    <section className="relative px-6 md:px-10 pt-32 md:pt-40 pb-24 md:pb-32">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex flex-wrap items-center gap-4 md:gap-6 mb-12 font-display text-[11px] tracking-[0.02em] text-cream-muted">
          <span>No. 011</span>
          <span className="w-6 h-px bg-cream/20" />
          <span>{config.studios.join(' / ')}</span>
          <span className="w-6 h-px bg-cream/20" />
          <span>Est. 2024</span>
        </div>

        <h2 className="font-serif font-light text-[clamp(38px,6vw,86px)] leading-[1.04] tracking-[-0.02em] max-w-[1300px]">
          {config.tagline || 'One studio for the full story of a hotel. Filmed, built, launched, and grown.'}
        </h2>

        {config.sub_copy && (
          <div className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-[1fr_auto_1.1fr] gap-10 md:gap-16 items-start">
            <div />
            <div className="hidden md:block w-px h-32 bg-cream/10 justify-self-center" />
            <div className="max-w-[520px]">
              <p className="font-serif font-light text-[19px] leading-[1.55] text-cream/90">
                {config.sub_copy}
              </p>
              <p className="font-display text-[13px] tracking-[0.02em] text-cream-muted mt-6">
                Not four agencies. One invoice.
              </p>
            </div>
          </div>
        )}

        {services.length > 0 && (
          <div className="mt-24 md:mt-32">
            <ContactSheet services={services} />
          </div>
        )}
      </div>
    </section>
  );
}

function ContactSheet({ services }: { services: Service[] }) {
  return (
    <div className="relative">
      <div className="flex justify-between items-baseline mb-5 font-display text-[11px] tracking-[0.02em] text-cream-muted">
        <span>Roll 011 / Contact Sheet</span>
        <span>{services.length} disciplines, one crew</span>
      </div>

      <div className="relative p-4 md:p-6" style={{ background: '#060c0e', border: '1px solid rgba(240,232,218,0.06)' }}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {services.map((s) => (
            <a key={s.id} href={`#${s.slug}`} className="group relative block">
              <div className="flex justify-between items-baseline mb-1.5 font-display text-[10px] tracking-[0.02em] text-cream-muted">
                <span className="text-brass">{s.num}A</span>
                <span>/{services.length.toString().padStart(2, '0')}</span>
              </div>

              <div className="relative aspect-[3/4] overflow-hidden" style={{ background: s.thumb_image_url ? 'transparent' : thumbFallback(s.num) }}>
                {s.thumb_image_url && (
                  <img src={s.thumb_image_url} alt={s.nav} className="absolute inset-0 w-full h-full object-cover" />
                )}
                <div className="absolute inset-0 pointer-events-none" style={{ boxShadow: 'inset 0 0 40px rgba(0,0,0,0.4)' }} />
                <div className="absolute inset-0 grid place-items-center">
                  <div className="text-center px-3">
                    <div className="font-serif text-[clamp(18px,2vw,24px)] leading-tight text-cream">{s.nav}</div>
                    <div className="font-display text-[10px] tracking-[0.02em] text-cream/50 mt-2">{s.title}</div>
                  </div>
                </div>
                <div className="absolute inset-2 border-2 border-brass opacity-0 group-hover:opacity-80 transition-opacity duration-300" />
              </div>

              <div className="flex justify-between mt-1.5 px-0.5">
                {Array.from({ length: 6 }).map((_, t) => (
                  <span key={t} className="w-1 h-[3px] bg-cream/10" />
                ))}
              </div>
            </a>
          ))}
        </div>

        <div className="flex justify-between items-baseline mt-5 pt-4 border-t border-cream/5 font-display text-[10px] tracking-[0.02em] text-cream-muted">
          <span>Path 11 / {new Date().getFullYear()}</span>
          <span>Printed on fibre base</span>
          <span>1 : 1</span>
        </div>
      </div>
    </div>
  );
}

// Gradient fallback when no thumbnail uploaded — varies by service num for visual variety
function thumbFallback(num: string) {
  const palette: Record<string, string> = {
    '01': 'radial-gradient(ellipse at 40% 50%, rgba(212,165,116,0.65), transparent 60%), linear-gradient(160deg, #2a1f14, #0e0805)',
    '02': 'radial-gradient(ellipse at 50% 40%, rgba(140,170,200,0.55), transparent 55%), linear-gradient(180deg, #0d1820, #050a10)',
    '03': 'radial-gradient(ellipse at 60% 40%, rgba(160,120,180,0.45), transparent 55%), linear-gradient(160deg, #1a1020, #0a0810)',
    '04': 'radial-gradient(ellipse at 40% 50%, rgba(196,181,160,0.55), transparent 55%), linear-gradient(170deg, #1a1510, #0a0806)',
    '05': 'radial-gradient(ellipse at 50% 50%, rgba(90,180,180,0.5), transparent 55%), linear-gradient(160deg, #0a1a1c, #05100f)',
    '06': 'radial-gradient(ellipse at 60% 40%, rgba(230,220,200,0.4), transparent 55%), linear-gradient(180deg, #15181a, #070a0c)',
    '07': 'radial-gradient(ellipse at 40% 50%, rgba(220,140,130,0.4), transparent 55%), linear-gradient(160deg, #1a1012, #0a0506)',
    '08': 'radial-gradient(ellipse at 50% 40%, rgba(140,170,110,0.4), transparent 55%), linear-gradient(170deg, #121812, #060a06)',
  };
  return palette[num] || palette['01'];
}
