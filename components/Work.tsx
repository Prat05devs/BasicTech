import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { SELECTED_WORK } from '../constants';
import { Reveal } from './ui/Reveal';
import { WorkItem } from '../types';

export const Work: React.FC = () => {
  return (
    <section className="py-32 bg-slate-50">
      <div className="container mx-auto px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10 2xl:px-12">
        <Reveal>
          <h2 className="text-sm font-semibold tracking-widest text-slate-400 uppercase mb-16">Selected Work</h2>
        </Reveal>

        <div className="grid grid-cols-1 gap-24">
          {SELECTED_WORK.map((work, index) => (
            <WorkCard key={index} work={work} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

const WorkCard: React.FC<{ work: WorkItem, index: number }> = ({ work, index }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
      className="group cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
        {/* Image Side */}
        <div className={`relative overflow-hidden aspect-[4/3] bg-slate-200 rounded-sm shadow-sm ${index % 2 === 1 ? 'md:order-2' : ''}`}>
           <motion.div
             className="w-full h-full"
             whileHover={{ scale: 1.05 }}
             transition={{ duration: 0.6 }}
           >
              <img 
                src={work.image} 
                alt={work.name} 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
              />
           </motion.div>
           {/* Mask overlay for reveal effect */}
           <motion.div 
             initial={{ x: "0%" }}
             whileInView={{ x: "100%" }}
             viewport={{ once: true }}
             transition={{ duration: 0.8, delay: 0.2, ease: "circOut" }}
             className="absolute inset-0 bg-slate-50 z-10"
           />
        </div>

        {/* Text Side */}
        <div className={`${index % 2 === 1 ? 'md:order-1 md:text-right' : 'md:text-left'}`}>
          <div className={`mb-4 flex flex-col ${index % 2 === 1 ? 'items-end' : 'items-start'}`}>
              <span className="text-brand-blue font-mono text-xs tracking-wider uppercase bg-blue-50 px-2 py-1 rounded-sm mb-2 inline-block">
                  {work.vertical}
              </span>
              <h3 className="text-3xl md:text-4xl font-semibold text-slate-900">{work.name}</h3>
          </div>
          
          <p className="text-lg text-slate-500 font-light mb-8 leading-relaxed">
            {work.solution}
          </p>

          <div className={`flex flex-wrap gap-2 ${index % 2 === 1 ? 'justify-end' : ''}`}>
             {work.tech.split(', ').map((t: string, i: number) => (
                <span key={i} className="text-xs font-medium py-1.5 px-3 bg-white border border-slate-200 rounded-full text-slate-600 shadow-sm">
                    {t}
                </span>
             ))}
          </div>
          
          <div className={`h-[1px] bg-slate-200 mt-8 w-1/3 transition-all duration-500 group-hover:bg-brand-blue group-hover:w-2/3 ${index % 2 === 1 ? 'ml-auto' : ''}`} />
        </div>
      </div>
    </motion.div>
  );
}