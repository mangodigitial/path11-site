'use client';

import { NAV_ITEMS } from '@/lib/content';

type Props = {
  current: number;
  total: number;
  onAdvance: () => void;
};

export default function TopBar({ current, total, onAdvance }: Props) {
  const cur = current.toString().padStart(2, '0');
  const tot = total.toString().padStart(2, '0');

  return (
    <header
      className="fixed top-0 left-0 right-0 z-[100] px-6 md:px-10 py-5 md:py-7 flex justify-between items-center"
      style={{ mixBlendMode: 'difference' }}
    >
      <div className="flex items-center gap-8 md:gap-12 text-white">
        <a href="#top" className="font-display font-black text-[15px] tracking-[-0.02em] leading-none">
          P<span className="font-thin">11</span>
        </a>
        <nav className="hidden md:flex gap-7">
          {NAV_ITEMS.map((item) => (
            <a key={item.label} href={item.href}
               className="font-display font-medium text-[13px] tracking-[0.01em] text-white/80 hover:text-white transition-colors">
              {item.label}
            </a>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-4 sm:gap-6 md:gap-8 text-white">
        <a href="#contact"
           className="hidden sm:inline-block font-display font-medium text-[13px] tracking-[0.01em] border-b border-white/60 pb-0.5 hover:border-white transition-colors">
          Start a project
        </a>
        <button onClick={onAdvance}
                className="flex items-center gap-2.5 font-display font-medium text-[13px] md:text-[14px] tracking-[0.01em] text-white border border-white/60 hover:border-white hover:bg-white/10 px-3.5 py-2 rounded-full transition-colors group"
                aria-label={`Advance to next take. Currently take ${cur} of ${tot}.`}>
          <span>Next take</span>
          <span className="tabular-nums text-white/70 group-hover:text-white transition-colors">{cur}/{tot}</span>
          <svg width="18" height="11" viewBox="0 0 16 10" fill="none"
               className="transition-transform duration-400 ease-[cubic-bezier(.2,.8,.2,1)] group-hover:translate-x-1" aria-hidden>
            <path d="M1 5 h9 M7 2 l3 3 l-3 3" stroke="currentColor" strokeWidth="1.4" fill="none" />
            <line x1="13" y1="0" x2="13" y2="10" stroke="currentColor" strokeWidth="1.4" opacity="0.6" />
            <line x1="15" y1="0" x2="15" y2="10" stroke="currentColor" strokeWidth="1.4" opacity="0.35" />
          </svg>
        </button>
      </div>
    </header>
  );
}
