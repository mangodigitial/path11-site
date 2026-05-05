import { type Config } from '@/lib/content';

type Props = {
  config: Config;
};

export default function Tagline({ config }: Props) {
  return (
    <section className="relative px-6 md:px-10 pt-32 md:pt-40 pb-32 md:pb-48">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex flex-wrap items-center gap-4 md:gap-6 mb-12 font-display text-[11px] tracking-[0.02em] text-cream-muted">
          <span>No. 011</span>
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
      </div>
    </section>
  );
}
