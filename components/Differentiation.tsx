import React from 'react';
import { motion } from 'framer-motion';
import { PILLARS } from '../constants';
import { Reveal } from './ui/Reveal';
import { Brain, Bot, Settings } from 'lucide-react';

const IconMap: any = {
  Brain: Brain,
  Bot: Bot,
  Settings: Settings
};

export const Differentiation: React.FC = () => {
  return (
    <section className="py-32 bg-slate-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-50/30 blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10 2xl:px-12 relative z-10">
        <div className="mb-20">
          <Reveal>
             <h2 className="text-4xl md:text-5xl font-semibold text-slate-900 mb-6">Why We're Different</h2>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PILLARS.map((pillar, index) => {
            const Icon = IconMap[pillar.icon];
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.15, ease: "easeOut" }}
                className="bg-white p-8 rounded-sm shadow-sm border border-slate-100 group hover:border-brand-blue/30 transition-colors duration-500"
              >
                <div className="mb-6 inline-block p-3 bg-blue-50 rounded-lg text-brand-blue">
                  <Icon size={24} strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">{pillar.title}</h3>
                <p className="text-slate-500 leading-relaxed">{pillar.subtitle}</p>
                
                {/* Subtle Line Animation at bottom of card */}
                <div className="w-full h-[1px] bg-slate-100 mt-8 relative overflow-hidden">
                   <motion.div 
                     className="absolute top-0 left-0 h-full bg-brand-blue"
                     initial={{ width: 0 }}
                     whileInView={{ width: "100%" }}
                     viewport={{ once: true }}
                     transition={{ duration: 1, delay: 0.5 + (index * 0.2) }}
                   />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};