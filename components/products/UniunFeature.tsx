import React, { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { STATUS_LABELS, STATUS_STYLES } from '../../data/products';

const PILLARS = [
  {
    tag: 'Brahma · Create',
    title: 'Write & connect',
    body:
      'Author notes and build your knowledge graph on an interactive canvas. Every reference you draw is an edge.',
    image: '/brahma.jpeg',
  },
  {
    tag: 'Vishnu · Reflect',
    title: 'Feed & messages',
    body:
      'Follow people in a time-ordered feed, join channels, and message end-to-end encrypted — the social side.',
    image: '/vishnu.jpeg',
  },
  {
    tag: 'Shiv · Transform',
    title: 'Your on-device AI',
    body:
      'Chat with your own notes, fuse ideas with Nataraj, and run autonomous Gana agents — all on your phone.',
    image: '/shiv.jpeg',
  },
] as const;

const PRINCIPLES = [
  'Built on Nostr',
  'MLS-encrypted',
  'On-device AI',
  'Offline-first',
  'Open source',
  'No algorithm',
] as const;

export const UniunFeature: React.FC = () => {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6 }}
      className="border border-slate-200 rounded-2xl bg-white overflow-hidden"
      data-testid="uniun-feature"
    >
      {/* Header */}
      <div className="p-6 sm:p-8 md:p-10 border-b border-slate-100">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
          <div className="flex items-center justify-center h-16 w-16 sm:h-20 sm:w-20 rounded-xl bg-slate-50 border border-slate-100 flex-shrink-0">
            <img
              src="/uniun-logo.png"
              alt="Uniun logo"
              className="max-h-12 sm:max-h-14 max-w-[80%] object-contain"
            />
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <span className="text-brand-blue font-mono text-[10px] tracking-wider uppercase">
                Productivity · Our first product
              </span>
              <span
                className={`text-[10px] font-medium uppercase tracking-wide px-2 py-1 rounded-full border ${STATUS_STYLES.live}`}
              >
                {STATUS_LABELS.live}
              </span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight">
              Uniun
            </h3>
            <p className="text-base sm:text-lg text-brand-blue/90 font-medium mt-1">
              Your decentralized second brain.
            </p>
          </div>
        </div>

        <p className="text-sm sm:text-base text-slate-600 font-light leading-relaxed mt-6 max-w-3xl">
          Uniun is a note-taking app built on Nostr. A note is the atom — the same note
          becomes a feed post, a thread, a node in your graph, a channel message, an
          encrypted DM, or context for your on-device AI. No company sits between you and
          your data; your identity is a keypair only you control.
        </p>

        {/* Principles */}
        <ul className="flex flex-wrap gap-2 mt-6">
          {PRINCIPLES.map((p) => (
            <li
              key={p}
              className="text-[11px] font-medium text-slate-700 border border-slate-200 bg-slate-50 rounded-full px-3 py-1"
            >
              {p}
            </li>
          ))}
        </ul>

        {/* CTAs */}
        <div className="flex flex-wrap gap-3 mt-8">
          <a
            href="https://www.uniun.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 px-5 py-2.5 rounded-full transition-colors"
          >
            Visit uniun.in
          </a>
          <a
            href="https://apps.apple.com/in/app/uniun/id6778077321"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-blue hover:text-blue-700 px-5 py-2.5 border border-brand-blue/30 hover:border-brand-blue rounded-full transition-colors"
          >
            Download on the App Store
          </a>
          <a
            href="https://play.google.com/store/apps/details?id=in.uniun.app&hl=en_IN"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-blue hover:text-blue-700 px-5 py-2.5 border border-brand-blue/30 hover:border-brand-blue rounded-full transition-colors"
          >
            Get it on Google Play
          </a>
          <a
            href="https://github.com/basictech01/uniun"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-700 hover:text-slate-900 px-5 py-2.5 border border-slate-200 hover:border-slate-400 rounded-full transition-colors"
          >
            View on GitHub
          </a>
        </div>
      </div>

      {/* Trinity pillars — carousel */}
      <div className="p-6 sm:p-8 md:p-10">
        <p className="text-xs font-semibold tracking-widest text-slate-400 uppercase mb-6">
          Three surfaces, one mind
        </p>
        <PillarCarousel />
      </div>
    </motion.article>
  );
};

const PillarCarousel: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const count = PILLARS.length;

  const goTo = useCallback(
    (next: number) => {
      const normalized = (next + count) % count;
      setDirection(normalized > index || (index === count - 1 && normalized === 0) ? 1 : -1);
      setIndex(normalized);
    },
    [count, index],
  );

  const prev = useCallback(() => goTo(index - 1), [goTo, index]);
  const next = useCallback(() => goTo(index + 1), [goTo, index]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev();
      else if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [prev, next]);

  const current = PILLARS[index];

  return (
    <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-8 md:gap-12 items-center">
      {/* Image stage — phone frame */}
      <div className="mx-auto w-full max-w-[300px]" data-testid="uniun-carousel" aria-live="polite">
        <div className="relative aspect-[9/19.5] rounded-[2.75rem] bg-slate-900 p-2.5 shadow-2xl shadow-slate-900/30 ring-1 ring-slate-800">
          {/* Side buttons */}
          <span className="absolute left-[-2px] top-24 h-10 w-[3px] rounded-l bg-slate-800" />
          <span className="absolute left-[-2px] top-40 h-16 w-[3px] rounded-l bg-slate-800" />
          <span className="absolute right-[-2px] top-32 h-20 w-[3px] rounded-r bg-slate-800" />

          {/* Screen */}
          <div className="relative h-full w-full rounded-[2.15rem] bg-slate-100 overflow-hidden">
            {/* Notch */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 z-10 h-[22px] w-[90px] rounded-full bg-slate-900" />

            <AnimatePresence initial={false} custom={direction} mode="popLayout">
              <motion.img
                key={current.image}
                src={current.image}
                alt={`${current.title} — Uniun screenshot`}
                className="absolute inset-0 w-full h-full object-cover"
                custom={direction}
                variants={{
                  enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
                  center: { x: 0, opacity: 1 },
                  exit: (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
                }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4, ease: 'easeOut' }}
                loading="lazy"
              />
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Caption + controls */}
      <div className="flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.tag}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-brand-blue font-mono text-[10px] tracking-wider uppercase mb-3">
              {current.tag}
            </p>
            <h4 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight mb-3">
              {current.title}
            </h4>
            <p className="text-sm sm:text-base text-slate-600 font-light leading-relaxed max-w-md">
              {current.body}
            </p>
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center gap-4 mt-8">
          <button
            type="button"
            onClick={prev}
            aria-label="Previous screenshot"
            className="h-10 w-10 rounded-full border border-slate-200 hover:border-slate-400 flex items-center justify-center text-slate-700 hover:text-slate-900 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Next screenshot"
            className="h-10 w-10 rounded-full border border-slate-200 hover:border-slate-400 flex items-center justify-center text-slate-700 hover:text-slate-900 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>

          <div className="flex items-center gap-2 ml-2" role="tablist" aria-label="Pillar screenshots">
            {PILLARS.map((p, i) => (
              <button
                key={p.tag}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Show ${p.title}`}
                onClick={() => goTo(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === index ? 'w-8 bg-brand-blue' : 'w-4 bg-slate-300 hover:bg-slate-400'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
