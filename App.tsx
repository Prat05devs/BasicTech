import React, { useEffect, useState } from 'react';
import Lenis from 'lenis';

// Components
import { Hero } from './components/Hero';
import { Philosophy } from './components/Philosophy';
import { Services } from './components/Services';
import { Differentiation } from './components/Differentiation';
import { Process } from './components/Process';
import { Work } from './components/Work';
import { AISection } from './components/AISection';
import { TechStack } from './components/TechStack';
import { Footer } from './components/Footer';
import { ContactModal } from './components/ContactModal';

const App: React.FC = () => {
  const [isContactOpen, setIsContactOpen] = useState(false);
  
  // Initialize Smooth Scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
        lenis.destroy();
    }
  }, []);

  const openContact = () => setIsContactOpen(true);
  const closeContact = () => setIsContactOpen(false);

  return (
    <main className="w-full bg-white min-h-screen">
      <Hero onStartProject={openContact} />
      <Philosophy />
      <Services />
      <Differentiation />
      <Process />
      <Work />
      <AISection />
      <TechStack />
      <Footer onStartConversation={openContact} />
      
      {/* Sticky Top Nav */}
      <nav className="fixed top-0 left-0 w-full z-50 transition-all duration-300 pointer-events-none">
          <div className="absolute inset-0 bg-white/70 backdrop-blur-md border-b border-white/20" />
          <div className="container mx-auto px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10 2xl:px-12 py-4 flex justify-between items-center relative z-10">
              <div className="flex items-center gap-3 pointer-events-auto cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                  {/* BT Logo - Blue Circle, White Text */}
                  <div className="w-10 h-10 bg-brand-blue rounded-full flex items-center justify-center shadow-md shadow-blue-500/20">
                      <span className="text-white font-bold text-lg tracking-tight">BT</span>
                  </div>
                  <span className="font-semibold tracking-tight text-xl text-slate-900 hidden sm:block">Basic Tech.</span>
              </div>
              
              <button 
                onClick={openContact}
                className="pointer-events-auto bg-slate-900 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-slate-800 transition-colors hidden sm:block shadow-lg hover:shadow-xl hover:-translate-y-0.5 transform duration-300"
              >
                  Contact
              </button>
          </div>
      </nav>

      <ContactModal isOpen={isContactOpen} onClose={closeContact} />
    </main>
  );
};

export default App;