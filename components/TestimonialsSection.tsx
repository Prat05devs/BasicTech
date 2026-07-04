import React from 'react';
import { TESTIMONIALS } from '../data/testimonials';
import { Reveal } from './ui/Reveal';

export const TestimonialsSection: React.FC = () => (
  <section className="py-16 sm:py-20 md:py-24 bg-white">
    <div className="container mx-auto px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10 2xl:px-12">
      <Reveal>
        <h2 className="text-xs sm:text-sm font-semibold tracking-widest text-slate-400 uppercase mb-10 sm:mb-12 md:mb-16 leading-none">What clients say</h2>
      </Reveal>
      <div data-testid="testimonials" className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {TESTIMONIALS.map((t, i) => (
          <figure key={i} className="flex flex-col">
            <blockquote className="text-base text-slate-700 font-light leading-relaxed mb-4">"{t.quote}"</blockquote>
            <figcaption className="mt-auto">
              <p className="text-sm font-semibold text-slate-900">{t.author}</p>
              <p className="text-xs text-slate-500">{t.role}, {t.company}</p>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  </section>
);
