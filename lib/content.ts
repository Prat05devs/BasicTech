import type { ComponentType } from 'react';

export interface Frontmatter {
  title: string;
  date: string;       // ISO 'YYYY-MM-DD'
  excerpt: string;
  tags?: string[];
  author?: string;
  cover?: string;
}

export interface ContentEntry {
  slug: string;
  frontmatter: Frontmatter;
  Component: ComponentType;
}

type MdxModule = { default: ComponentType; frontmatter: Frontmatter };

/** Turn an import.meta.glob('…*.mdx', { eager: true }) result into a sorted list. */
export function loadCollection(modules: Record<string, unknown>): ContentEntry[] {
  return Object.entries(modules)
    .map(([path, mod]) => {
      const m = mod as MdxModule;
      const slug = path.split('/').pop()!.replace(/\.mdx$/, '');
      return { slug, frontmatter: m.frontmatter, Component: m.default };
    })
    .sort((a, b) => (a.frontmatter.date < b.frontmatter.date ? 1 : -1));
}

export function getEntry(entries: ContentEntry[], slug: string): ContentEntry | undefined {
  return entries.find((e) => e.slug === slug);
}
