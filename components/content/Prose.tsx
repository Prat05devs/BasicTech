import React from 'react';
import { ContentEntry } from '../../lib/content';

export const Prose: React.FC<{ entry: ContentEntry }> = ({ entry }) => {
  const { Component } = entry;
  return (
    <div className="prose prose-slate max-w-none prose-headings:tracking-tight prose-a:text-brand-blue prose-pre:bg-slate-900">
      <Component />
    </div>
  );
};
