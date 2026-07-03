import React from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { BLOG } from '../data/blog';
import { getEntry } from '../lib/content';
import { Prose } from '../components/content/Prose';
import { Seo } from '../components/Seo';
import { formatDate } from '../lib/format';

const BlogPost: React.FC = () => {
  const { slug = '' } = useParams();
  const entry = getEntry(BLOG, slug);
  if (!entry) return <Navigate to="/blog" replace />;
  const { frontmatter } = entry;

  return (
    <article className="pt-32 pb-24 bg-white">
      <Seo
        title={`${frontmatter.title} | Basic Tech`}
        description={frontmatter.excerpt}
        canonical={`https://basictech.in/blog/${slug}`}
        type="article"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: frontmatter.title,
          datePublished: frontmatter.date,
          author: { '@type': 'Organization', name: frontmatter.author || 'Basic Tech' },
          url: `https://basictech.in/blog/${slug}`,
        }}
      />
      <div className="container mx-auto px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10 2xl:px-12 max-w-3xl">
        <Link to="/blog" className="text-sm text-slate-500 hover:text-brand-blue transition-colors">← All posts</Link>
        <header className="my-8">
          <time dateTime={frontmatter.date} className="text-sm text-slate-400">{formatDate(frontmatter.date)}</time>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-slate-900 tracking-tight leading-tight mt-2">
            {frontmatter.title}
          </h1>
          {frontmatter.author && <p className="text-slate-500 mt-3">By {frontmatter.author}</p>}
        </header>
        <Prose entry={entry} />
      </div>
    </article>
  );
};

export default BlogPost;
