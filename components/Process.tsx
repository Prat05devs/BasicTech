import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { PROCESS_STEPS } from '../constants';
import { Reveal } from './ui/Reveal';

export const Process: React.FC = () => {
  return (
    <section className="py-32 bg-white">
      <div className="container mx-auto px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10 2xl:px-12">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-32">
          
          {/* Sticky Left Title */}
          <div className="lg:w-1/3">
            <div className="sticky top-32">
              <Reveal>
                <h2 className="text-4xl md:text-5xl font-semibold text-slate-900 mb-6">How We Build</h2>
              </Reveal>
              <Reveal delay={0.4}>
                <p className="text-slate-500 text-lg">
                  A clear, engineering-led software development process designed for speed, quality, and precision.
                </p>
              </Reveal>
              {/* Decorative vertical line */}
              <motion.div 
                 initial={{ height: 0 }}
                 whileInView={{ height: "200px" }}
                 viewport={{ once: true }}
                 transition={{ duration: 1.5 }}
                 className="w-[1px] bg-gradient-to-b from-brand-blue to-transparent mt-12 hidden lg:block"
              />
            </div>
          </div>

          {/* Scrolling Steps */}
          <div className="lg:w-2/3 flex flex-col space-y-24">
            {PROCESS_STEPS.map((step, index) => (
              <ProcessStepItem key={index} step={step} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const ProcessStepItem: React.FC<{ step: any, index: number }> = ({ step, index }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["center end", "center center"]
  });
  
  const opacity = useTransform(scrollYProgress, [0, 1], [0.3, 1]);
  const x = useTransform(scrollYProgress, [0, 1], [-20, 0]);

  return (
    <motion.div 
      ref={ref}
      style={{ opacity, x }}
      className="flex gap-8 group"
    >
      <div className="flex flex-col items-center">
        <span className="text-xs font-mono text-brand-blue mb-2">{step.number}</span>
        <div className="w-[1px] h-full bg-slate-200 group-hover:bg-brand-blue/50 transition-colors duration-500 min-h-[100px]" />
      </div>
      <div className="pb-12">
        <h3 className="text-2xl font-medium text-slate-900 mb-3">{step.title}</h3>
        <p className="text-slate-500 leading-relaxed max-w-md">{step.description}</p>
      </div>
    </motion.div>
  );
};