import React from 'react';
import { ProjectType, ProjectTag } from '../../types';
import { ALL_TYPES, ALL_TAGS, TYPE_LABELS, TAG_LABELS } from '../../lib/projects';

interface FilterBarProps {
  type: ProjectType | 'all';
  tag: ProjectTag | 'all';
  onType: (t: ProjectType | 'all') => void;
  onTag: (t: ProjectTag | 'all') => void;
}

const chip = (active: boolean) =>
  `text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
    active
      ? 'bg-slate-900 text-white border-slate-900'
      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
  }`;

export const FilterBar: React.FC<FilterBarProps> = ({ type, tag, onType, onTag }) => (
  <div className="space-y-4 mb-12">
    <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by type">
      <button className={chip(type === 'all')} onClick={() => onType('all')}>All Types</button>
      {ALL_TYPES.map(t => (
        <button key={t} className={chip(type === t)} onClick={() => onType(t)}>{TYPE_LABELS[t]}</button>
      ))}
    </div>
    <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by tag">
      <button className={chip(tag === 'all')} onClick={() => onTag('all')}>All</button>
      {ALL_TAGS.map(t => (
        <button key={t} className={chip(tag === t)} onClick={() => onTag(t)}>{TAG_LABELS[t]}</button>
      ))}
    </div>
  </div>
);
