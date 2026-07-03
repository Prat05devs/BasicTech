export type ProductStatus = 'building' | 'beta' | 'coming-soon' | 'live';

export interface Product {
  slug: string;
  name: string;
  tagline: string;       // one-line value proposition
  description: string;
  status: ProductStatus;
  category: string;      // e.g. 'AI', 'DevTools', 'Productivity'
  cover?: string;
  url?: string;          // present when beta/live
}

export const STATUS_LABELS: Record<ProductStatus, string> = {
  building: 'In Development',
  beta: 'Beta',
  'coming-soon': 'Coming Soon',
  live: 'Live',
};

export const STATUS_STYLES: Record<ProductStatus, string> = {
  building: 'bg-amber-50 text-amber-700 border-amber-200',
  beta: 'bg-blue-50 text-brand-blue border-brand-blue/20',
  'coming-soon': 'bg-slate-100 text-slate-600 border-slate-200',
  live: 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

// Placeholder catalog — TODO: replace with real products, taglines, and statuses.
export const PRODUCTS: Product[] = [
  {
    slug: 'product-one',
    name: 'TODO: Product One',
    tagline: 'TODO: one-line value proposition for product one.',
    description: 'TODO: what it does, who it is for, and why it matters.',
    status: 'building',
    category: 'AI',
  },
  {
    slug: 'product-two',
    name: 'TODO: Product Two',
    tagline: 'TODO: one-line value proposition for product two.',
    description: 'TODO: what it does, who it is for, and why it matters.',
    status: 'coming-soon',
    category: 'DevTools',
  },
  {
    slug: 'product-three',
    name: 'TODO: Product Three',
    tagline: 'TODO: one-line value proposition for product three.',
    description: 'TODO: what it does, who it is for, and why it matters.',
    status: 'beta',
    category: 'Productivity',
  },
];
