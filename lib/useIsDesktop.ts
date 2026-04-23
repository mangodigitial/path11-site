'use client';

import { useEffect, useState } from 'react';

/**
 * Returns true if the viewport is ≥ breakpoint px wide.
 * Defaults to `true` on the server and first paint, so desktop users don't
 * see a mobile flash. Mobile users see one frame of desktop layout before
 * the effect fires, which is fine because the hero video/gradient is still
 * loading anyway.
 */
export function useIsDesktop(breakpoint = 768): boolean {
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${breakpoint}px)`);
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, [breakpoint]);

  return isDesktop;
}
