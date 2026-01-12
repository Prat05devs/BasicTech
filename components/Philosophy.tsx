import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export const Philosophy: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const opacity1 = useTransform(scrollYProgress, [0, 0.3, 0.4], [0, 1, 0.3]);
  const blur1 = useTransform(scrollYProgress, [0, 0.3, 0.4], ["4px", "0px", "2px"]);
  
  const opacity2 = useTransform(scrollYProgress, [0.3, 0.5, 0.6], [0, 1, 0.3]);
  const blur2 = useTransform(scrollYProgress, [0.3, 0.5, 0.6], ["4px", "0px", "2px"]);

  const opacity3 = useTransform(scrollYProgress, [0.5, 0.8], [0, 1]);
  const blur3 = useTransform(scrollYProgress, [0.5, 0.8], ["4px", "0px"]);

  return (
    <section ref={containerRef} className="min-h-[120vh] bg-slate-50 flex items-center justify-center relative py-16 sm:py-18 md:py-20 lg:py-24 xl:py-28 overflow-hidden">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src="/bgVideo.mp4" type="video/mp4" />
      </video>
      
      {/* White overlay for faded effect */}
      <div className="absolute inset-0 bg-white/60 z-10" />
      
       <div className="container mx-auto px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10 2xl:px-12 max-w-4xl text-center relative z-20">
          <motion.h2 
            style={{ opacity: opacity1, filter: `blur(${blur1})` }}
            className="text-3xl sm:text-4xl md:text-6xl lg:text-6xl xl:text-7xl 2xl:text-7xl 3xl:text-8xl font-medium text-slate-900 mb-8 leading-tight"
          >
            Software doesn't need more people.
            <br />
            It needs better ones.
          </motion.h2>

          <motion.h2 
            style={{ opacity: opacity2, filter: `blur(${blur2})` }}
            className="text-3xl sm:text-4xl md:text-6xl lg:text-6xl xl:text-7xl 2xl:text-7xl 3xl:text-8xl font-medium text-slate-900 leading-tight"
          >
            AI doesn't replace engineers.
            <br />
            It amplifies the best ones.
          </motion.h2>
          
          <motion.p 
            style={{ opacity: opacity3, filter: `blur(${blur3})` }}
            className="text-lg sm:text-xl md:text-2xl text-slate-500 mt-8 sm:mt-10 md:mt-12 max-w-3xl mx-auto font-light leading-relaxed"
          >
            We believe modern software development is about fundamentals, clarity, and leverage — not bloated teams or unnecessary complexity.
          </motion.p>
          
          <motion.div 
            style={{ opacity: opacity3, filter: `blur(${blur3})` }}
            className="mt-16 w-full flex justify-center"
          >
             <div className="w-[1px] h-24 bg-brand-blue/30" />
          </motion.div>
       </div>
    </section>
  );
};