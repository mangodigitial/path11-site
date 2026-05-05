import { type Config } from '@/lib/content';

type Props = { config: Config };

export default function Footer({ config }: Props) {
  return (
    <footer className="bg-cream-page text-ink">
      <div className="px-6 md:px-10 pt-20 md:pt-24 pb-12 md:pb-16">
        <div className="max-w-[1600px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-12">
          <div>
            <div className="font-display text-[11px] font-medium tracking-[0.02em] text-ink/50 mb-4">Studio</div>
            <ul className="space-y-2 font-display text-[15px]">
              <li><a href="#studio"   className="hover:opacity-70 transition-opacity">About</a></li>
              <li><a href="#team"     className="hover:opacity-70 transition-opacity">Team</a></li>
              <li><a href="#journal"  className="hover:opacity-70 transition-opacity">Journal</a></li>
              <li><a href="#careers"  className="hover:opacity-70 transition-opacity">Careers</a></li>
            </ul>
          </div>
          <div>
            <div className="font-display text-[11px] font-medium tracking-[0.02em] text-ink/50 mb-4">Social</div>
            <ul className="space-y-2 font-display text-[15px]">
              <li><a href="#" className="hover:opacity-70 transition-opacity">Instagram</a></li>
              <li><a href="#" className="hover:opacity-70 transition-opacity">Vimeo</a></li>
              <li><a href="#" className="hover:opacity-70 transition-opacity">LinkedIn</a></li>
              <li><a href="#" className="hover:opacity-70 transition-opacity">Behance</a></li>
            </ul>
          </div>
          <div>
            <div className="font-display text-[11px] font-medium tracking-[0.02em] text-ink/50 mb-4">Legal</div>
            <ul className="space-y-2 font-display text-[15px]">
              <li><a href="#" className="hover:opacity-70 transition-opacity">Privacy</a></li>
              <li><a href="#" className="hover:opacity-70 transition-opacity">Terms</a></li>
              <li><a href="#" className="hover:opacity-70 transition-opacity">Imprint</a></li>
            </ul>
          </div>
          <div>
            <div className="font-display text-[11px] font-medium tracking-[0.02em] text-ink/50 mb-3">Dispatch</div>
            <form className="flex items-center border border-ink/20 focus-within:border-ink/60 transition-colors">
              <input type="email" placeholder="Email address"
                     className="flex-1 bg-transparent px-3 py-2.5 font-display text-[13px] focus:outline-none" />
              <button type="submit" className="px-3 py-2.5 hover:bg-ink hover:text-cream-page transition-colors">→</button>
            </form>
          </div>
        </div>

        <div className="max-w-[1600px] mx-auto mt-16 pt-8 flex flex-wrap justify-end items-center gap-4 border-t border-ink/10 font-display text-[12px] tracking-[0.02em] text-ink/60">
          <div>{config.email}</div>
        </div>
      </div>

      {/* Massive wordmark clipped to a cinematic gradient */}
      <div className="relative overflow-hidden" style={{ marginBottom: '-2vw' }}>
        <h2 aria-hidden
            className="text-clip-bg text-center select-none font-display leading-[0.8] tracking-[-0.045em]"
            style={{
              fontSize: 'clamp(100px, 28vw, 520px)',
              backgroundImage:
                'radial-gradient(ellipse at 20% 40%, rgba(212,165,116,0.9), transparent 45%), radial-gradient(ellipse at 60% 60%, rgba(123,163,201,0.7), transparent 50%), radial-gradient(ellipse at 85% 30%, rgba(201,169,97,0.8), transparent 45%), linear-gradient(135deg, #1a1410 0%, #101822 50%, #231a10 100%)',
            }}>
          <span className="font-black">PATH</span> <span className="font-thin">11</span>
        </h2>
      </div>

      <div className="bg-ink text-cream-muted px-6 md:px-10 py-6 flex flex-wrap justify-between items-center gap-3 font-display text-[11px] tracking-[0.02em]">
        <span>© {new Date().getFullYear()} Path 11 Productions Ltd.</span>
        <a href="/admin" className="hover:text-cream transition-colors opacity-40 hover:opacity-100">Admin</a>
        <span>All Rights Reserved</span>
      </div>
    </footer>
  );
}
