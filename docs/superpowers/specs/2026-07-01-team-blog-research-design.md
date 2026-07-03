# Basic Tech — Phase 3: Team, Blog & Research Design

- **Date:** 2026-07-01
- **Status:** Approved (ready for planning)
- **Owner:** Pranav Pandey
- **Builds on:** [2026-06-30-projects-revamp-design.md](2026-06-30-projects-revamp-design.md) (M1 — routing/prerender/Seo) and [2026-07-01-products-infra-design.md](2026-07-01-products-infra-design.md) (M2 — data-driven pages, nav links + mobile menu)

## 1. Context

M1 made the site a multi-route, statically-prerendered app (react-router-dom +
vite-react-ssg, Tailwind via PostCSS, per-page `Seo`). M2 added data-driven
pages (`/products`, `/infra`), a lead-tagging `ContactContext`/`ContactModal`,
and a nav driven by a single `NAV_LINKS` array with a mobile menu. Phase 3 adds
**Team**, **Blog**, and **Research**, introducing the site's first **content
pipeline** (MDX) for long-form writing.

Reused foundation: `components/Seo.tsx`, `components/ui/Reveal.tsx`, brand tokens,
the `container mx-auto px-4 sm:px-5 …` width pattern, the vite-react-ssg static +
dynamic (`getStaticPaths`) prerender pattern, and `NAV_LINKS` in
`components/layout/Layout.tsx`.

## 2. Goals & Non-Goals

### Goals
- `/team` — a data-driven team page (member grid).
- A reusable **MDX content pipeline** (authoring in `.mdx` with frontmatter)
  shared by Blog and Research articles.
- `/blog` + `/blog/:slug` — blog index + prerendered MDX post pages.
- `/research` + `/research/:slug` — a research page with TWO sections (curated
  external **papers** + self-authored **articles**), and prerendered MDX article
  detail pages.
- Add Team/Blog/Research to the nav.
- Reuse the existing design system; every new route prerenders its own SEO.

### Non-Goals (this phase)
- No CMS, comments, search, pagination, or tag-filter pages (YAGNI; revisit when
  there's real content volume).
- No author accounts/auth.
- Content is **structure-first with placeholders** (`TODO:` markers) + exactly
  one sample blog post, one sample research article, and one sample paper so the
  pipeline is demonstrable end to end.
- No changes to Work/Products/Infra features.

## 3. Locked-in Decisions

1. **Blog pipeline = MDX** (`@mdx-js/rollup` + remark frontmatter plugins).
2. **Research = both** a curated linked-papers list (data-driven) AND
   self-authored MDX articles (reusing the blog pipeline).
3. **Shared loader:** one `lib/content.ts` (`loadCollection`/`getEntry`) consumes
   per-collection `import.meta.glob` results — DRY across blog + research
   articles.
4. **Markdown styling = `@tailwindcss/typography`** (`prose` classes).
5. **Content:** placeholders + one sample of each (post/article/paper).
6. **Nav:** add Team, Blog, Research as flat links (6 total). May be grouped into
   dropdowns later if crowded — out of scope now.
7. **Scope:** all three subsystems this milestone.

## 4. Detailed Design

### 4.1 MDX pipeline (foundation — highest integration risk)

- **Dependencies:** `@mdx-js/rollup`, `@mdx-js/react`, `remark-frontmatter`,
  `remark-mdx-frontmatter`, `@tailwindcss/typography`.
- **`vite.config.ts`:** add the MDX plugin as `{ enforce: 'pre', ...mdx({ remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter] }) }` placed BEFORE
  `@vitejs/plugin-react` in the `plugins` array (so each `.mdx` module exports a
  `frontmatter` object). The `enforce: 'pre'` MDX→JSX transform runs first and
  `@vitejs/plugin-react` then transforms the emitted JSX — the conventional
  working order; the gated pipeline task (Risks §7) confirms it for our versions.
- **`vitest.config.ts`:** add the SAME MDX plugin so tests can import `.mdx`.
- **`tailwind.config.js`:** add `@tailwindcss/typography` to `plugins`. Ensure
  `content` globs include `./content/**/*.mdx` so `prose` utility classes used in
  content aren't purged (the `prose` wrapper lives in page components, but include
  the path defensively).
- **Content dirs:** `content/blog/*.mdx`, `content/research/*.mdx`.
- **Frontmatter shape** (`lib/content.ts`):
  ```ts
  interface Frontmatter {
    title: string;
    date: string;        // ISO 'YYYY-MM-DD'
    excerpt: string;
    tags?: string[];
    author?: string;
    cover?: string;
  }
  ```
- **`lib/content.ts`:**
  ```ts
  interface ContentEntry {
    slug: string;
    frontmatter: Frontmatter;
    Component: React.ComponentType;
  }
  // modules = import.meta.glob('/content/<dir>/*.mdx', { eager: true })
  function loadCollection(modules: Record<string, any>): ContentEntry[]; // slug from filename, sorted by date desc
  function getEntry(entries: ContentEntry[], slug: string): ContentEntry | undefined;
  ```
  Each collection module does the glob with a LITERAL path (Vite requires literal
  glob paths) and calls `loadCollection`:
  ```ts
  // data/blog.ts
  export const BLOG = loadCollection(import.meta.glob('/content/blog/*.mdx', { eager: true }));
  // data/researchArticles.ts
  export const RESEARCH_ARTICLES = loadCollection(import.meta.glob('/content/research/*.mdx', { eager: true }));
  ```

### 4.2 `/team`

`data/team.ts` → `TeamMember[]` (`slug?`, `name`, `role`, `bio`, `photo?`,
`links?: { label, href }[]`). `pages/Team.tsx` renders a responsive grid of
member cards (`components/team/MemberCard.tsx`). Placeholders (3 members,
`TODO:`-marked). `CollectionPage` JSON-LD.

### 4.3 `/blog` + `/blog/:slug`

- `pages/BlogIndex.tsx` — cards from `BLOG` frontmatter (title, date, excerpt,
  tags), newest first. `CollectionPage` JSON-LD.
- `pages/BlogPost.tsx` — `useParams` slug → `getEntry(BLOG, slug)`; unknown slug
  → `<Navigate to="/blog" replace />`. Renders `<entry.Component />` inside a
  `prose prose-slate` container, with a header (title/date/author) and per-post
  `<Seo>` (`Article` JSON-LD from frontmatter; canonical
  `https://basictech.in/blog/<slug>`).
- Route `/blog/:slug` uses `getStaticPaths: () => BLOG.map(e => `/blog/${e.slug}`)`.
- Sample: `content/blog/hello-world.mdx` (real demonstrable post; clearly a
  starter, not `TODO:` junk — it documents the pipeline).

### 4.4 `/research` + `/research/:slug`

- `data/papers.ts` → `Paper[]` (`title`, `authors: string[]`, `venue?`, `date`,
  `abstract`, `url`, `tags?`). One sample paper (`TODO:`-marked fields where real
  data is unknown, but a working external `url`).
- `pages/Research.tsx` — two sections: **Papers** (cards from `PAPERS`, link out
  via `url`) and **Articles** (cards from `RESEARCH_ARTICLES` frontmatter → link
  to `/research/<slug>`). `CollectionPage` JSON-LD.
- `pages/ResearchArticle.tsx` — same shape as `BlogPost` but over
  `RESEARCH_ARTICLES`; unknown slug → `<Navigate to="/research" replace />`.
- Route `/research/:slug` uses
  `getStaticPaths: () => RESEARCH_ARTICLES.map(e => `/research/${e.slug}`)`.
- Sample: `content/research/sample-writeup.mdx`.

Shared presentational unit: a `components/content/PostCard.tsx` (used by blog
index and research articles list) and a `components/content/Prose.tsx` wrapper
(`prose` container + the MDX render), so blog and research detail pages stay DRY.

### 4.5 Nav

Extend `NAV_LINKS` in `components/layout/Layout.tsx` to:
`Work, Products, AI Infra, Team, Blog, Research` (6). Desktop renders all;
the existing mobile menu lists them vertically. No structural nav change.

### 4.6 SEO & prerender

5 new routes prerender: `/team`, `/blog`, `/blog/:slug` (per sample post),
`/research`, `/research/:slug` (per sample article). Each emits a single
`<title>`/description/canonical + JSON-LD (validated as in M1/M2 — no duplicate
head tags; `index.html` untouched). Total prerendered pages rises to ~18.

## 5. File / Structure Changes

**New:**
- `lib/content.ts` (+ `lib/content.test.ts`)
- `data/team.ts`, `data/blog.ts`, `data/papers.ts`, `data/researchArticles.ts`
- `content/blog/hello-world.mdx`, `content/research/sample-writeup.mdx`
- `components/team/MemberCard.tsx`, `components/content/PostCard.tsx`,
  `components/content/Prose.tsx`
- `pages/Team.tsx`, `pages/BlogIndex.tsx`, `pages/BlogPost.tsx`,
  `pages/Research.tsx`, `pages/ResearchArticle.tsx`
- Tests: `pages/Team.test.tsx`, `pages/BlogIndex.test.tsx`,
  `pages/BlogPost.test.tsx`, `pages/Research.test.tsx`,
  `pages/ResearchArticle.test.tsx`
- Possibly `types/mdx.d.ts` (module declaration for `*.mdx` imports/glob typing).

**Modified:**
- `vite.config.ts` (MDX plugin), `vitest.config.ts` (MDX plugin),
  `tailwind.config.js` (typography plugin + content glob), `package.json` (deps)
- `routes.tsx` (5 new routes)
- `components/layout/Layout.tsx` (`NAV_LINKS` += Team/Blog/Research)
- `components/layout/Nav.test.tsx` (assert the new links)

**Unchanged:** all existing pages/features, `Seo`, build/PostCSS base config
(beyond the typography plugin), `index.html`.

## 6. Testing & Verification

- `lib/content.test.ts`: `loadCollection` derives slugs from filenames, sorts by
  `date` desc, and `getEntry` finds/returns undefined correctly (use a small
  in-test module map; no real MDX needed for the sort/lookup logic).
- `pages/*` tests render within `MemoryRouter` (and `ContactProvider` where a CTA
  exists): Team renders a card per member; BlogIndex renders a card per post and
  links to `/blog/<slug>`; BlogPost renders the sample post's body + unknown slug
  redirects; Research renders both sections; ResearchArticle renders the sample +
  redirects on miss. (These import the real MDX via the glob — so `vitest.config`
  MUST have the MDX plugin.)
- `components/layout/Nav.test.tsx`: the three new links render.
- `yarn build`: all 5 routes prerender; `/blog/<sample>` and
  `/research/<sample>` contain the rendered MDX body text (not an empty shell)
  and exactly one `<title>`/canonical each; total ~18 pages. Existing pages
  unchanged.
- `yarn test`: full suite green, output pristine.

## 7. Risks

- **MDX × vite-react-ssg 0.8.9 × React 19 is the novel integration.** The plan
  MUST gate on it: the first task stands up the pipeline and proves the sample
  post both renders in a test AND prerenders to static HTML with its body text
  before any page work proceeds. If `@mdx-js/rollup` + the react plugin + SSG
  don't compose cleanly (e.g. JSX runtime, `frontmatter` export, or glob
  eager-load in SSG), resolve there — do not build pages on an unproven pipeline.
- **`@tailwindcss/typography` content purge:** ensure `prose` classes survive the
  Tailwind build (content globs include the page components using `prose`).

## 8. Content TODOs (owner to provide later)

- Real team members (names, roles, bios, photos, links).
- Real blog posts (replace the sample), real research articles, real papers
  (authors/venue/abstract/links).
- Provide `public/og-basic-tech.png` (outstanding from M1) — default OG image.

## 9. Future Phases (context only)

- **Phase 4:** trust layer — case-study metrics, `/engagement`, `/gdpr`,
  testimonials, Cal.com booking, legal pages, footer page-link row.
- Later: blog tag/filter pages, search, pagination, RSS once content volume
  justifies them; nav grouping/dropdowns if the flat nav gets crowded.
