# Phase 3 — Team, Blog & Research Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `/team` page, a `/blog` (+ `/blog/:slug`) MDX-powered blog, and a `/research` (+ `/research/:slug`) page that lists curated external papers and self-authored MDX articles — all statically prerendered.

**Architecture:** Introduce an MDX content pipeline (`@mdx-js/rollup` + remark frontmatter) shared by blog and research articles via a single `lib/content.ts` loader fed by `import.meta.glob`. Reuse the M1/M2 foundation (vite-react-ssg static + `getStaticPaths` dynamic prerender, `Seo`, `Reveal`, `NAV_LINKS`). Markdown is styled with `@tailwindcss/typography`.

**Tech Stack:** React 19, TS ~5.8, Vite 6, react-router-dom 6.30, vite-react-ssg 0.8.9, @mdx-js/rollup 3, remark-frontmatter 5, remark-mdx-frontmatter 5, @tailwindcss/typography 0.5, Tailwind v3 (PostCSS). Tests: Vitest + RTL. Package manager: **yarn**.

## Global Constraints

- **Package manager is yarn.** `yarn add`, `yarn test`, `yarn build`, `yarn dev`. NEVER npm / `package-lock.json`.
- **DO NOT run `git commit`.** No-commit mode. Each "Checkpoint" = `git add -A` to STAGE + run verification + STOP; the human commits.
- **Files at the repo ROOT** (`pages/`, `components/`, `data/`, `lib/`, `content/`, `routes.tsx`), not `src/`.
- **Brand tokens exact:** `brand.blue #2F80ED`, `brand.dark #0f172a`, Inter. Reuse the existing design system (`Reveal`, `container mx-auto px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10 2xl:px-12`). No new visual language.
- **Prerender:** static routes (`/team`, `/blog`, `/research`) auto-discover; dynamic routes (`/blog/:slug`, `/research/:slug`) use `getStaticPaths` returning every slug (the M1 `/work/:slug` pattern). No `vite.config ssgOptions.includedRoutes` change needed for these.
- **SEO:** each new route prerenders ONE `<title>`/description/canonical + JSON-LD. `index.html` carries no per-page tags (M1) — do not re-add.
- **MDX content authored in `content/blog/*.mdx` and `content/research/*.mdx`** with frontmatter (`title, date, excerpt, tags?, author?, cover?`). One real sample each (demonstrable, not `TODO:` junk). Data-driven placeholders (`team`, `papers`) keep `TODO:` markers.
- **MDX × vite-react-ssg × React 19 is the risk surface** — Tasks 1–2 prove it (compile/load, then prerender) before later tasks build on it.

---

## File Structure

**New**
- `lib/content.ts` (+ `lib/content.test.ts`, `lib/content.mdx.test.tsx`) — collection loader.
- `types/mdx.d.ts` — `*.mdx` module typing.
- `content/blog/hello-world.mdx`, `content/research/sample-writeup.mdx` — samples.
- `data/blog.ts`, `data/researchArticles.ts` — globbed MDX collections.
- `data/team.ts`, `data/papers.ts` — data-driven content.
- `components/content/PostCard.tsx`, `components/content/Prose.tsx` — shared blog/research UI.
- `components/team/MemberCard.tsx`, `components/research/PaperCard.tsx`.
- `pages/Team.tsx`, `pages/BlogIndex.tsx`, `pages/BlogPost.tsx`, `pages/Research.tsx`, `pages/ResearchArticle.tsx`.
- Tests: `pages/Team.test.tsx`, `pages/BlogIndex.test.tsx`, `pages/BlogPost.test.tsx`, `pages/Research.test.tsx`, `pages/ResearchArticle.test.tsx`.

**Modified**
- `vite.config.ts`, `vitest.config.ts` — add MDX plugin.
- `tailwind.config.js` — add typography plugin (+ content glob).
- `package.json` — deps.
- `routes.tsx` — 5 new routes.
- `components/layout/Layout.tsx` (`NAV_LINKS`) + `components/layout/Nav.test.tsx`.

---

## Task 1: MDX pipeline + content loader

Stand up MDX and the shared loader, proven by a test that compiles the real sample post. No new routes yet.

**Files:**
- Modify: `vite.config.ts`, `vitest.config.ts`, `tailwind.config.js`, `package.json`
- Create: `types/mdx.d.ts`, `lib/content.ts`, `lib/content.test.ts`, `lib/content.mdx.test.tsx`, `content/blog/hello-world.mdx`

**Interfaces:**
- Produces: `Frontmatter` (`{ title; date; excerpt; tags?; author?; cover? }`), `ContentEntry` (`{ slug; frontmatter: Frontmatter; Component: React.ComponentType }`), `loadCollection(modules: Record<string, unknown>): ContentEntry[]` (slug from filename, sorted by `date` desc), `getEntry(entries, slug): ContentEntry | undefined`.

- [ ] **Step 1: Add dependencies**

```bash
yarn add -D @mdx-js/rollup@^3.1.0 remark-frontmatter@^5.0.0 remark-mdx-frontmatter@^5.0.0 @tailwindcss/typography@^0.5.15
```

- [ ] **Step 2: Add the MDX plugin to `vite.config.ts`**

Add these imports at the top (keep existing imports):
```ts
import mdx from '@mdx-js/rollup';
import remarkFrontmatter from 'remark-frontmatter';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';
```
In the returned config's `plugins` array, add the MDX plugin as the FIRST entry (before `react()`), preserving everything else (including the existing `ssgOptions`):
```ts
      plugins: [
        { enforce: 'pre', ...mdx({ remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter] }) },
        react(),
      ],
```

- [ ] **Step 3: Add the MDX plugin to `vitest.config.ts`**

Mirror it so tests can import `.mdx`:
```ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import mdx from '@mdx-js/rollup'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'

export default defineConfig({
  plugins: [
    { enforce: 'pre', ...mdx({ remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter] }) },
    react(),
  ],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './test/setup.ts',
  },
})
```

- [ ] **Step 4: Add the typography plugin to `tailwind.config.js`**

Add the import at the top and register the plugin (keep the rest of the config unchanged):
```js
import typography from '@tailwindcss/typography'
```
- Change `content` to include MDX: `content: ['./index.html', './**/*.{ts,tsx}', './content/**/*.mdx', '!./node_modules/**'],`
- Change `plugins: []` to `plugins: [typography],`

- [ ] **Step 5: Create `types/mdx.d.ts`**

```ts
declare module '*.mdx' {
  import type { ComponentType } from 'react';
  export const frontmatter: Record<string, unknown>;
  const MDXComponent: ComponentType;
  export default MDXComponent;
}
```

- [ ] **Step 6: Create the sample post `content/blog/hello-world.mdx`**

```mdx
---
title: "Welcome to the Basic Tech blog"
date: "2026-07-01"
excerpt: "Why we publish, and a quick tour of what to expect from this space."
tags: ["announcements"]
author: "Basic Tech"
---

We build software for clients and our own micro-SaaS products. This is where we
share what we learn along the way — engineering notes, product thinking, and the
occasional deep dive.

## Why we write

Writing forces clarity. If we can explain a decision simply, we understand it.

```js
const hello = "world";
console.log(hello);
```

More soon.
```

- [ ] **Step 7: Implement `lib/content.ts`**

```ts
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
```

- [ ] **Step 8: Write the loader unit test `lib/content.test.ts`**

```ts
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
```

- [ ] **Step 9: Write the MDX pipeline proof test `lib/content.mdx.test.tsx`**

This compiles the REAL sample `.mdx` through the vitest MDX plugin and checks frontmatter + component:
```tsx
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
```

- [ ] **Step 10: Run the tests**

Run: `yarn test lib/content.test.ts lib/content.mdx.test.tsx`
Expected: PASS — loader logic + MDX compile/frontmatter both pass. If the MDX test fails to import `.mdx`, the vitest MDX plugin (Step 3) isn't wired right — fix before proceeding.

- [ ] **Step 11: Verify the production build still works**

Run: `yarn build`
Expected: succeeds; still prerenders 13 pages (no new routes yet); no MDX-related build errors.

- [ ] **Step 12: Checkpoint (user commits)**

```bash
git add vite.config.ts vitest.config.ts tailwind.config.js package.json yarn.lock types/mdx.d.ts lib/content.ts lib/content.test.ts lib/content.mdx.test.tsx content/blog/hello-world.mdx
git status
```

---

## Task 2: Blog (`/blog` + `/blog/:slug`) — proves MDX prerenders

**Files:**
- Create: `data/blog.ts`, `components/content/PostCard.tsx`, `components/content/Prose.tsx`, `pages/BlogIndex.tsx`, `pages/BlogPost.tsx`, `pages/BlogIndex.test.tsx`, `pages/BlogPost.test.tsx`
- Modify: `routes.tsx`

**Interfaces:**
- Consumes: `BLOG: ContentEntry[]`, `getEntry`, `Seo`, `Reveal`.
- Produces: `PostCard: React.FC<{ entry: ContentEntry; basePath: string }>`, `Prose: React.FC<{ entry: ContentEntry }>`, `BlogIndex`/`BlogPost` (default exports), `BLOG` (from `data/blog.ts`).

- [ ] **Step 1: Create `data/blog.ts`**

```ts
import { loadCollection } from '../lib/content';

export const BLOG = loadCollection(import.meta.glob('/content/blog/*.mdx', { eager: true }));
```

- [ ] **Step 2: Create `components/content/PostCard.tsx`**

```tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { ContentEntry } from '../../lib/content';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

export const PostCard: React.FC<{ entry: ContentEntry; basePath: string }> = ({ entry, basePath }) => (
  <Link to={`${basePath}/${entry.slug}`} className="group block border-b border-slate-200 py-8">
    <div className="flex items-center gap-3 mb-2 text-xs text-slate-400">
      <time dateTime={entry.frontmatter.date}>{formatDate(entry.frontmatter.date)}</time>
      {entry.frontmatter.tags?.map((t) => <span key={t} className="text-brand-blue font-mono">#{t}</span>)}
    </div>
    <h3 className="text-xl sm:text-2xl font-semibold text-slate-900 tracking-tight group-hover:text-brand-blue transition-colors mb-2">
      {entry.frontmatter.title}
    </h3>
    <p className="text-slate-600 font-light leading-relaxed">{entry.frontmatter.excerpt}</p>
  </Link>
);
```

- [ ] **Step 3: Create `components/content/Prose.tsx`**

```tsx
import React from 'react';
import { ContentEntry } from '../../lib/content';

export const Prose: React.FC<{ entry: ContentEntry }> = ({ entry }) => {
  const { Component } = entry;
  return (
    <div className="prose prose-slate max-w-none prose-headings:tracking-tight prose-a:text-brand-blue prose-pre:bg-slate-900">
      <Component />
    </div>
  );
};
```

- [ ] **Step 4: Write the failing test `pages/BlogIndex.test.tsx`**

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import BlogIndex from './BlogIndex';
import { BLOG } from '../data/blog';

describe('BlogIndex', () => {
  it('renders a card per post linking to its slug', () => {
    render(<MemoryRouter><BlogIndex /></MemoryRouter>);
    const list = screen.getByTestId('post-list');
    expect(within(list).getAllByRole('link').length).toBe(BLOG.length);
    expect(within(list).getByText('Welcome to the Basic Tech blog')).toBeInTheDocument();
    expect(within(list).getByRole('link', { name: /Welcome to the Basic Tech blog/ })).toHaveAttribute('href', '/blog/hello-world');
  });
});
```

- [ ] **Step 5: Run it to confirm failure**

Run: `yarn test pages/BlogIndex.test.tsx`
Expected: FAIL — cannot resolve `./BlogIndex`.

- [ ] **Step 6: Implement `pages/BlogIndex.tsx`**

```tsx
import React from 'react';
import { BLOG } from '../data/blog';
import { PostCard } from '../components/content/PostCard';
import { Seo } from '../components/Seo';
import { Reveal } from '../components/ui/Reveal';

const BlogIndex: React.FC = () => (
  <section className="pt-32 pb-24 bg-white min-h-screen">
    <Seo
      title="Blog | Basic Tech"
      description="Engineering notes, product thinking, and deep dives from the Basic Tech team."
      canonical="https://basictech.in/blog"
      jsonLd={{ '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'Basic Tech Blog', url: 'https://basictech.in/blog' }}
    />
    <div className="container mx-auto px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10 2xl:px-12 max-w-3xl">
      <Reveal>
        <p className="text-xs sm:text-sm font-semibold tracking-widest text-slate-400 uppercase mb-4">Blog</p>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-slate-900 tracking-tight mb-12">Writing from the team.</h1>
      </Reveal>
      <div data-testid="post-list">
        {BLOG.map((e) => <PostCard key={e.slug} entry={e} basePath="/blog" />)}
      </div>
    </div>
  </section>
);

export default BlogIndex;
```

- [ ] **Step 7: Run it to confirm pass**

Run: `yarn test pages/BlogIndex.test.tsx`
Expected: PASS.

- [ ] **Step 8: Write the failing test `pages/BlogPost.test.tsx`**

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import BlogPost from './BlogPost';

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/blog" element={<div>blog index</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('BlogPost', () => {
  it('renders the MDX body of a known post', () => {
    renderAt('/blog/hello-world');
    expect(screen.getByRole('heading', { level: 1, name: 'Welcome to the Basic Tech blog' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Why we write' })).toBeInTheDocument(); // from the MDX body
  });
  it('redirects an unknown slug to /blog', () => {
    renderAt('/blog/nope');
    expect(screen.getByText('blog index')).toBeInTheDocument();
  });
});
```

- [ ] **Step 9: Run it to confirm failure**

Run: `yarn test pages/BlogPost.test.tsx`
Expected: FAIL — cannot resolve `./BlogPost`.

- [ ] **Step 10: Implement `pages/BlogPost.tsx`**

```tsx
import React from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { BLOG } from '../data/blog';
import { getEntry } from '../lib/content';
import { Prose } from '../components/content/Prose';
import { Seo } from '../components/Seo';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

const BlogPost: React.FC = () => {
  const { slug = '' } = useParams();
  const entry = getEntry(BLOG, slug);
  if (!entry) return <Navigate to="/blog" replace />;
  const { frontmatter } = entry;

  return (
    <article className="pt-32 pb-24 bg-white">
      <Seo
        title={`${frontmatter.title} | Basic Tech`}
        description={frontmatter.excerpt}
        canonical={`https://basictech.in/blog/${slug}`}
        type="article"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: frontmatter.title,
          datePublished: frontmatter.date,
          author: { '@type': 'Organization', name: frontmatter.author || 'Basic Tech' },
          url: `https://basictech.in/blog/${slug}`,
        }}
      />
      <div className="container mx-auto px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10 2xl:px-12 max-w-3xl">
        <Link to="/blog" className="text-sm text-slate-500 hover:text-brand-blue transition-colors">← All posts</Link>
        <header className="my-8">
          <time dateTime={frontmatter.date} className="text-sm text-slate-400">{formatDate(frontmatter.date)}</time>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-slate-900 tracking-tight leading-tight mt-2">
            {frontmatter.title}
          </h1>
          {frontmatter.author && <p className="text-slate-500 mt-3">By {frontmatter.author}</p>}
        </header>
        <Prose entry={entry} />
      </div>
    </article>
  );
};

export default BlogPost;
```

- [ ] **Step 11: Run it to confirm pass**

Run: `yarn test pages/BlogPost.test.tsx`
Expected: PASS — both tests pass (MDX body renders; unknown slug redirects).

- [ ] **Step 12: Register the blog routes**

In `routes.tsx`, add imports and the routes BEFORE `{ path: '*' }`:
```tsx
import BlogIndex from './pages/BlogIndex';
import BlogPost from './pages/BlogPost';
import { BLOG } from './data/blog';
```
```tsx
  { path: 'blog', Component: BlogIndex },
  { path: 'blog/:slug', Component: BlogPost, getStaticPaths: () => BLOG.map((e) => `/blog/${e.slug}`) },
```

- [ ] **Step 13: Build-verify MDX prerenders (the key risk gate)**

Run: `yarn build`
Expected: build succeeds; `/blog` and the post prerender, and the MDX BODY text is in the static HTML:
```bash
test -e dist/blog.html && echo "blog index ok"
ls dist/blog        # expect hello-world.html
grep -c '<title' dist/blog/hello-world.html         # expect 1
grep -o 'rel="canonical" href="[^"]*"' dist/blog/hello-world.html   # expect https://basictech.in/blog/hello-world
grep -q "Why we write" dist/blog/hello-world.html && echo "MDX body prerendered"
```
If the body text is NOT present (only an empty shell), MDX isn't prerendering through vite-react-ssg — STOP and resolve the pipeline here (this is the gated risk) before proceeding.

- [ ] **Step 14: Full suite**

Run: `yarn test`
Expected: all green.

- [ ] **Step 15: Checkpoint (user commits)**

```bash
git add data/blog.ts components/content/PostCard.tsx components/content/Prose.tsx pages/BlogIndex.tsx pages/BlogPost.tsx pages/BlogIndex.test.tsx pages/BlogPost.test.tsx routes.tsx
git status
```

---

## Task 3: Team (`/team`)

**Files:**
- Create: `data/team.ts`, `components/team/MemberCard.tsx`, `pages/Team.tsx`, `pages/Team.test.tsx`
- Modify: `routes.tsx`

**Interfaces:**
- Consumes: `Seo`, `Reveal`.
- Produces: `TeamMember` (`{ slug; name; role; bio; photo?; links? }`), `TEAM`, `MemberCard: React.FC<{ member: TeamMember }>`, `Team` (default export).

- [ ] **Step 1: Create `data/team.ts`**

```ts
export interface TeamMemberLink { label: string; href: string; }

export interface TeamMember {
  slug: string;
  name: string;
  role: string;
  bio: string;
  photo?: string;
  links?: TeamMemberLink[];
}

// TODO: replace with real team members, bios, photos, and links.
export const TEAM: TeamMember[] = [
  { slug: 'member-one', name: 'TODO: Member One', role: 'TODO: Role', bio: 'TODO: short bio.', links: [] },
  { slug: 'member-two', name: 'TODO: Member Two', role: 'TODO: Role', bio: 'TODO: short bio.', links: [] },
  { slug: 'member-three', name: 'TODO: Member Three', role: 'TODO: Role', bio: 'TODO: short bio.', links: [] },
];
```

- [ ] **Step 2: Create `components/team/MemberCard.tsx`**

```tsx
import React from 'react';
import { motion } from 'framer-motion';
import { TeamMember } from '../../data/team';

export const MemberCard: React.FC<{ member: TeamMember }> = ({ member }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.6 }}
    className="flex flex-col"
  >
    <div className="aspect-square w-full bg-slate-100 rounded-lg mb-4 overflow-hidden">
      {member.photo && <img src={member.photo} alt={member.name} className="w-full h-full object-cover grayscale" />}
    </div>
    <h3 className="text-lg font-semibold text-slate-900 tracking-tight">{member.name}</h3>
    <p className="text-sm text-brand-blue font-medium mb-2">{member.role}</p>
    <p className="text-sm text-slate-600 font-light leading-relaxed mb-3">{member.bio}</p>
    {member.links && member.links.length > 0 && (
      <div className="flex flex-wrap gap-3 mt-auto">
        {member.links.map((l) => (
          <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-slate-500 hover:text-brand-blue transition-colors">
            {l.label}
          </a>
        ))}
      </div>
    )}
  </motion.div>
);
```

- [ ] **Step 3: Write the failing test `pages/Team.test.tsx`**

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Team from './Team';
import { TEAM } from '../data/team';

describe('Team', () => {
  it('renders a card per team member', () => {
    render(<MemoryRouter><Team /></MemoryRouter>);
    const grid = screen.getByTestId('team-grid');
    expect(within(grid).getAllByRole('heading', { level: 3 }).length).toBe(TEAM.length);
  });
});
```

- [ ] **Step 4: Run it to confirm failure**

Run: `yarn test pages/Team.test.tsx`
Expected: FAIL — cannot resolve `./Team`.

- [ ] **Step 5: Implement `pages/Team.tsx`**

```tsx
import React from 'react';
import { TEAM } from '../data/team';
import { MemberCard } from '../components/team/MemberCard';
import { Seo } from '../components/Seo';
import { Reveal } from '../components/ui/Reveal';

const Team: React.FC = () => (
  <section className="pt-32 pb-24 bg-white min-h-screen">
    <Seo
      title="Team | Basic Tech"
      description="The people behind Basic Tech — a small team of engineers building software and our own products."
      canonical="https://basictech.in/team"
      jsonLd={{ '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'Basic Tech Team', url: 'https://basictech.in/team' }}
    />
    <div className="container mx-auto px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10 2xl:px-12">
      <Reveal>
        <p className="text-xs sm:text-sm font-semibold tracking-widest text-slate-400 uppercase mb-4">Team</p>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-slate-900 tracking-tight mb-4 max-w-2xl">The people behind the work.</h1>
        <p className="text-base sm:text-lg text-slate-600 font-light mb-12 max-w-2xl">A small team of engineers who care about systems, not just frameworks.</p>
      </Reveal>
      <div data-testid="team-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
        {TEAM.map((m) => <MemberCard key={m.slug} member={m} />)}
      </div>
    </div>
  </section>
);

export default Team;
```

- [ ] **Step 6: Run it to confirm pass**

Run: `yarn test pages/Team.test.tsx`
Expected: PASS.

- [ ] **Step 7: Register the `/team` route**

In `routes.tsx`, add the import and the route BEFORE `{ path: '*' }`:
```tsx
import Team from './pages/Team';
```
```tsx
  { path: 'team', Component: Team },
```

- [ ] **Step 8: Build-verify**

Run: `yarn build`
Expected: `dist/team.html` exists, one `<title>`, canonical `https://basictech.in/team`.
```bash
test -e dist/team.html && echo "team ok"; grep -c '<title' dist/team.html
```

- [ ] **Step 9: Checkpoint (user commits)**

```bash
git add data/team.ts components/team/MemberCard.tsx pages/Team.tsx pages/Team.test.tsx routes.tsx
git status
```

---

## Task 4: Research (`/research` + `/research/:slug`)

Two-section research page (curated papers + MDX articles) + article detail pages, reusing the Task-2 pipeline.

**Files:**
- Create: `data/papers.ts`, `data/researchArticles.ts`, `content/research/sample-writeup.mdx`, `components/research/PaperCard.tsx`, `pages/Research.tsx`, `pages/ResearchArticle.tsx`, `pages/Research.test.tsx`, `pages/ResearchArticle.test.tsx`
- Modify: `routes.tsx`

**Interfaces:**
- Consumes: `loadCollection`/`getEntry` (Task 1), `PostCard`/`Prose` (Task 2), `Seo`, `Reveal`.
- Produces: `Paper` (`{ slug; title; authors; venue?; date; abstract; url; tags? }`), `PAPERS`, `RESEARCH_ARTICLES: ContentEntry[]`, `PaperCard`, `Research`/`ResearchArticle` (default exports).

- [ ] **Step 1: Create `data/papers.ts`**

```ts
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
```

- [ ] **Step 2: Create the sample article `content/research/sample-writeup.mdx`**

```mdx
---
title: "A sample research write-up"
date: "2026-07-01"
excerpt: "How we document internal research and experiments in long form."
tags: ["research"]
author: "Basic Tech"
---

This is a sample research article. Longer-form technical write-ups live here,
authored in MDX alongside the blog.

## Method

Describe the approach, with code or math as needed.

```py
def f(x):
    return x * 2
```

## Results

Summarize findings and link to any external papers.
```

- [ ] **Step 3: Create `data/researchArticles.ts`**

```ts
import { loadCollection } from '../lib/content';

export const RESEARCH_ARTICLES = loadCollection(import.meta.glob('/content/research/*.mdx', { eager: true }));
```

- [ ] **Step 4: Create `components/research/PaperCard.tsx`**

```tsx
import React from 'react';
import { Paper } from '../../data/papers';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
}

export const PaperCard: React.FC<{ paper: Paper }> = ({ paper }) => (
  <a href={paper.url} target="_blank" rel="noopener noreferrer" className="group block border border-slate-200 rounded-lg p-6 bg-white hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
    <div className="flex items-center gap-3 mb-2 text-xs text-slate-400">
      <time dateTime={paper.date}>{formatDate(paper.date)}</time>
      {paper.venue && <span>· {paper.venue}</span>}
    </div>
    <h3 className="text-lg font-semibold text-slate-900 tracking-tight group-hover:text-brand-blue transition-colors mb-1">{paper.title}</h3>
    <p className="text-xs text-slate-500 mb-3">{paper.authors.join(', ')}</p>
    <p className="text-sm text-slate-600 font-light leading-relaxed mb-3">{paper.abstract}</p>
    <span className="text-sm font-medium text-brand-blue">Read paper →</span>
  </a>
);
```

- [ ] **Step 5: Write the failing test `pages/Research.test.tsx`**

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Research from './Research';
import { PAPERS } from '../data/papers';
import { RESEARCH_ARTICLES } from '../data/researchArticles';

describe('Research', () => {
  it('renders papers and articles sections', () => {
    render(<MemoryRouter><Research /></MemoryRouter>);
    const papers = screen.getByTestId('papers-list');
    const articles = screen.getByTestId('articles-list');
    expect(within(papers).getAllByRole('link').length).toBe(PAPERS.length);
    expect(within(articles).getAllByRole('link').length).toBe(RESEARCH_ARTICLES.length);
    expect(within(articles).getByText('A sample research write-up')).toBeInTheDocument();
  });
});
```

- [ ] **Step 6: Run it to confirm failure**

Run: `yarn test pages/Research.test.tsx`
Expected: FAIL — cannot resolve `./Research`.

- [ ] **Step 7: Implement `pages/Research.tsx`**

```tsx
import React from 'react';
import { PAPERS } from '../data/papers';
import { RESEARCH_ARTICLES } from '../data/researchArticles';
import { PaperCard } from '../components/research/PaperCard';
import { PostCard } from '../components/content/PostCard';
import { Seo } from '../components/Seo';
import { Reveal } from '../components/ui/Reveal';

const Research: React.FC = () => (
  <section className="pt-32 pb-24 bg-white min-h-screen">
    <Seo
      title="Research | Basic Tech"
      description="Papers and long-form research write-ups from Basic Tech."
      canonical="https://basictech.in/research"
      jsonLd={{ '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'Basic Tech Research', url: 'https://basictech.in/research' }}
    />
    <div className="container mx-auto px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10 2xl:px-12 max-w-4xl">
      <Reveal>
        <p className="text-xs sm:text-sm font-semibold tracking-widest text-slate-400 uppercase mb-4">Research</p>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-slate-900 tracking-tight mb-12">Papers & write-ups.</h1>
      </Reveal>

      <h2 className="text-xs font-semibold tracking-widest text-slate-400 uppercase mb-6">Papers</h2>
      <div data-testid="papers-list" className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-16">
        {PAPERS.map((p) => <PaperCard key={p.slug} paper={p} />)}
      </div>

      <h2 className="text-xs font-semibold tracking-widest text-slate-400 uppercase mb-2">Articles</h2>
      <div data-testid="articles-list">
        {RESEARCH_ARTICLES.map((e) => <PostCard key={e.slug} entry={e} basePath="/research" />)}
      </div>
    </div>
  </section>
);

export default Research;
```

- [ ] **Step 8: Run it to confirm pass**

Run: `yarn test pages/Research.test.tsx`
Expected: PASS.

- [ ] **Step 9: Write the failing test `pages/ResearchArticle.test.tsx`**

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ResearchArticle from './ResearchArticle';

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/research/:slug" element={<ResearchArticle />} />
        <Route path="/research" element={<div>research index</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('ResearchArticle', () => {
  it('renders the MDX body of a known article', () => {
    renderAt('/research/sample-writeup');
    expect(screen.getByRole('heading', { level: 1, name: 'A sample research write-up' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Method' })).toBeInTheDocument();
  });
  it('redirects an unknown slug to /research', () => {
    renderAt('/research/nope');
    expect(screen.getByText('research index')).toBeInTheDocument();
  });
});
```

- [ ] **Step 10: Run it to confirm failure**

Run: `yarn test pages/ResearchArticle.test.tsx`
Expected: FAIL — cannot resolve `./ResearchArticle`.

- [ ] **Step 11: Implement `pages/ResearchArticle.tsx`**

```tsx
import React from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { RESEARCH_ARTICLES } from '../data/researchArticles';
import { getEntry } from '../lib/content';
import { Prose } from '../components/content/Prose';
import { Seo } from '../components/Seo';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

const ResearchArticle: React.FC = () => {
  const { slug = '' } = useParams();
  const entry = getEntry(RESEARCH_ARTICLES, slug);
  if (!entry) return <Navigate to="/research" replace />;
  const { frontmatter } = entry;

  return (
    <article className="pt-32 pb-24 bg-white">
      <Seo
        title={`${frontmatter.title} | Basic Tech Research`}
        description={frontmatter.excerpt}
        canonical={`https://basictech.in/research/${slug}`}
        type="article"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: frontmatter.title,
          datePublished: frontmatter.date,
          author: { '@type': 'Organization', name: frontmatter.author || 'Basic Tech' },
          url: `https://basictech.in/research/${slug}`,
        }}
      />
      <div className="container mx-auto px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10 2xl:px-12 max-w-3xl">
        <Link to="/research" className="text-sm text-slate-500 hover:text-brand-blue transition-colors">← All research</Link>
        <header className="my-8">
          <time dateTime={frontmatter.date} className="text-sm text-slate-400">{formatDate(frontmatter.date)}</time>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-slate-900 tracking-tight leading-tight mt-2">{frontmatter.title}</h1>
          {frontmatter.author && <p className="text-slate-500 mt-3">By {frontmatter.author}</p>}
        </header>
        <Prose entry={entry} />
      </div>
    </article>
  );
};

export default ResearchArticle;
```

- [ ] **Step 12: Run it to confirm pass**

Run: `yarn test pages/ResearchArticle.test.tsx`
Expected: PASS — both tests pass.

- [ ] **Step 13: Register the research routes**

In `routes.tsx`, add imports and routes BEFORE `{ path: '*' }`:
```tsx
import Research from './pages/Research';
import ResearchArticle from './pages/ResearchArticle';
import { RESEARCH_ARTICLES } from './data/researchArticles';
```
```tsx
  { path: 'research', Component: Research },
  { path: 'research/:slug', Component: ResearchArticle, getStaticPaths: () => RESEARCH_ARTICLES.map((e) => `/research/${e.slug}`) },
```

- [ ] **Step 14: Build-verify**

Run: `yarn build`
Expected: `/research` + the article prerender with the MDX body:
```bash
test -e dist/research.html && echo "research ok"
ls dist/research        # expect sample-writeup.html
grep -q "Method" dist/research/sample-writeup.html && echo "research MDX body prerendered"
grep -o 'rel="canonical" href="[^"]*"' dist/research/sample-writeup.html   # self URL
```

- [ ] **Step 15: Full suite**

Run: `yarn test`
Expected: all green.

- [ ] **Step 16: Checkpoint (user commits)**

```bash
git add data/papers.ts data/researchArticles.ts content/research/sample-writeup.mdx components/research/PaperCard.tsx pages/Research.tsx pages/ResearchArticle.tsx pages/Research.test.tsx pages/ResearchArticle.test.tsx routes.tsx
git status
```

---

## Task 5: Nav links

**Files:**
- Modify: `components/layout/Layout.tsx`, `components/layout/Nav.test.tsx`

**Interfaces:**
- Consumes: the existing `NAV_LINKS` array + `Nav` component.

- [ ] **Step 1: Add the three links to `NAV_LINKS` in `components/layout/Layout.tsx`**

Extend the array (it currently has Work, Products, AI Infra):
```tsx
const NAV_LINKS = [
  { to: '/work', label: 'Work' },
  { to: '/products', label: 'Products' },
  { to: '/infra', label: 'AI Infra' },
  { to: '/team', label: 'Team' },
  { to: '/blog', label: 'Blog' },
  { to: '/research', label: 'Research' },
];
```

- [ ] **Step 2: Extend `components/layout/Nav.test.tsx` to assert the new links**

Add assertions in the existing "renders … links" test (keep the mobile-menu test as-is):
```tsx
    expect(screen.getAllByRole('link', { name: 'Team' }).length).toBeGreaterThan(0)
    expect(screen.getAllByRole('link', { name: 'Blog' }).length).toBeGreaterThan(0)
    expect(screen.getAllByRole('link', { name: 'Research' }).length).toBeGreaterThan(0)
```

- [ ] **Step 3: Run the nav test**

Run: `yarn test components/layout/Nav.test.tsx`
Expected: PASS.

- [ ] **Step 4: Full suite + build**

Run: `yarn test` then `yarn build`
Expected: full suite green; build prerenders ~18 pages (`/`, `/work`, 8 work slugs, `/products`, `/infra`, `/team`, `/blog`, `/blog/hello-world`, `/research`, `/research/sample-writeup`, `/404`). Nav shows all six links on desktop + the mobile menu lists them.

- [ ] **Step 5: Checkpoint (user commits)**

```bash
git add components/layout/Layout.tsx components/layout/Nav.test.tsx
git status
```

---

## Final Verification

- [ ] **Full build + test sweep**

Run: `yarn test && yarn build && yarn preview`
Expected:
- Full suite green, output pristine.
- `/team`, `/blog`, `/blog/hello-world`, `/research`, `/research/sample-writeup` all prerender; blog/research detail pages contain the rendered **MDX body text** (not an empty shell) and exactly one `<title>`/canonical each.
- Nav shows the six links (desktop) and the mobile menu lists them; existing pages unchanged.
- No duplicate/conflicting head tags; `index.html` untouched.

---

## Self-Review Notes (author)

- **Spec coverage:** MDX pipeline + loader → Task 1; `/blog` → Task 2 (also the prerender gate); `/team` → Task 3; `/research` (papers + articles + detail) → Task 4; nav → Task 5; SEO/prerender → build-verify steps. All spec §4 sections map to a task.
- **Risk gate honored:** Task 1 proves MDX compiles/loads (real-sample test); Task 2 Step 13 proves MDX prerenders (grep body text in dist) before Team/Research build on it.
- **No-commit:** every "Commit" reframed as "Checkpoint (user commits)".
- **Type/name consistency:** `Frontmatter`/`ContentEntry`/`loadCollection`/`getEntry` (Task 1) consumed identically by `data/blog.ts`, `data/researchArticles.ts`, `PostCard`, `Prose`, `BlogPost`, `ResearchArticle`; `PostCard`'s `{ entry, basePath }` shape is shared by blog (`/blog`) and research (`/research`); `getStaticPaths` mirrors the M1 `/work/:slug` form.
- **Placeholder discipline:** `TODO:` only inside data files (`team.ts`, `papers.ts`); the two MDX samples are intentionally real/demonstrable, not `TODO:`.
- **DRY:** blog and research articles share `lib/content.ts`, `PostCard`, and `Prose`; only the collection source and base path differ.
