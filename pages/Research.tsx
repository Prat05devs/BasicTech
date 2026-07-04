import React from 'react';
import { PAPERS } from '../data/papers';
import { RESEARCH_ARTICLES } from '../data/researchArticles';
import { PaperCard } from '../components/research/PaperCard';
import { PostCard } from '../components/content/PostCard';
import { Seo } from '../components/Seo';
import { Reveal } from '../components/ui/Reveal';

const Research: React.FC = () => (
  <section className="pt-32 pb-24 bg-white min-h-screen">
    <Seo
      title="Research | Basic Tech"
      description="Papers and long-form research write-ups from Basic Tech."
      canonical="https://basictech.in/research"
      jsonLd={{ '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'Basic Tech Research', url: 'https://basictech.in/research' }}
    />
    <div className="container mx-auto px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10 2xl:px-12 max-w-4xl">
      <Reveal>
        <p className="text-xs sm:text-sm font-semibold tracking-widest text-slate-400 uppercase mb-4">Research</p>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-slate-900 tracking-tight mb-12">Papers &amp; write-ups.</h1>
      </Reveal>

      <h2 className="text-xs font-semibold tracking-widest text-slate-400 uppercase mb-6">Papers</h2>
      <div data-testid="papers-list" className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-16">
        {PAPERS.map((p) => <PaperCard key={p.slug} paper={p} />)}
      </div>

      <h2 className="text-xs font-semibold tracking-widest text-slate-400 uppercase mb-2">Articles</h2>
      <div data-testid="articles-list">
        {RESEARCH_ARTICLES.map((e) => <PostCard key={e.slug} entry={e} basePath="/research" />)}
      </div>
    </div>
  </section>
);

export default Research;
