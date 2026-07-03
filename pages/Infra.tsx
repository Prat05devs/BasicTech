import React from 'react';
import { useContact } from '../components/layout/ContactContext';
import { INFRA_VALUES, INFRA_CAPABILITIES, INFRA_PRINCIPLES, InfraItem } from '../data/infra';
import { Seo } from '../components/Seo';
import { Reveal } from '../components/ui/Reveal';

const Infra: React.FC = () => {
  const { open } = useContact();
  const getAccess = () => open('AI Infra — Early Access');

  return (
    <article className="bg-white">
      <Seo
        title="AI Inference Infrastructure | Basic Tech"
        description="Basic Tech runs its own AI inference layer — control, cost efficiency, data residency, and no vendor lock-in. Join the early-access list."
        canonical="https://basictech.in/infra"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: 'Basic Tech AI Inference Layer',
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
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold text-slate-900 tracking-tight leading-tight mb-6">
              We run our own<br />AI inference layer.
            </h1>
            <p className="text-lg text-slate-600 font-light leading-relaxed max-w-2xl mb-8">
              Basic Tech is an AI-first studio — so we're building the infrastructure to match. Our own inference layer means control, cost efficiency, and data residency we can stand behind.
            </p>
            <button onClick={getAccess} className="bg-slate-900 text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-slate-800 transition-colors shadow-lg">
              Get early access
            </button>
          </Reveal>
        </div>
      </section>

      {/* Why own the stack */}
      <section className="py-20">
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
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10 2xl:px-12">
          <Reveal>
            <h2 className="text-xs sm:text-sm font-semibold tracking-widest text-slate-400 uppercase mb-12">Capabilities</h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
      <section className="py-20">
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
          <p className="text-slate-300 font-light mb-8">We're onboarding a small group of early-access partners. Tell us about your workload.</p>
          <button onClick={getAccess} className="bg-white text-slate-900 px-6 py-3 rounded-full text-sm font-medium hover:bg-slate-100 transition-colors shadow-lg">
            Get early access
          </button>
        </div>
      </section>
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
