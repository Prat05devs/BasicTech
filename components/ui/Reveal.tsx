import React, { useRef, useEffect } from 'react';
import { motion, useInView, useAnimation, TargetAndTransition, VariantLabels } from 'framer-motion';

interface RevealProps {
  children: React.ReactNode;
  width?: "fit-content" | "100%";
  delay?: number;
  duration?: number;
  yOffset?: number;
  className?: string;
  threshold?: number;
}

export const Reveal: React.FC<RevealProps> = ({ 
  children, 
  width = "fit-content", 
  delay = 0.25, 
  duration = 0.5,
  yOffset = 20,
  className = "",
  threshold = 0.5
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: threshold });
  const mainControls = useAnimation();

  useEffect(() => {
    if (isInView) {
      mainControls.start("visible");
    }
  }, [isInView, mainControls]);

  return (
    <div ref={ref} style={{ position: "relative", width, overflow: "hidden" }} className={className}>
      <motion.div
        variants={{
          hidden: { opacity: 0, y: yOffset },
          visible: { opacity: 1, y: 0 },
        }}
        initial="hidden"
        animate={mainControls}
        transition={{ duration, delay, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </div>
  );
};

export const LineDraw: React.FC<{ delay?: number, className?: string }> = ({ delay = 0, className = "" }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });
    
    return (
        <motion.div
            ref={ref}
            className={`h-[1px] bg-brand-blue ${className}`}
            initial={{ width: 0 }}
            animate={isInView ? { width: "100%" } : { width: 0 }}
            transition={{ duration: 0.8, delay, ease: "easeInOut" }}
        />
    )
}