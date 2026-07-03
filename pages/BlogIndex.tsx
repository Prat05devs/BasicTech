import React from 'react';
import { BLOG } from '../data/blog';
import { PostCard } from '../components/content/PostCard';
import { Seo } from '../components/Seo';
import { Reveal } from '../components/ui/Reveal';

const BlogIndex: React.FC = () => (
  <section className="pt-32 pb-24 bg-white min-h-screen">
    <Seo
      title="Blog | Basic Tech"
      description="Engineering notes, product thinking, and deep dives from the Basic Tech team."
      canonical="https://basictech.in/blog"
      jsonLd={{ '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'Basic Tech Blog', url: 'https://basictech.in/blog' }}
    />
    <div className="container mx-auto px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10 2xl:px-12 max-w-3xl">
      <Reveal>
        <p className="text-xs sm:text-sm font-semibold tracking-widest text-slate-400 uppercase mb-4">Blog</p>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-slate-900 tracking-tight mb-12">Writing from the team.</h1>
      </Reveal>
      <div data-testid="post-list">
        {BLOG.map((e) => <PostCard key={e.slug} entry={e} basePath="/blog" />)}
      </div>
    </div>
  </section>
);

export default BlogIndex;
