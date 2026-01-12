import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { SERVICES } from '../constants';
import { Reveal } from './ui/Reveal';

export const Services: React.FC = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 xl:py-28 bg-white relative">
      <div className="container mx-auto px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10 2xl:px-12">
        <Reveal width="100%">
          <h3 className="text-xs sm:text-sm font-semibold tracking-widest text-brand-blue uppercase mb-8 sm:mb-10 md:mb-12">What We Do</h3>
        </Reveal>

        <div className="flex flex-col">
          {SERVICES.map((service, index) => (
            <motion.div 
              key={index}
              className="group relative border-t border-slate-100 py-6 sm:py-8 md:py-10 cursor-default transition-colors duration-500 hover:bg-slate-50/50 active:bg-slate-100/50"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onTouchStart={() => setHoveredIndex(index)}
              onTouchEnd={() => setHoveredIndex(null)}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 items-center md:items-center">
                <div className="flex items-center gap-3 sm:gap-4">
                   {/* Vertical Line Animation */}
                   <motion.div 
                      className="w-[2px] sm:w-[2.5px] bg-brand-blue flex-shrink-0"
                      initial={{ height: 0 }}
                      animate={{ height: hoveredIndex === index ? "20px" : "0px" }}
                      transition={{ duration: 0.3 }}
                      style={{ opacity: hoveredIndex === index ? 1 : 0 }}
                   />
                   <h4 className={`text-xl sm:text-2xl md:text-3xl font-light tracking-tight transition-colors duration-300 ${hoveredIndex === index ? 'text-brand-blue' : 'text-slate-900'} leading-tight`}>
                     {service.title}
                   </h4>
                </div>
                <p className="text-base sm:text-lg text-slate-500 font-light md:pl-8 leading-relaxed mt-2 sm:mt-0">
                  {service.description}
                </p>
              </div>
            </motion.div>
          ))}
          <div className="border-t border-slate-100" />
        </div>
      </div>
    </section>
  );
};