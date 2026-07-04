import React from 'react';
import { motion } from 'framer-motion';
import { EngagementModel } from '../../data/engagement';

export const ModelCard: React.FC<{ model: EngagementModel }> = ({ model }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.6 }}
    className="flex flex-col h-full border border-slate-200 rounded-lg p-6 bg-white"
  >
    <h3 className="text-xl font-semibold text-slate-900 tracking-tight mb-2">{model.name}</h3>
    <p className="text-sm text-slate-600 font-light leading-relaxed mb-4">{model.summary}</p>
    <p className="text-xs font-medium text-brand-blue mb-4">Best for: {model.bestFor}</p>
    <div className="mb-4">
      <p className="text-xs font-semibold tracking-widest text-slate-400 uppercase mb-2">Includes</p>
      <ul className="space-y-1">
        {model.includes.map((i) => (
          <li key={i} className="text-sm text-slate-700 flex gap-2"><span className="text-brand-blue">·</span>{i}</li>
        ))}
      </ul>
    </div>
    <div className="mt-auto">
      <p className="text-xs font-semibold tracking-widest text-slate-400 uppercase mb-2">How it works</p>
      <ol className="space-y-1">
        {model.process.map((p, i) => (
          <li key={p} className="text-sm text-slate-600 font-light">{i + 1}. {p}</li>
        ))}
      </ol>
    </div>
  </motion.div>
);
