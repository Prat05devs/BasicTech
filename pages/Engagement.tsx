import React from 'react';
import { ENGAGEMENT_MODELS } from '../data/engagement';
import { RESULTS } from '../data/results';
import { ModelCard } from '../components/engagement/ModelCard';
import { useContact } from '../components/layout/ContactContext';
import { Seo } from '../components/Seo';
import { Reveal } from '../components/ui/Reveal';

const Engagement: React.FC = () => {
  const { open } = useContact();
  const book = () => open('Discovery call');

  return (
    <section className="pt-32 pb-24 bg-white min-h-screen">
      <Seo
        title="How We Work | Basic Tech"
        description="Engagement models for building software with Basic Tech — fixed-scope MVPs, retainers, and build-partnerships. Book a discovery call."
        canonical="https://basictech.in/engagement"
        jsonLd={{ '@context': 'https://schema.org', '@type': 'Service', name: 'Basic Tech Engagement Models', provider: { '@type': 'Organization', name: 'Basic Tech' }, url: 'https://basictech.in/engagement' }}
      />
      <div className="container mx-auto px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10 2xl:px-12">
        <Reveal>
          <p className="text-xs sm:text-sm font-semibold tracking-widest text-slate-400 uppercase mb-4">How we work</p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-slate-900 tracking-tight mb-4 max-w-2xl">Ways to work with us.</h1>
          <p className="text-base sm:text-lg text-slate-600 font-light mb-12 max-w-2xl">Pick the engagement that fits where you are. Not sure? Book a call and we'll figure it out together.</p>
        </Reveal>

        {/* Results strip */}
        <div data-testid="results-strip" className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16 border-y border-slate-200 py-8">
          {RESULTS.map((r, i) => (
            <div key={i}>
              <p className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight">{r.metric}</p>
              <p className="text-xs sm:text-sm text-slate-500 font-light mt-1">{r.label}</p>
            </div>
          ))}
        </div>

        {/* Models */}
        <div data-testid="model-grid" className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {ENGAGEMENT_MODELS.map((m) => <ModelCard key={m.slug} model={m} />)}
        </div>

        {/* CTA */}
        <div className="mt-20 text-center bg-slate-50 rounded-lg py-12 px-6">
          <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight mb-4">Let's talk about your project.</h2>
          <p className="text-slate-600 font-light mb-8 max-w-xl mx-auto">A 30-minute discovery call — no pitch, just a conversation about what you're building.</p>
          <button onClick={book} className="bg-slate-900 text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-slate-800 transition-colors shadow-lg">
            Book a discovery call
          </button>
        </div>
      </div>
    </section>
  );
};

export default Engagement;
