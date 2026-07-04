import React from 'react';
import { TEAM } from '../data/team';
import { MemberCard } from '../components/team/MemberCard';
import { Seo } from '../components/Seo';
import { Reveal } from '../components/ui/Reveal';

const Team: React.FC = () => (
  <section className="pt-32 pb-24 bg-white min-h-screen">
    <Seo
      title="Team | Basic Tech"
      description="The people behind Basic Tech — a small team of engineers building software and our own products."
      canonical="https://basictech.in/team"
      jsonLd={{ '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'Basic Tech Team', url: 'https://basictech.in/team' }}
    />
    <div className="container mx-auto px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10 2xl:px-12">
      <Reveal>
        <p className="text-xs sm:text-sm font-semibold tracking-widest text-slate-400 uppercase mb-4">Team</p>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-slate-900 tracking-tight mb-4 max-w-2xl">The people behind the work.</h1>
        <p className="text-base sm:text-lg text-slate-600 font-light mb-12 max-w-2xl">A small team of engineers who care about systems, not just frameworks.</p>
      </Reveal>
      <div data-testid="team-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
        {TEAM.map((m) => <MemberCard key={m.slug} member={m} />)}
      </div>
    </div>
  </section>
);

export default Team;
