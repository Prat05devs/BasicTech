import React from 'react';
import { Link } from 'react-router-dom';
import { Seo } from '../components/Seo';

const NotFound: React.FC = () => (
  <section className="min-h-[70vh] flex items-center justify-center bg-white">
    <Seo title="Page Not Found | Basic Tech" description="The page you were looking for doesn't exist." />
    <div className="text-center px-6">
      <p className="text-brand-blue font-mono text-sm tracking-widest uppercase mb-3">404</p>
      <h1 className="text-3xl sm:text-4xl font-semibold text-slate-900 tracking-tight mb-4">Page not found</h1>
      <p className="text-slate-600 mb-8">The page you were looking for doesn't exist or has moved.</p>
      <Link to="/" className="inline-block bg-slate-900 text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-slate-800 transition-colors">
        Back to home
      </Link>
    </div>
  </section>
);

export default NotFound;
