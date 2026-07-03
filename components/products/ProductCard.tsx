import React from 'react';
import { motion } from 'framer-motion';
import { Product, STATUS_LABELS, STATUS_STYLES } from '../../data/products';
import { useContact } from '../layout/ContactContext';

export const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const { open } = useContact();
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6 }}
      className="flex flex-col h-full border border-slate-200 rounded-lg p-6 bg-white hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-brand-blue font-mono text-[10px] tracking-wider uppercase">{product.category}</span>
        <span className={`text-[10px] font-medium uppercase tracking-wide px-2 py-1 rounded-full border ${STATUS_STYLES[product.status]}`}>
          {STATUS_LABELS[product.status]}
        </span>
      </div>
      <h3 className="text-xl font-semibold text-slate-900 tracking-tight mb-2">{product.name}</h3>
      <p className="text-sm text-brand-blue/90 font-medium mb-3">{product.tagline}</p>
      <p className="text-sm text-slate-600 font-light leading-relaxed mb-6 flex-1">{product.description}</p>
      <div className="flex flex-wrap gap-3 mt-auto">
        <button
          onClick={() => open(`Product waitlist: ${product.name}`)}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 px-4 py-2 rounded-full transition-colors"
        >
          Notify me
        </button>
        {product.url && (
          <a
            href={product.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-blue hover:text-blue-700 px-4 py-2 border border-brand-blue/30 hover:border-brand-blue rounded-full transition-colors"
          >
            Visit
          </a>
        )}
      </div>
    </motion.div>
  );
};
