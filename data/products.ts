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
  appStoreUrl?: string;  // iOS App Store link
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

export const PRODUCTS: Product[] = [
  {
    slug: 'uniun',
    name: 'Uniun',
    tagline: 'Your decentralized second brain.',
    description:
      'A note-taking app built on Nostr. Capture notes, connect them into a knowledge graph, share on an open network, and chat with an on-device AI — your keys, your data, no cloud in the middle.',
    status: 'live',
    category: 'Productivity',
    cover: '/uniun-logo.png',
    url: 'https://www.uniun.in/',
    appStoreUrl: 'https://apps.apple.com/in/app/uniun/id6778077321',
  },
];
