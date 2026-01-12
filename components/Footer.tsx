import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Instagram, Linkedin } from 'lucide-react';

interface FooterProps {
  onStartConversation: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onStartConversation }) => {
  return (
    <section className="relative min-h-[70vh] sm:min-h-[75vh] md:h-[80vh] flex items-center justify-center overflow-hidden py-8 sm:py-12 md:py-0">
      {/* Parallax Background Image */}
      <div 
        className="absolute inset-0 z-0"
        style={{
            backgroundImage: "url('https://picsum.photos/1920/1080?grayscale&blur=2')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: typeof window !== 'undefined' && window.innerWidth > 768 ? "fixed" : "scroll" // Creates the parallax/reveal effect relative to viewport
        }}
      >
        <div className="absolute inset-0 bg-slate-900/60" /> 
      </div>

      {/* Floating Footer Card */}
      <div className="container mx-auto px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10 2xl:px-12 relative z-10 w-full max-w-5xl">
         <motion.div 
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="bg-white/10 backdrop-blur-md border border-white/20 p-6 sm:p-8 md:p-12 lg:p-16 xl:p-20 rounded-xl sm:rounded-2xl text-center shadow-2xl"
         >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-semibold text-white mb-4 sm:mb-5 md:mb-6 px-2 tracking-tight leading-tight">Let's Build Something Solid.</h2>
            <p className="text-base sm:text-lg md:text-lg lg:text-xl text-blue-100 font-light mb-8 sm:mb-10 md:mb-12 max-w-2xl mx-auto px-2 leading-relaxed">
                Tell us what you're building. We'll tell you how we'd approach it.
            </p>

            <motion.button
               onClick={onStartConversation}
               className="inline-flex items-center gap-2 sm:gap-3 md:gap-4 bg-brand-blue text-white px-6 sm:px-7 md:px-8 py-3 sm:py-3.5 md:py-4 rounded-full font-medium text-sm sm:text-base md:text-lg hover:bg-blue-600 active:bg-blue-700 transition-all duration-300 group shadow-lg shadow-blue-900/50 touch-manipulation"
               whileHover={{ scale: 1.02 }}
               whileTap={{ scale: 0.98 }}
            >
                Start a Conversation
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>

            <div className="mt-10 sm:mt-12 md:mt-16 flex flex-col md:flex-row items-center justify-between border-t border-white/10 pt-6 sm:pt-7 md:pt-8 gap-4 sm:gap-5 md:gap-6">
                <div className="text-blue-200 text-xs sm:text-sm text-center md:text-left">
                    &copy; {new Date().getFullYear()} Basic Tech. All rights reserved.
                </div>
                <div className="flex gap-4 sm:gap-5 md:gap-6">
                    <SocialLink icon={Instagram} href="https://www.instagram.com/basictech01/" />
                    <SocialLink icon={Linkedin} href="https://www.linkedin.com/company/basictech01/posts/?feedView=all" />
                </div>
            </div>
         </motion.div>
      </div>
    </section>
  );
};

const SocialLink: React.FC<{ icon: any, href: string }> = ({ icon: Icon, href }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-200 hover:text-white active:text-blue-300 transition-colors p-2 sm:p-2.5 rounded-full hover:bg-white/10 active:bg-white/20 touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center">
        <Icon className="w-5 h-5 sm:w-5 sm:h-5" />
    </a>
);