import { loadCollection } from '../lib/content';

export const RESEARCH_ARTICLES = loadCollection(import.meta.glob('/content/research/*.mdx', { eager: true }));
