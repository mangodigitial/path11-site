import { type TeamMember, type Config } from '@/lib/content';

type Props = {
  team: TeamMember[];
  founder: TeamMember | null;
  config: Config;
};

export default function Team({ team, founder, config }: Props) {
  const others = team.filter((m) => m.id !== founder?.id).slice(0, 3);

  return (
    <section id="studio" className="px-6 md:px-10 py-24 md:py-40 bg-ink">
      <div className="max-w-[1600px] mx-auto">
        <div className="font-display text-[11px] tracking-[0.02em] text-cream-muted mb-12">
          Studio / 012 — Founder statement
        </div>

        {founder && (
          <div className="grid grid-cols-1 md:grid-cols-[1.1fr_1fr] gap-12 md:gap-20 items-start mb-20 md:mb-32">
            <div>
              <blockquote className="font-serif font-light text-[clamp(22px,2.4vw,30px)] leading-[1.35] text-cream max-w-[640px]">
                &ldquo;{config.founder_quote || 'Founder quote goes here.'}&rdquo;
              </blockquote>
              <div className="mt-10 flex items-center gap-4">
                <div className="w-12 h-px bg-brass" />
                <div>
                  <div className="font-serif text-[18px] text-cream">{founder.name}</div>
                  <div className="font-display text-[12px] tracking-[0.02em] text-cream-muted">{founder.role}</div>
                </div>
              </div>
            </div>

            <PortraitFrame person={founder} size="hero" index={1} />
          </div>
        )}

        {others.length > 0 && (
          <>
            <div className="mb-8 font-display text-[11px] tracking-[0.02em] text-cream-muted">
              Heads of department
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-5">
              {others.map((m, i) => (
                <PortraitFrame key={m.id} person={m} size="small" index={i + 2} />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

function PortraitFrame({ person, size, index }: { person: TeamMember; size: 'hero' | 'small'; index: number }) {
  const bgFallbacks = [
    'linear-gradient(135deg, #2a1f14 0%, #1a1410 50%, #0a0806 100%)',
    'linear-gradient(135deg, #101822 0%, #050810 100%)',
    'linear-gradient(135deg, #1a1410 0%, #0a0806 100%)',
    'linear-gradient(135deg, #0f1a18 0%, #060a09 100%)',
  ];

  return (
    <div className={`relative overflow-hidden group ${size === 'hero' ? 'aspect-[5/6] md:aspect-[5/6]' : 'aspect-[4/5]'}`}>
      {person.photo_url ? (
        <img src={person.photo_url} alt={person.name}
             className="absolute inset-0 w-full h-full object-cover" />
      ) : (
        <>
          <div className="absolute inset-0" style={{ background: bgFallbacks[index % bgFallbacks.length] }} />
          <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 40%, rgba(201,169,97,0.2), transparent 60%)' }} />
        </>
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60 pointer-events-none" />

      {size === 'hero' ? (
        <>
          <div className="absolute inset-4 border border-cream/10 pointer-events-none" />
          {['top-4 left-4 border-t border-l', 'top-4 right-4 border-t border-r', 'bottom-4 left-4 border-b border-l', 'bottom-4 right-4 border-b border-r'].map((c) => (
            <div key={c} className={`absolute ${c} w-3 h-3`} style={{ borderColor: 'rgba(201,169,97,0.6)' }} />
          ))}
          <div className="absolute bottom-6 left-6 font-display text-[11px] tracking-[0.02em] text-cream/60">
            No. {index.toString().padStart(3, '0')} / {person.name.split(' ').map((n) => n[0]).join('')}
          </div>
        </>
      ) : (
        <>
          <div className="absolute top-5 left-5 right-5 flex justify-between font-display text-[11px] tracking-[0.02em] text-cream/50">
            <span>{index.toString().padStart(3, '0')}</span>
            <span>{person.role}</span>
          </div>
          <div className="absolute bottom-6 left-6 right-6">
            <h4 className="font-serif text-[clamp(22px,2vw,28px)] leading-tight text-cream mb-1">{person.name}</h4>
            {person.bio && (
              <p className="font-display text-[13px] leading-[1.5] text-cream-muted opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 max-w-[260px]">
                {person.bio}
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
