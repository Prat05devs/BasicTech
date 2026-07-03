import React from 'react';
import { Link } from 'react-router-dom';
import { ContentEntry } from '../../lib/content';
import { formatDate } from '../../lib/format';

export const PostCard: React.FC<{ entry: ContentEntry; basePath: string }> = ({ entry, basePath }) => (
  <Link to={`${basePath}/${entry.slug}`} className="group block border-b border-slate-200 py-8">
    <div className="flex items-center gap-3 mb-2 text-xs text-slate-400">
      <time dateTime={entry.frontmatter.date}>{formatDate(entry.frontmatter.date)}</time>
      {entry.frontmatter.tags?.map((t) => <span key={t} className="text-brand-blue font-mono">{t}</span>)}
    </div>
    <h3 className="text-xl sm:text-2xl font-semibold text-slate-900 tracking-tight group-hover:text-brand-blue transition-colors mb-2">
      {entry.frontmatter.title}
    </h3>
    <p className="text-slate-600 font-light leading-relaxed">{entry.frontmatter.excerpt}</p>
  </Link>
);
