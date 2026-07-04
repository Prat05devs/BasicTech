import React, { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import { useContact } from '../components/layout/ContactContext';
import {
  INFRA_VALUES,
  INFRA_CAPABILITIES,
  INFRA_PRINCIPLES,
  INFRA_PROBLEMS,
  InfraItem,
} from '../data/infra';
import { Seo } from '../components/Seo';
import { Reveal } from '../components/ui/Reveal';
import { InfraChatModal } from '../components/infra/InfraChatModal';

const Infra: React.FC = () => {
  const { open } = useContact();
  const [chatOpen, setChatOpen] = useState(false);
  const getAccess = () => open('AI Infra — Early Access');
  const openChat = () => setChatOpen(true);

  return (
    <article className="bg-white">
      <Seo
        title="UNIUN Inference Platform | Basic Tech"
        description="One OpenAI-compatible API for every model. UNIUN Inference is Basic Tech's unified AI gateway — auth, routing, streaming, billing, analytics, and hybrid local inference behind a single endpoint."
        canonical="https://basictech.in/infra"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: 'UNIUN Inference Platform',
          serviceType: 'AI inference infrastructure',
          provider: { '@type': 'Organization', name: 'Basic Tech' },
          url: 'https://basictech.in/infra',
        }}
      />

      {/* Hero */}
      <section className="pt-32 pb-20 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10 2xl:px-12 max-w-4xl">
          <Reveal>
            <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wide bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1 rounded-full mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> In development
            </span>
            <p className="text-xs font-semibold tracking-widest text-brand-blue uppercase mb-4">UNIUN Inference Platform</p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold text-slate-900 tracking-tight leading-tight mb-6">
              One API.<br />Every model.
            </h1>
            <p className="text-lg text-slate-600 font-light leading-relaxed max-w-2xl mb-8">
              A unified AI infrastructure for modern applications. Integrate once with an OpenAI-compatible API — UNIUN handles authentication, provider routing, streaming, billing, and analytics behind a single endpoint.
            </p>
            <div className="flex flex-wrap gap-3">
              <button onClick={getAccess} className="bg-slate-900 text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-slate-800 transition-colors shadow-lg">
                Get early access
              </button>
              <button
                type="button"
                onClick={openChat}
                className="inline-flex items-center gap-2 bg-white text-slate-900 px-6 py-3 rounded-full text-sm font-medium border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors shadow-sm"
              >
                <MessageSquare size={16} /> Try the chat
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Problem */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10 2xl:px-12 max-w-4xl">
          <Reveal>
            <h2 className="text-xs sm:text-sm font-semibold tracking-widest text-slate-400 uppercase mb-6">The problem</h2>
            <p className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight leading-snug mb-10 max-w-3xl">
              Every application rebuilds the same plumbing to support multiple AI providers.
            </p>
          </Reveal>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4">
            {INFRA_PROBLEMS.map((p) => (
              <li key={p} className="flex gap-3 text-base text-slate-700 font-light leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-blue mt-2.5 flex-shrink-0" />
                {p}
              </li>
            ))}
          </ul>
          <p className="text-base text-slate-600 font-light leading-relaxed mt-10 max-w-3xl">
            UNIUN Inference is the abstraction layer between applications and providers — one integration, one contract, any model.
          </p>
        </div>
      </section>

      {/* Why own the stack */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10 2xl:px-12">
          <Reveal>
            <h2 className="text-xs sm:text-sm font-semibold tracking-widest text-slate-400 uppercase mb-12">Why we own the stack</h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
            {INFRA_VALUES.map((v) => <Item key={v.title} item={v} />)}
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10 2xl:px-12">
          <Reveal>
            <h2 className="text-xs sm:text-sm font-semibold tracking-widest text-slate-400 uppercase mb-12">Capabilities</h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {INFRA_CAPABILITIES.map((c) => (
              <div key={c.title} className="border border-slate-200 rounded-lg p-6 bg-white">
                <h3 className="text-lg font-semibold text-slate-900 tracking-tight mb-2">{c.title}</h3>
                <p className="text-sm text-slate-600 font-light leading-relaxed">{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10 2xl:px-12 max-w-3xl">
          <Reveal>
            <h2 className="text-xs sm:text-sm font-semibold tracking-widest text-slate-400 uppercase mb-8">Principles</h2>
          </Reveal>
          <ul className="space-y-4">
            {INFRA_PRINCIPLES.map((p, i) => (
              <li key={i} className="flex gap-3 text-lg text-slate-700 font-light leading-relaxed">
                <span className="w-2 h-2 rounded-full bg-brand-blue mt-2.5 flex-shrink-0" />
                {p}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-slate-900">
        <div className="container mx-auto px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10 2xl:px-12 text-center max-w-2xl">
          <h2 className="text-3xl sm:text-4xl font-semibold text-white tracking-tight mb-4">Want in early?</h2>
          <p className="text-slate-300 font-light mb-8">We're onboarding a small group of early-access partners. Tell us about your workload — or try the preview chat first.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <button onClick={getAccess} className="bg-white text-slate-900 px-6 py-3 rounded-full text-sm font-medium hover:bg-slate-100 transition-colors shadow-lg">
              Get early access
            </button>
            <button
              type="button"
              onClick={openChat}
              className="inline-flex items-center gap-2 bg-transparent text-white px-6 py-3 rounded-full text-sm font-medium border border-white/30 hover:bg-white/10 transition-colors"
            >
              <MessageSquare size={16} /> Try the chat
            </button>
          </div>
        </div>
      </section>

      <InfraChatModal isOpen={chatOpen} onClose={() => setChatOpen(false)} />
    </article>
  );
};

const Item: React.FC<{ item: InfraItem }> = ({ item }) => (
  <div>
    <div className="w-3 h-3 bg-brand-blue rounded-full mb-4" />
    <h3 className="text-xl font-semibold text-slate-900 tracking-tight mb-2">{item.title}</h3>
    <p className="text-base text-slate-600 font-light leading-relaxed">{item.body}</p>
  </div>
);

export default Infra;
