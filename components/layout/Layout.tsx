import React, { useEffect, useRef, useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Lenis from 'lenis';
import { Footer } from '../Footer';
import { ContactModal } from '../ContactModal';
import { ContactProvider, useContact } from './ContactContext';

const NAV_LINKS = [
  { to: '/work', label: 'Work' },
  { to: '/products', label: 'Products' },
  { to: '/infra', label: 'AI Infra' },
  { to: '/team', label: 'Team' },
  { to: '/blog', label: 'Blog' },
];

export const Nav: React.FC = () => {
  const { open } = useContact();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  // Close the mobile menu whenever the route changes.
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 transition-all duration-300 pointer-events-none">
      <div className="absolute inset-0 bg-white/70 backdrop-blur-md border-b border-white/20" />
      <div className="container mx-auto px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10 2xl:px-12 py-4 flex justify-between items-center relative z-10">
        <Link to="/" className="flex items-center gap-3 pointer-events-auto cursor-pointer">
          <div className="w-10 h-10 bg-brand-blue rounded-full flex items-center justify-center shadow-md shadow-blue-500/20">
            <span className="text-white font-bold text-lg tracking-tight">BT</span>
          </div>
          <span className="font-semibold tracking-tight text-xl text-slate-900 hidden sm:block">Basic Tech.</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden sm:flex items-center gap-6 pointer-events-auto">
          {NAV_LINKS.map((l) => (
            <Link key={l.to} to={l.to} className="text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors">
              {l.label}
            </Link>
          ))}
          <button
            onClick={() => open()}
            className="bg-slate-900 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-slate-800 transition-colors shadow-lg hover:shadow-xl hover:-translate-y-0.5 transform duration-300"
          >
            Contact
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          className="sm:hidden pointer-events-auto p-2 -mr-2 text-slate-800"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile panel */}
      {menuOpen && (
        <div data-testid="mobile-menu" className="sm:hidden relative z-10 pointer-events-auto bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-1">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setMenuOpen(false)}
                className="py-3 text-base font-medium text-slate-800 hover:text-brand-blue transition-colors border-b border-slate-100 last:border-0"
              >
                {l.label}
              </Link>
            ))}
            <button
              onClick={() => { setMenuOpen(false); open(); }}
              className="mt-3 bg-slate-900 text-white px-5 py-3 rounded-full text-sm font-medium hover:bg-slate-800 transition-colors text-center"
            >
              Contact
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

const Shell: React.FC = () => {
  const { isOpen, open, close, context } = useContact();
  const location = useLocation();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
    });
    lenisRef.current = lenis;
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    return () => { lenis.destroy(); lenisRef.current = null; };
  }, []);

  // Reset scroll to top on route change.
  useEffect(() => {
    lenisRef.current?.scrollTo(0, { immediate: true });
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="w-full bg-white min-h-screen">
      <Nav />
      <main>
        <Outlet />
      </main>
      <Footer onStartConversation={open} />
      <ContactModal isOpen={isOpen} onClose={close} context={context} />
    </div>
  );
};

export const Layout: React.FC = () => (
  <ContactProvider>
    <Shell />
  </ContactProvider>
);

export default Layout;
