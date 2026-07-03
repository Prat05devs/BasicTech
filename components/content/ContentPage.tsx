import React from 'react';
import { Navigate } from 'react-router-dom';
import { LEGAL } from '../../data/legalPages';
import { getEntry } from '../../lib/content';
import { Prose } from './Prose';
import { Seo } from '../Seo';
import { formatDate } from '../../lib/format';

export const ContentPage: React.FC<{ slug: string }> = ({ slug }) => {
  const entry = getEntry(LEGAL, slug);
  if (!entry) return <Navigate to="/" replace />;
  const { frontmatter } = entry;

  return (
    <article className="pt-32 pb-24 bg-white">
      <Seo
        title={`${frontmatter.title} | Basic Tech`}
        description={frontmatter.excerpt}
        canonical={`https://basictech.in/${slug}`}
        jsonLd={{ '@context': 'https://schema.org', '@type': 'WebPage', name: frontmatter.title, url: `https://basictech.in/${slug}` }}
      />
      <div className="container mx-auto px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10 2xl:px-12 max-w-3xl">
        <header className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-semibold text-slate-900 tracking-tight">{frontmatter.title}</h1>
          <p className="text-sm text-slate-400 mt-2">Last updated {formatDate(frontmatter.date)}</p>
        </header>
        <Prose entry={entry} />
      </div>
    </article>
  );
};
