export interface EngagementModel {
  slug: string;
  name: string;
  summary: string;
  bestFor: string;
  includes: string[];
  process: string[];
}

export const ENGAGEMENT_MODELS: EngagementModel[] = [
  {
    slug: 'mvp',
    name: 'Fixed-scope MVP',
    summary: 'A defined product, shipped in weeks — from idea to market-ready.',
    bestFor: 'Founders validating an idea or raising on a working product.',
    includes: ['Discovery & scope', 'Design & build', 'Launch & handover'],
    process: ['Scope workshop', 'Architecture first', 'Weekly build increments', 'Ship + support window'],
  },
  {
    slug: 'retainer',
    name: 'Monthly retainer',
    summary: 'A senior team, continuously — ongoing product and platform work.',
    bestFor: 'Teams that need sustained delivery without hiring in-house.',
    includes: ['Dedicated engineers', 'Roadmap & delivery', 'Maintenance & on-call'],
    process: ['Onboarding', 'Rolling backlog', 'Biweekly reviews', 'Continuous delivery'],
  },
  {
    slug: 'build-partner',
    name: 'Build-partner',
    summary: 'We build alongside you, longer-term — co-owning outcomes.',
    bestFor: 'Ventures where deep, shared ownership beats a vendor relationship.',
    includes: ['Embedded team', 'Shared roadmap', 'Equity / blended models'],
    process: ['Alignment', 'Joint planning', 'Build & iterate', 'Scale together'],
  },
];
