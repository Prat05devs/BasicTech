import { loadCollection } from '../lib/content';

export const LEGAL = loadCollection(import.meta.glob('/content/legal/*.mdx', { eager: true }));
