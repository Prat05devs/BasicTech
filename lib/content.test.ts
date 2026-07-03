import { describe, it, expect } from 'vitest';
import { loadCollection, getEntry } from './content';

const Fake = () => null;
const modules = {
  '/content/blog/older.mdx': { default: Fake, frontmatter: { title: 'Older', date: '2026-01-01', excerpt: 'o' } },
  '/content/blog/newer.mdx': { default: Fake, frontmatter: { title: 'Newer', date: '2026-06-01', excerpt: 'n' } },
};

describe('content loader', () => {
  it('derives slugs from filenames and sorts by date desc', () => {
    expect(loadCollection(modules).map((e) => e.slug)).toEqual(['newer', 'older']);
  });
  it('getEntry finds by slug and returns undefined for misses', () => {
    const entries = loadCollection(modules);
    expect(getEntry(entries, 'older')?.frontmatter.title).toBe('Older');
    expect(getEntry(entries, 'nope')).toBeUndefined();
  });
});
