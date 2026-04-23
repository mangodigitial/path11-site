import { type Project } from '@/lib/content';

type Props = { projects: Project[] };

export default function WorkGrid({ projects }: Props) {
  if (projects.length === 0) return null;

  // Rough layout pattern that works for any count of projects:
  // first gets full-width, then alternate tall+wide rows
  const rows: Project[][] = [];
  let rest = [...projects];
  if (rest.length) rows.push([rest.shift()!]);
  while (rest.length >= 2) {
    rows.push([rest.shift()!, rest.shift()!]);
  }
  if (rest.length) rows.push([rest.shift()!]);

  return (
    <section id="work" className="px-6 md:px-10 pb-24 md:pb-36">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex justify-between items-baseline mb-12 md:mb-16">
          <div>
            <div className="font-display text-[11px] tracking-[0.02em] text-cream-muted mb-3">Work / Selected</div>
            <h2 className="font-serif font-light text-[clamp(32px,4vw,56px)] leading-[1.05] tracking-[-0.02em]">Recent work.</h2>
          </div>
          <div className="font-display text-[11px] tracking-[0.02em] text-cream-muted">
            <span className="text-brass">{projects.length.toString().padStart(3, '0')}</span> / live
          </div>
        </div>

        <div className="space-y-5">
          {rows.map((row, i) => {
            if (row.length === 1) {
              return <ProjectCard key={row[0].id} project={row[0]} aspectClass="aspect-[21/9]" />;
            }
            // Alternate [1fr,2fr] and [2fr,1fr] per row for editorial rhythm
            const reverse = i % 2 === 0;
            return (
              <div key={i} className={`grid grid-cols-1 md:grid-cols-[${reverse ? '1fr_2fr' : '2fr_1fr'}] gap-5`}
                   style={{ gridTemplateColumns: typeof window === 'undefined'
                     ? undefined
                     : undefined }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:col-span-1" style={{ display: 'contents' }}>
                  <ProjectCard project={row[0]} aspectClass={reverse ? 'aspect-[4/5]' : 'aspect-[16/10]'} />
                  <ProjectCard project={row[1]} aspectClass={reverse ? 'aspect-[16/10]' : 'aspect-[4/5]'} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project, aspectClass }: { project: Project; aspectClass: string }) {
  return (
    <a href={`#project-${project.slug}`}
       className={`relative block overflow-hidden group cursor-pointer ${aspectClass}`}>
      {/* Media */}
      {project.image_url ? (
        <img src={project.image_url} alt={project.title}
             className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(.2,.8,.2,1)] group-hover:scale-[1.04]" />
      ) : (
        <div
          className="absolute inset-0 transition-transform duration-[1200ms] ease-[cubic-bezier(.2,.8,.2,1)] group-hover:scale-[1.04]"
          style={{ background: 'radial-gradient(ellipse at 40% 50%, rgba(201,169,97,0.4), transparent 60%), linear-gradient(160deg, #1a1410, #0a0806)' }}
        />
      )}

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80" />

      <div className="absolute bottom-6 left-6 right-6 z-10 flex justify-between items-end text-white">
        <div>
          <div className="font-display text-[11px] tracking-[0.02em] text-white/60 mb-2">
            {[project.year, project.location].filter(Boolean).join(' / ')}
          </div>
          <h3 className="font-serif text-[clamp(22px,2.5vw,32px)] leading-tight mb-2">{project.title}</h3>
          {project.services.length > 0 && (
            <div className="font-display text-[11px] tracking-[0.02em] text-white/70 flex gap-3 flex-wrap">
              {project.services.map((s, i) => (
                <span key={s} className="flex items-center gap-3">
                  {s}{i < project.services.length - 1 && <span className="text-white/30">/</span>}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="w-10 h-10 border border-white/40 rounded-full grid place-items-center shrink-0 group-hover:bg-brass group-hover:border-brass group-hover:text-ink transition-all duration-500">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor"><path d="M2 1 L9 5 L2 9 Z" /></svg>
        </div>
      </div>

      {project.category && (
        <div className="absolute top-6 right-6 z-10 font-display text-[11px] tracking-[0.02em] text-white/70 bg-white/5 backdrop-blur-sm px-2.5 py-1 border border-white/10">
          {project.category}
        </div>
      )}
    </a>
  );
}
