import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { SELECTED_WORK } from '../constants';
import { Reveal } from './ui/Reveal';
import { WorkItem } from '../types';

export const Work: React.FC = () => {
  return (
    <section className="py-16 sm:py-20 md:py-24 bg-slate-50">
      <div className="container mx-auto px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10 2xl:px-12">
        <Reveal>
          <h2 className="text-xs sm:text-sm font-semibold tracking-widest text-slate-400 uppercase mb-10 sm:mb-12 md:mb-16 leading-none">Selected Work</h2>
        </Reveal>

        <div className="grid grid-cols-1 gap-12 sm:gap-14 md:gap-16">
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
      className="group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-start">
        {/* Image Side */}
        <div className={`relative overflow-hidden aspect-[3/2] bg-slate-200 rounded-sm shadow-sm ${index % 2 === 1 ? 'md:order-2' : ''}`}>
           <motion.div
             className="w-full h-full"
             whileHover={{ scale: 1.05 }}
             transition={{ duration: 0.6 }}
           >
              <img 
                src={work.image} 
                alt={work.name} 
                className="w-full h-full object-cover object-top grayscale group-hover:grayscale-0 transition-all duration-700"
                style={{ objectPosition: 'top' }}
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
          <div className={`mb-3 flex flex-col ${index % 2 === 1 ? 'items-end' : 'items-start'}`}>
              <span className="text-brand-blue font-mono text-[10px] xs:text-xs tracking-wider uppercase bg-blue-50 px-2 py-1 rounded-sm mb-2 inline-block leading-none">
                  {work.vertical}
              </span>
              <h3 className="text-xl sm:text-2xl md:text-2xl font-semibold text-slate-900 tracking-tight leading-tight">{work.name}</h3>
          </div>
          
          <p className="text-sm sm:text-base text-slate-600 font-light mb-3 leading-relaxed">
            {work.solution}
          </p>

          {work.description && (
            <p className="text-xs sm:text-sm text-slate-500 font-light mb-4 leading-relaxed">
              {work.description}
            </p>
          )}

          <div className={`flex flex-wrap gap-1.5 sm:gap-2 mb-4 ${index % 2 === 1 ? 'justify-end' : ''}`}>
             {work.tech.split(' · ').map((t: string, i: number) => (
                <span key={i} className="text-[10px] xs:text-xs font-medium py-1 px-2 sm:px-3 bg-white border border-slate-200 rounded-full text-slate-600 shadow-sm">
                    {t}
                </span>
             ))}
          </div>
          
          {/* Links */}
          {(work.websiteUrl || work.githubUrl) && (
            <div className={`flex flex-wrap gap-2 sm:gap-3 ${index % 2 === 1 ? 'justify-end' : 'justify-start'}`}>
              {work.websiteUrl && (
                <a
                  href={work.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-brand-blue hover:text-blue-700 transition-colors duration-200 px-3 py-1.5 border border-brand-blue/30 hover:border-brand-blue rounded-sm bg-white hover:bg-blue-50"
                  onClick={(e) => e.stopPropagation()}
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Visit Website
                </a>
              )}
              {work.githubUrl && (
                <a
                  href={work.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors duration-200 px-3 py-1.5 border border-slate-300 hover:border-slate-400 rounded-sm bg-white hover:bg-slate-50"
                  onClick={(e) => e.stopPropagation()}
                >
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                  View Code
                </a>
              )}
            </div>
          )}
          
          <div className={`h-[1px] bg-slate-200 mt-6 w-1/3 transition-all duration-500 group-hover:bg-brand-blue group-hover:w-2/3 ${index % 2 === 1 ? 'ml-auto' : ''}`} />
        </div>
      </div>
    </motion.div>
  );
};
