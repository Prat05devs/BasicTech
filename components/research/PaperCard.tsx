import React from 'react';
import { Paper } from '../../data/papers';
import { formatDate } from '../../lib/format';

export const PaperCard: React.FC<{ paper: Paper }> = ({ paper }) => (
  <a href={paper.url} target="_blank" rel="noopener noreferrer" className="group block border border-slate-200 rounded-lg p-6 bg-white hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
    <div className="flex items-center gap-3 mb-2 text-xs text-slate-400">
      <time dateTime={paper.date}>{formatDate(paper.date, { year: 'numeric', month: 'long' })}</time>
      {paper.venue && <span>· {paper.venue}</span>}
    </div>
    <h3 className="text-lg font-semibold text-slate-900 tracking-tight group-hover:text-brand-blue transition-colors mb-1">{paper.title}</h3>
    <p className="text-xs text-slate-500 mb-3">{paper.authors.join(', ')}</p>
    <p className="text-sm text-slate-600 font-light leading-relaxed mb-3">{paper.abstract}</p>
    <span className="text-sm font-medium text-brand-blue">Read paper →</span>
  </a>
);
