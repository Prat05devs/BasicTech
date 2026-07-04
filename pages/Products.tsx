import React from 'react';
import { PRODUCTS } from '../data/products';
import { ProductCard } from '../components/products/ProductCard';
import { UniunFeature } from '../components/products/UniunFeature';
import { Seo } from '../components/Seo';
import { Reveal } from '../components/ui/Reveal';

const Products: React.FC = () => {
  const otherProducts = PRODUCTS.filter((p) => p.slug !== 'uniun');
  return (
    <section className="pt-32 pb-24 bg-white min-h-screen">
      <Seo
        title="Products | Basic Tech"
        description="The micro-SaaS products Basic Tech is building — an AI-first studio shipping its own software."
        canonical="https://basictech.in/products"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Basic Tech — Products',
          url: 'https://basictech.in/products',
        }}
      />
      <div className="container mx-auto px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10 2xl:px-12">
        <Reveal>
          <p className="text-xs sm:text-sm font-semibold tracking-widest text-slate-400 uppercase mb-4">Products</p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-slate-900 tracking-tight mb-4 max-w-2xl">
            The products we're building.
          </h1>
          <p className="text-base sm:text-lg text-slate-600 font-light mb-12 max-w-2xl">
            We don't just build software for clients — we build our own. Here's what's in the works.
          </p>
        </Reveal>

        <UniunFeature />

        {otherProducts.length > 0 && (
          <div
            data-testid="product-grid"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mt-16"
          >
            {otherProducts.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Products;
