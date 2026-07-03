import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { getProjectBySlug, getNextProject, TYPE_LABELS, TAG_LABELS } from '../lib/projects';
import { useContact } from '../components/layout/ContactContext';
import { Seo } from '../components/Seo';
import { Reveal } from '../components/ui/Reveal';

const WorkDetail: React.FC = () => {
  const { slug = '' } = useParams();
  const project = getProjectBySlug(slug);
  const { open } = useContact();

  if (!project) return <Navigate to="/" replace />;

  const next = getNextProject(project.slug);

  return (
    <article className="pt-32 pb-24 bg-white">
      <Seo
        title={`${project.name} — ${project.vertical} | Basic Tech`}
        description={project.summary}
        canonical={`https://basictech.in/work/${project.slug}`}
        image={project.cover.startsWith('http') ? project.cover : `https://basictech.in${project.cover}`}
        type="article"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'CreativeWork',
          name: project.name,
          about: project.vertical,
          url: `https://basictech.in/work/${project.slug}`,
          keywords: project.tech.join(', '),
        }}
      />
      <div className="container mx-auto px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10 2xl:px-12 max-w-4xl">
        <Link to="/work" className="text-sm text-slate-500 hover:text-brand-blue transition-colors">← All work</Link>

        {/* Hero */}
        <Reveal className="mt-6">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="text-[10px] font-mono tracking-wider uppercase bg-blue-50 text-brand-blue px-2 py-1 rounded-sm">
              {TYPE_LABELS[project.type]}
            </span>
            {project.tags.map(t => (
              <span key={t} className="text-[10px] font-medium uppercase tracking-wide text-slate-500 border border-slate-200 px-2 py-1 rounded-sm">
                {TAG_LABELS[t]}
              </span>
            ))}
            {project.year && <span className="text-xs text-slate-400">{project.year}</span>}
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-slate-900 tracking-tight leading-tight mb-3">
            {project.name}
          </h1>
          <p className="text-base sm:text-lg text-slate-600 font-light mb-2">{project.client} · {project.vertical}</p>
          <p className="text-lg text-slate-700 font-light leading-relaxed max-w-2xl">{project.summary}</p>

          <div className="flex flex-wrap gap-3 mt-6">
            {project.websiteUrl && (
              <a href={project.websiteUrl} target="_blank" rel="noopener noreferrer"
                 className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-blue hover:text-blue-700 px-4 py-2 border border-brand-blue/30 hover:border-brand-blue rounded-sm bg-white hover:bg-blue-50 transition-colors">
                Visit Website
              </a>
            )}
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
                 className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-700 hover:text-slate-900 px-4 py-2 border border-slate-300 hover:border-slate-400 rounded-sm bg-white hover:bg-slate-50 transition-colors">
                View Code
              </a>
            )}
          </div>
        </Reveal>

        {/* Cover */}
        <div className="relative overflow-hidden aspect-[16/9] bg-slate-100 rounded-sm shadow-sm my-12">
          <img src={project.cover} alt={project.name} className="w-full h-full object-contain" />
        </div>

        {/* Narrative */}
        <div className="grid grid-cols-1 gap-10">
          <Section title="The Problem" body={project.problem} />
          <Section title="Our Approach" body={project.approach} />
          <Section title="Outcome" body={project.outcome} />
        </div>

        {/* Highlights */}
        {project.highlights && project.highlights.length > 0 && (
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
            {project.highlights.map((h, i) => (
              <div key={i} className="border-l-2 border-brand-blue pl-4">
                <p className="text-sm font-medium text-slate-800 leading-snug">{h}</p>
              </div>
            ))}
          </div>
        )}

        {/* Tech */}
        <div className="mt-12">
          <h2 className="text-xs font-semibold tracking-widest text-slate-400 uppercase mb-4">Tech Stack</h2>
          <div className="flex flex-wrap gap-2">
            {project.tech.map((t, i) => (
              <span key={t} className="text-xs font-medium py-1 px-3 bg-white border border-slate-200 rounded-full text-slate-600 shadow-sm">{t}</span>
            ))}
          </div>
        </div>

        {/* Gallery */}
        {project.gallery && project.gallery.length > 0 && (
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {project.gallery.map((src, i) => (
              <img key={i} src={src} alt={`${project.name} screenshot ${i + 1}`} className="w-full rounded-sm shadow-sm" />
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mt-20 text-center bg-slate-50 rounded-lg py-12 px-6">
          <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight mb-4">Want to build something like this?</h2>
          <button onClick={open} className="bg-slate-900 text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-slate-800 transition-colors shadow-lg">
            Start a project
          </button>
        </div>

        {/* Next */}
        <div className="mt-16 border-t border-slate-200 pt-8 flex justify-between items-center">
          <span className="text-sm text-slate-400">Next project</span>
          <Link to={`/work/${next.slug}`} className="text-lg font-semibold text-slate-900 hover:text-brand-blue transition-colors">
            {next.name} →
          </Link>
        </div>
      </div>
    </article>
  );
};

const Section: React.FC<{ title: string; body: string }> = ({ title, body }) => (
  <div>
    <h2 className="text-xs font-semibold tracking-widest text-slate-400 uppercase mb-3">{title}</h2>
    <p className="text-base text-slate-700 font-light leading-relaxed">{body}</p>
  </div>
);

export default WorkDetail;
