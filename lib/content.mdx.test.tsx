import { describe, it, expect } from 'vitest';
import { loadCollection } from './content';

const modules = import.meta.glob('/content/blog/*.mdx', { eager: true });

describe('MDX pipeline', () => {
  it('compiles the sample post and exposes frontmatter + a component', () => {
    const entries = loadCollection(modules);
    const hello = entries.find((e) => e.slug === 'hello-world');
    expect(hello).toBeDefined();
    expect(hello!.frontmatter.title).toMatch(/blog/i);
    expect(typeof hello!.Component).toBe('function');
  });
});
