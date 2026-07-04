import { describe, it, expect } from 'vitest';
import { loadCollection } from './content';

const modules = import.meta.glob('/content/blog/*.mdx', { eager: true });

describe('MDX pipeline', () => {
  it('compiles the sample post and exposes frontmatter + a component', () => {
    const entries = loadCollection(modules);
    const post = entries.find((e) => e.slug === 'harness-loops-agents-skills');
    expect(post).toBeDefined();
    expect(post!.frontmatter.title).toMatch(/harness/i);
    expect(typeof post!.Component).toBe('function');
  });
});
