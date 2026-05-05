'use client';

import { useState } from 'react';
import TopBar from '@/components/TopBar';
import Hero from '@/components/Hero';
import Tagline from '@/components/Tagline';
import WorkGrid from '@/components/WorkGrid';
import Services from '@/components/Services';
import Team from '@/components/Team';
import CTA from '@/components/CTA';
import Footer from '@/components/Footer';
import { useIsDesktop } from '@/lib/useIsDesktop';
import { type SiteContent } from '@/lib/content';

export default function HomeClient({ content }: { content: SiteContent }) {
  const isDesktop = useIsDesktop();
  const takes = isDesktop ? content.heroTakes : content.heroTakesMobile;

  const [idx, setIdx] = useState(0);
  const safe = takes.length > 0 ? idx % takes.length : 0;
  const tiles = takes[safe]?.tiles ?? [];

  return (
    <main>
      <TopBar current={Math.max(1, safe + 1)} total={Math.max(1, takes.length)} onAdvance={() => setIdx(i => i + 1)} />
      <Hero tiles={tiles} />
      <Tagline config={content.config} />
      <WorkGrid projects={content.projects} />
      <Services services={content.services} />
      <Team team={content.team} founder={content.founder} config={content.config} />
      <CTA config={content.config} />
      <Footer config={content.config} />
    </main>
  );
}
