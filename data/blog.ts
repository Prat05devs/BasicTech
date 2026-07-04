import { loadCollection } from '../lib/content';

export const BLOG = loadCollection(import.meta.glob('/content/blog/*.mdx', { eager: true }));
