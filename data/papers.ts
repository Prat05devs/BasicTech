export interface Paper {
  slug: string;
  title: string;
  authors: string[];
  venue?: string;
  date: string;       // ISO
  abstract: string;
  url: string;        // external link / PDF
  tags?: string[];
}

// TODO: replace with real publications. The sample uses a real, stable link.
export const PAPERS: Paper[] = [
  {
    slug: 'sample-paper',
    title: 'TODO: Paper title',
    authors: ['TODO: Author One', 'TODO: Author Two'],
    venue: 'TODO: Venue / arXiv',
    date: '2026-01-01',
    abstract: 'TODO: short abstract describing the contribution.',
    url: 'https://arxiv.org/',
    tags: ['TODO'],
  },
];
