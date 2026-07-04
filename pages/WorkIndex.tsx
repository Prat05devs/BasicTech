import React, { useMemo, useState } from 'react';
import { PROJECTS } from '../constants';
import { filterProjects } from '../lib/projects';
import { ProjectType, ProjectTag } from '../types';
import { ProjectCard } from '../components/work/ProjectCard';
import { FilterBar } from '../components/work/FilterBar';
import { Seo } from '../components/Seo';
import { Reveal } from '../components/ui/Reveal';

const WorkIndex: React.FC = () => {
  const [type, setType] = useState<ProjectType | 'all'>('all');
  const [tag, setTag] = useState<ProjectTag | 'all'>('all');
  const visible = useMemo(() => filterProjects(PROJECTS, type, tag), [type, tag]);

  const filtersActive = type !== 'all' || tag !== 'all';
  const platformWork = useMemo(
    () => visible.filter(p => !p.tags.includes('brand-site')),
    [visible],
  );
  const brandSites = useMemo(
    () => visible.filter(p => p.tags.includes('brand-site')),
    [visible],
  );
  const brandVerticalCount = useMemo(
    () => new Set(brandSites.map(p => p.vertical)).size,
    [brandSites],
  );

  return (
    <section className="pt-32 pb-24 bg-white min-h-screen">
      <Seo
        title="Our Work | Basic Tech"
        description="Selected projects by Basic Tech — web apps, mobile apps, AI, Web3, and e-commerce built for startups and businesses."
        canonical="https://basictech.in/work"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Basic Tech — Selected Work',
          url: 'https://basictech.in/work',
        }}
      />
      <div className="container mx-auto px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10 2xl:px-12">
        <Reveal>
          <p className="text-xs sm:text-sm font-semibold tracking-widest text-slate-400 uppercase mb-4">Our Work</p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-slate-900 tracking-tight mb-10 max-w-2xl">
            Products and platforms we've shipped.
          </h1>
        </Reveal>

        <FilterBar type={type} tag={tag} onType={setType} onTag={setTag} />

        {visible.length === 0 ? (
          <p className="text-slate-500">No projects match these filters.</p>
        ) : filtersActive ? (
          <div data-testid="project-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
            {visible.map(p => (
              <ProjectCard key={p.slug} project={p} />
            ))}
          </div>
        ) : (
          <div data-testid="project-grid" className="space-y-20">
            {platformWork.length > 0 && (
              <div>
                <Reveal>
                  <p className="text-xs sm:text-sm font-semibold tracking-widest text-slate-400 uppercase mb-3">Product & Platform Work</p>
                  <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight mb-8 max-w-2xl">
                    Deeper builds — apps, marketplaces, and platforms.
                  </h2>
                </Reveal>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
                  {platformWork.map(p => (
                    <ProjectCard key={p.slug} project={p} />
                  ))}
                </div>
              </div>
            )}

            {brandSites.length > 0 && (
              <div>
                <Reveal>
                  <p className="text-xs sm:text-sm font-semibold tracking-widest text-slate-400 uppercase mb-3">Brand Sites</p>
                  <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight mb-3 max-w-2xl">
                    {brandSites.length}+ brand sites across {brandVerticalCount} industries.
                  </h2>
                  <p className="text-sm sm:text-base text-slate-600 font-light leading-relaxed mb-8 max-w-2xl">
                    From healthcare and hospitality to media, F&amp;B, talent and podcast studios — a quick tour of the marketing and portfolio sites we've shipped for clients across domains.
                  </p>
                </Reveal>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
                  {brandSites.map(p => (
                    <ProjectCard key={p.slug} project={p} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default WorkIndex;
