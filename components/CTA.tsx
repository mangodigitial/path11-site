import { type Config } from '@/lib/content';

type Props = { config: Config };

export default function CTA({ config }: Props) {
  return (
    <section id="contact" className="px-6 md:px-10 py-24 md:py-36 bg-ink">
      <div className="max-w-[1200px] mx-auto text-center">
        <div className="font-display text-[11px] tracking-[0.02em] text-cream-muted mb-8">
          Contact / Start a project
        </div>

        <h2 className="font-serif font-light text-[clamp(32px,5vw,70px)] leading-[1.08] tracking-[-0.02em] text-cream max-w-[900px] mx-auto">
          Let&apos;s make something worth arriving for.
        </h2>

        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href={`mailto:${config.email}`}
             className="inline-flex items-center gap-4 font-display text-[14px] tracking-[0.01em] text-ink bg-cream hover:bg-brass transition-colors duration-500 px-8 py-4 group">
            <span>Start a project</span>
            <span className="transition-transform duration-500 group-hover:translate-x-1">→</span>
          </a>
          <a href="#work"
             className="inline-flex items-center gap-3 font-display text-[14px] tracking-[0.01em] text-cream border-b border-cream/30 hover:border-cream pb-1 transition-colors">
            See the work
          </a>
        </div>

        <div className="mt-12 font-display text-[13px] tracking-[0.02em] text-cream-muted">
          {config.email}
          <span className="mx-3 text-cream/20">/</span>
          {config.studios.join(' / ')}
        </div>
      </div>
    </section>
  );
}
