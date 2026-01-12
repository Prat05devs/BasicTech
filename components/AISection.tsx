import React from 'react';
import { motion } from 'framer-motion';
import { Reveal } from './ui/Reveal';

export const AISection: React.FC = () => {
  return (
    <section className="min-h-screen bg-white relative overflow-hidden flex items-center">
      
      {/* Abstract Background Flow Lines */}
      <div className="absolute inset-0 pointer-events-none">
        <svg
          className="
            absolute top-1/2 left-1/2
            -translate-x-1/2 -translate-y-1/2
            w-[120%] md:w-[140%] lg:w-[160%]
            h-[70%]
            opacity-[0.2] md:opacity-[0.16]
          "
          viewBox="0 0 1200 300"
          preserveAspectRatio="xMidYMid meet"
        >
          <motion.path
            d="M-150,150 C150,50 350,250 550,150 C750,50 950,250 1350,150"
            fill="none"
            stroke="#2F80ED"
            strokeWidth="1.3"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 3.5, ease: "easeInOut" }}
          />

          <motion.path
            d="M-150,150 C200,250 400,50 600,150 C800,250 1000,50 1400,150"
            fill="none"
            stroke="#2F80ED"
            strokeWidth="0.9"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 4.2, delay: 0.4, ease: "easeInOut" }}
          />
        </svg>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10 2xl:px-12 relative z-10 w-full">
        <div className="max-w-5xl mx-auto text-center">
          <Reveal width="100%">
            <h2 className="text-4xl sm:text-5xl md:text-5xl lg:text-6xl font-semibold text-slate-900 mb-12 md:mb-16 tracking-tight leading-tight">
              AI is not a feature. <br />
              It's part of our workflow.
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 lg:gap-16 items-start">
            <Feature title="Faster Iteration" text="Prototyping at the speed of thought." delay={0.2} />
            <Feature title="Better Testing" text="Edge cases covered before deployment." delay={0.4} />
            <Feature title="Leaner Teams" text="Senior-level output from small squads." delay={0.6} />
          </div>
        </div>
      </div>
    </section>
  );
};

const Feature: React.FC<{ title: string; text: string; delay: number }> = ({
  title,
  text,
  delay,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.6 }}
    className="text-center flex flex-col items-center"
  >
    <div className="w-3 h-3 bg-brand-blue rounded-full mb-6 flex-shrink-0" />
    <h3 className="text-xl md:text-xl lg:text-2xl font-semibold text-slate-900 mb-3 md:mb-4 tracking-tight leading-tight">
      {title}
    </h3>
    <p className="text-base md:text-lg text-slate-600 font-light leading-relaxed max-w-xs mx-auto">
      {text}
    </p>
  </motion.div>
);
