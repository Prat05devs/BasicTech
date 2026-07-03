# Projects Revamp (Milestone 1) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the single-page Basic Tech site into a multi-route, prerendered app and ship a categorized, filterable projects portfolio with a dedicated detail page per project — with zero visual regression on the existing home page.

**Architecture:** Keep the Vite + React 19 app. Add `react-router-dom` for routing and `vite-react-ssg` to statically prerender every route to its own indexable HTML with per-page `<head>` tags. Migrate Tailwind from the CDN to a real PostCSS build and drop the `esm.sh` importmap so Vite bundles dependencies. A `Layout` holds the nav/footer and lifts the existing `ContactModal` into React context so any page can open it.

**Tech Stack:** React 19, TypeScript ~5.8, Vite 6, react-router-dom 6, vite-react-ssg, Tailwind CSS v3 (PostCSS), framer-motion, lenis, lucide-react. Tests: Vitest + React Testing Library + jsdom. Package manager: **yarn** (repo has `yarn.lock`).

## Global Constraints

- **Package manager is yarn.** Use `yarn add`, `yarn dev`, `yarn build`, `yarn test`. Never generate a `package-lock.json`.
- **DO NOT run `git commit`.** The user handles all commits. Every "Checkpoint" step means: stage the files, run the verification, then STOP and report the diff for the user to review/commit. Do not create commits.
- **Files live at the repo root**, not under `src/` (e.g. `App.tsx`, `index.tsx`, `constants.ts`, `components/`, `pages/`). Follow this; do not introduce a `src/` tree.
- **TypeScript config is fixed:** `jsx: react-jsx`, `moduleResolution: bundler`, `allowImportingTsExtensions: true`, path alias `@/* -> ./*`. Imports may omit extensions.
- **Brand tokens are exact and must not change:** `brand.blue = #2F80ED`, `brand.dark = #0f172a`, font `Inter`, plus the existing custom `screens`, `container`, `spacing`, and `backgroundImage` config. Port them verbatim.
- **No visual regression on the home page.** After every task, the home page must render pixel-identical to current production.
- **Shared primitives:** reuse `components/ui/Reveal.tsx` (`Reveal`, `LineDraw`) for animations and the `container mx-auto px-4 sm:px-5 ...` padding pattern for section width. Match the existing card aesthetic (grayscale→color on hover, `brand-blue` accents, tech pills).
- **Verification is build-based where unit tests don't fit.** "Prerendered" means the route's text content appears in the static HTML with JS disabled (verify via `view-source` / grep of `dist/`).

---

## File Structure

**New files**
- `tailwind.config.js` — Tailwind v3 config (ported from the inline `index.html` config).
- `postcss.config.js` — Tailwind + Autoprefixer.
- `vitest.config.ts` — test runner config (jsdom).
- `test/setup.ts` — Testing Library matchers.
- `lib/projects.ts` — pure helpers over the project list (`getProjectBySlug`, `getFeaturedProjects`, `filterProjects`, `getNextProject`, label maps).
- `lib/projects.test.ts` — unit tests for the helpers.
- `routes.tsx` — `vite-react-ssg` route table.
- `components/layout/Layout.tsx` — route shell: nav, `<Outlet/>`, footer, contact modal, lenis + scroll reset.
- `components/layout/ContactContext.tsx` — `ContactProvider` + `useContact()`.
- `components/layout/ContactContext.test.tsx` — context tests.
- `components/Seo.tsx` — per-page `<head>` wrapper around `vite-react-ssg`'s `Head`.
- `components/work/ProjectCard.tsx` — portfolio grid card.
- `components/work/FilterBar.tsx` — type/tag filter chips.
- `pages/Home.tsx` — the current section stack (moved out of `App.tsx`).
- `pages/WorkIndex.tsx` — `/work` filterable grid.
- `pages/WorkIndex.test.tsx` — filtering behavior test.
- `pages/WorkDetail.tsx` — `/work/:slug` detail page.
- `pages/WorkDetail.test.tsx` — render test.
- `pages/NotFound.tsx` — 404 page.

**Modified files**
- `package.json` — new deps + scripts.
- `index.html` — remove importmap, Tailwind CDN `<script>`, and inline `tailwind.config`; keep org JSON-LD, fonts, favicon, inline `<style>`.
- `index.css` — prepend `@tailwind` directives (keep all existing custom CSS).
- `index.tsx` — replace `ReactDOM.createRoot` mount with the `ViteReactSSG` entry.
- `types.ts` — replace `WorkItem` with `Project` + `ProjectType`/`ProjectTag`.
- `constants.ts` — migrate `SELECTED_WORK` → `PROJECTS` with the new shape + slugs.
- `components/Work.tsx` — Task 3: consume the new `Project` shape (keep full list). Task 9: convert to a featured teaser + "View all work" link.
- `App.tsx` — deleted in Task 6 (its nav + lenis move to `Layout`, its sections to `pages/Home.tsx`).

---

## Task 1: Build hardening — Tailwind via PostCSS + bundle dependencies

Remove the runtime CDN/importmap and switch to a real build. No routing yet; the app stays a single page and must look identical.

**Files:**
- Create: `tailwind.config.js`, `postcss.config.js`
- Modify: `package.json`, `index.html`, `index.css`

**Interfaces:**
- Produces: a working `yarn build` that bundles `react`, `react-dom`, `framer-motion`, `lenis`, `lucide-react` from `node_modules`, with Tailwind compiled at build time. No `cdn.tailwindcss.com`, no importmap.

- [ ] **Step 1: Add build dependencies**

```bash
yarn add -D tailwindcss@^3.4.0 postcss@^8.4.0 autoprefixer@^10.4.0
```

- [ ] **Step 2: Create `tailwind.config.js` (port the inline config verbatim)**

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './**/*.{ts,tsx}', '!./node_modules/**'],
  theme: {
    screens: {
      'xs': '375px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
      '3xl': '1920px',
      '4xl': '2560px',
      '5xl': '3840px',
    },
    extend: {
      fontFamily: { sans: ['Inter', 'sans-serif'] },
      colors: { brand: { blue: '#2F80ED', dark: '#0f172a' } },
      backgroundImage: {
        'grid-pattern':
          'linear-gradient(to right, #f1f5f9 1px, transparent 1px), linear-gradient(to bottom, #f1f5f9 1px, transparent 1px)',
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem', xs: '1rem', sm: '1.5rem', md: '2rem',
          lg: '2.5rem', xl: '3rem', '2xl': '4rem', '3xl': '5rem', '4xl': '6rem',
        },
        screens: {
          xs: '100%', sm: '640px', md: '768px', lg: '1024px',
          '2xl': '1400px', '3xl': '1600px', '4xl': '1800px',
        },
      },
      spacing: { '18': '4.5rem', '88': '22rem', '100': '25rem', '112': '28rem', '128': '32rem' },
    },
  },
  plugins: [],
}
```

- [ ] **Step 3: Create `postcss.config.js`**

```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

- [ ] **Step 4: Prepend Tailwind directives to `index.css`**

Add these three lines as the very first lines of `index.css` (keep ALL existing CSS below them unchanged):

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

- [ ] **Step 5: Clean `index.html`**

In `index.html`, DELETE these three blocks:
1. `<script src="https://cdn.tailwindcss.com"></script>`
2. The entire `<script>tailwind.config = { ... }</script>` block.
3. The entire `<script type="importmap"> ... </script>` block.

KEEP everything else: all meta tags, the Organization JSON-LD, the Google Fonts links, the favicon links, the inline `<style>` block (body/scrollbar/lenis styles), `<link rel="stylesheet" href="/index.css" />`, and `<script type="module" src="/index.tsx"></script>`.

- [ ] **Step 6: Verify the production build renders identically**

Run:
```bash
yarn build && yarn preview
```
Expected: build succeeds with no errors; open the preview URL — the home page is pixel-identical to current production; DevTools Network tab shows NO request to `cdn.tailwindcss.com` and NO `esm.sh` requests; Console has no errors.

- [ ] **Step 7: Verify dev server**

Run:
```bash
yarn dev
```
Expected: dev server starts on port 3000; home page renders identically; no console errors. Stop the server.

- [ ] **Step 8: Checkpoint (user commits)**

Stage and report; do not commit:
```bash
git add tailwind.config.js postcss.config.js index.css index.html package.json yarn.lock
git status
```
Report the diff summary to the user.

---

## Task 2: Test harness (Vitest + React Testing Library)

**Files:**
- Create: `vitest.config.ts`, `test/setup.ts`, `test/smoke.test.ts`
- Modify: `package.json`

**Interfaces:**
- Produces: `yarn test` runs Vitest once and exits; `yarn test:watch` watches. jsdom environment with `@testing-library/jest-dom` matchers globally available.

- [ ] **Step 1: Add test dependencies**

```bash
yarn add -D vitest@^2.1.0 jsdom@^25.0.0 @testing-library/react@^16.1.0 @testing-library/jest-dom@^6.6.0 @testing-library/user-event@^14.5.0
```

- [ ] **Step 2: Add test scripts to `package.json`**

Add to the `"scripts"` object:
```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 3: Create `vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './test/setup.ts',
  },
})
```

- [ ] **Step 4: Create `test/setup.ts`**

```ts
import '@testing-library/jest-dom'
```

- [ ] **Step 5: Write a smoke test that must pass**

Create `test/smoke.test.ts`:
```ts
import { describe, it, expect } from 'vitest'

describe('test harness', () => {
  it('runs', () => {
    expect(1 + 1).toBe(2)
  })
})
```

- [ ] **Step 6: Run the test**

Run: `yarn test`
Expected: PASS — 1 test passed.

- [ ] **Step 7: Checkpoint (user commits)**

```bash
git add vitest.config.ts test/setup.ts test/smoke.test.ts package.json yarn.lock
git status
```

---

## Task 3: Project data model + helpers (TDD)

Replace `WorkItem` with a richer `Project`, migrate the 8 projects, add tested helpers, and update `Work.tsx` to the new shape so the site keeps building.

**Files:**
- Modify: `types.ts`, `constants.ts`, `components/Work.tsx`
- Create: `lib/projects.ts`, `lib/projects.test.ts`

**Interfaces:**
- Produces:
  - `type ProjectType = 'web' | 'mobile' | 'ai' | 'web3' | 'ecommerce' | 'backend'`
  - `type ProjectTag = 'open-source' | 'client-work' | 'in-house' | 'featured'`
  - `interface Project { slug; name; client; vertical; type: ProjectType; tags: ProjectTag[]; year?; role?; summary; problem; approach; outcome; highlights?: string[]; tech: string[]; cover; gallery?: string[]; websiteUrl?; githubUrl?; status?: 'live' | 'archived' }`
  - `PROJECTS: Project[]` (in `constants.ts`)
  - `lib/projects.ts`: `getProjectBySlug(slug: string): Project | undefined`, `getFeaturedProjects(): Project[]`, `filterProjects(projects: Project[], type: ProjectType | 'all', tag: ProjectTag | 'all'): Project[]`, `getNextProject(slug: string): Project`, `TYPE_LABELS: Record<ProjectType, string>`, `TAG_LABELS: Record<ProjectTag, string>`, `ALL_TYPES: ProjectType[]`, `ALL_TAGS: ProjectTag[]`.

- [ ] **Step 1: Replace the `WorkItem` interface in `types.ts`**

Remove the `WorkItem` interface and add:
```ts
export type ProjectType = 'web' | 'mobile' | 'ai' | 'web3' | 'ecommerce' | 'backend';
export type ProjectTag = 'open-source' | 'client-work' | 'in-house' | 'featured';

export interface Project {
  slug: string;
  name: string;
  client: string;
  vertical: string;            // industry
  type: ProjectType;
  tags: ProjectTag[];
  year?: string;
  role?: string;
  summary: string;             // short one-liner (was `solution`)
  problem: string;
  approach: string;
  outcome: string;
  highlights?: string[];
  tech: string[];
  cover: string;               // hero/cover image (was `image`)
  gallery?: string[];
  websiteUrl?: string;
  githubUrl?: string;
  status?: 'live' | 'archived';
}
```
Keep `ServiceItem`, `PillarItem`, `ProcessStep`, and `SectionId` unchanged. Add `Work = 'work'` already exists in `SectionId`; leave it.

- [ ] **Step 2: Migrate `constants.ts` — rename `SELECTED_WORK` to `PROJECTS` with the new shape**

Change the import line at the top of `constants.ts` to include the new types:
```ts
import { ServiceItem, PillarItem, ProcessStep, Project } from './types';
```
Leave `SERVICES`, `PILLARS`, `PROCESS_STEPS` unchanged. Replace the entire `SELECTED_WORK` export with:
```ts
export const PROJECTS: Project[] = [
  {
    slug: 'inventory-management',
    name: 'Inventory Management',
    client: 'Enterprise Client',
    vertical: 'Enterprise Software',
    type: 'mobile',
    tags: ['client-work', 'open-source'],
    role: 'Full-stack mobile app & backend',
    summary: 'A production-ready, cross-platform inventory system with real-time stock, advanced crash prevention, and role-based access control.',
    problem: 'TODO: describe the client problem and the cost of the status quo (multi-location stock chaos, frequent crashes).',
    approach: 'Built a comprehensive inventory management system with multi-location support, real-time stock tracking, and hierarchical organization. Implemented advanced crash prevention with multi-layer error handling, automatic recovery, and 23+ error-scenario tests. Features: multi-variant products, barcode scanning, batch & expiry tracking, formula management, role-based access (Master/Employee/User), audit logging, and analytics dashboards. Security via JWT auth, AES-256 encryption, and session monitoring.',
    outcome: 'TODO: add measurable outcomes (crash rate, locations supported, time saved).',
    highlights: ['23+ error scenarios hardened', 'Role-based access control', 'AES-256 encryption + JWT'],
    tech: ['React Native', 'Expo', 'TypeScript', 'Redux Toolkit'],
    cover: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=800', // TODO: replace with real screenshot
    gallery: [], // TODO: add real screenshots
    websiteUrl: '',
    githubUrl: 'https://github.com/samarthsinh2660/inventory-management-system-frontend',
    status: 'live',
  },
  {
    slug: 'hillsquills',
    name: 'HillsQuills',
    client: 'HillsQuills Media',
    vertical: 'Media & Publishing',
    type: 'web',
    tags: ['client-work', 'featured'],
    role: 'Full-stack web platform',
    summary: "Uttarakhand's premier news source, bringing the latest stories from the hills.",
    problem: 'TODO: describe the publishing/distribution problem this solved.',
    approach: "Built a full editorial platform with a CMS-style admin, authenticated authoring (NextAuth), media handling via Cloudinary, and an SEO-first reader experience.",
    outcome: 'TODO: add traffic / readership metrics.',
    highlights: [],
    tech: ['Next.js', 'Tailwind CSS', 'Node.js', 'Express', 'MySQL', 'NextAuth', 'Cloudinary'],
    cover: '/hillsquills.png',
    gallery: [],
    websiteUrl: 'https://www.hillsquills.com/',
    githubUrl: 'https://github.com/pranavpandey1998official/hills-quills-backend',
    status: 'live',
  },
  {
    slug: 'dr-smit-bharat-solanki',
    name: 'Dr. Smit Bharat Solanki Website',
    client: 'Dr. Smit Bharat Solanki',
    vertical: 'Healthcare',
    type: 'web',
    tags: ['client-work', 'featured'],
    role: 'Full-stack web + SEO',
    summary: "A premium, SEO-optimized medical website delivering women's healthcare information with trust signals and a built-in support chatbot.",
    problem: 'TODO: describe the discovery/trust problem for a specialist practice.',
    approach: 'Built a production-grade medical site for a gynecologist and robotic surgeon: service pages, an interactive chatbot (Support Circle), research-publications showcase, multi-clinic location pages, WhatsApp appointment integration, FAQ modal, and a gallery. SEO-first architecture with per-page metadata, Open Graph, and sitemap generation; glassmorphism UI.',
    outcome: 'TODO: add ranking / appointment-conversion metrics.',
    highlights: ['SEO-first per-page metadata', 'WhatsApp appointment booking', 'In-page support chatbot'],
    tech: ['Next.js', 'Tailwind CSS', 'Framer Motion', 'TypeScript'],
    cover: '/drwebsite.png',
    gallery: [],
    websiteUrl: 'https://www.drsmitbharatsolanki.com/',
    githubUrl: 'https://github.com/Prat05devs/DrSolanki',
    status: 'live',
  },
  {
    slug: 'praeq',
    name: 'Praeq Talent Management',
    client: 'Praeq Talent Management',
    vertical: 'Talent Acquisition',
    type: 'web',
    tags: ['client-work', 'featured'],
    role: 'Design + full-stack web',
    summary: 'PRAEQ is a high-performance collective dedicated to transforming exceptional individuals into global icons.',
    problem: 'TODO: describe the brand/roster-presentation problem.',
    approach: 'Designed and developed a modern, responsive site showcasing the talent roster and services: dynamic multimedia profiles, an intuitive contact system, and SEO + performance optimizations aligned with a premium brand identity.',
    outcome: 'TODO: add engagement / inbound metrics.',
    highlights: [],
    tech: ['Next.js', 'Tailwind CSS', 'TypeScript'],
    cover: '/praeq.png',
    gallery: [],
    websiteUrl: 'https://www.praeq.in/',
    githubUrl: 'https://github.com/Prat05devs/PRAEQ',
    status: 'live',
  },
  {
    slug: 'dapper',
    name: 'Dapper',
    client: 'Sustainable Fashion Initiative',
    vertical: 'E-Commerce',
    type: 'ecommerce',
    tags: ['in-house', 'open-source', 'featured'],
    role: 'Product + full-stack build',
    summary: 'A next-generation sustainable fashion marketplace for buying, selling, and donating pre-owned clothing through a community-driven circular ecosystem.',
    problem: 'Thrift/second-hand commerce feels low-trust and low-quality; we set out to make conscious consumption feel premium and desirable.',
    approach: 'Built a purpose-driven marketplace with curated listings, seller verification, buy/sell/donate flows, city-based availability discovery, and community trust signals — wrapped in a minimal editorial aesthetic.',
    outcome: 'Placed 35th in the Asia-Pacific region and ranked in the top 300 websites globally at Lovable’s "No Code Competition" (6,500+ participants).',
    highlights: ['35th in Asia-Pacific', 'Top 300 globally', '6,500+ participants competition'],
    tech: ['Next.js', 'Tailwind CSS', 'Node.js', 'Express', 'MongoDB', 'NextAuth', 'Cloudinary'],
    cover: '/dapper.png',
    gallery: [],
    websiteUrl: 'https://dapper-city-threads.lovable.app/',
    githubUrl: 'https://github.com/Prat05devs/dapper-city-threads',
    status: 'live',
  },
  {
    slug: 'kumbh-milan',
    name: 'Kumbh Milan',
    client: 'UrbanMatch Inc.',
    vertical: 'Social Networking',
    type: 'mobile',
    tags: ['client-work', 'open-source'],
    role: 'Mobile app + realtime backend',
    summary: 'A hyper-local social discovery platform enabling millions of pilgrims to connect during the Kumbh Mela.',
    problem: 'Pilgrims at the world’s largest religious gathering had no reliable way to discover and reach people nearby under extreme network and load conditions.',
    approach: 'Built a scalable mobile app with real-time geolocation, chat, and community discovery, backed by infrastructure tuned for peak concurrent traffic across variable network conditions.',
    outcome: 'Handled millions of concurrent users during one of the world’s largest religious gatherings.',
    highlights: ['Millions of concurrent users', 'Real-time geolocation + chat'],
    tech: ['Flutter', 'Firebase', 'Real-Time Geolocation'],
    cover: 'https://images.unsplash.com/photo-1742316963876-51ddb4fa2fef?q=80&w=2496&auto=format&fit=crop',
    gallery: [],
    websiteUrl: '',
    githubUrl: 'https://github.com/basictech01/kumbh-milan',
    status: 'live',
  },
  {
    slug: 'doonplot',
    name: 'DoonPlot',
    client: 'Real Estate Agencies',
    vertical: 'PropTech',
    type: 'web',
    tags: ['client-work', 'open-source'],
    role: 'Geospatial web app',
    summary: 'Modernizing land sales by replacing static brochures with interactive, mobile-first geospatial experiences.',
    problem: 'Agents sold land with static brochures that failed to convey boundaries, location, and context, hurting engagement and conversion.',
    approach: 'Built a property mapping platform integrating Google Maps with custom GeoJSON for interactive visualization, boundary mapping, and location-based search — mobile-first so agents can present on-the-go.',
    outcome: 'TODO: add engagement / conversion metrics.',
    highlights: ['Interactive GeoJSON boundary mapping'],
    tech: ['React', 'Google Maps API', 'GeoJSON'],
    cover: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800',
    gallery: [],
    websiteUrl: 'https://doonplot.in',
    githubUrl: 'https://github.com/basictech01/LandMarketing',
    status: 'live',
  },
  {
    slug: 'cricketvotecrypto',
    name: 'CricketVoteCrypto',
    client: 'CricketVote',
    vertical: 'Web3 & Gaming',
    type: 'web3',
    tags: ['in-house', 'open-source'],
    role: 'Smart contracts + dApp frontend',
    summary: 'A decentralized IPL prediction platform using smart contracts and cryptographic verification for trustless rewards.',
    problem: 'Prediction games rely on a trusted operator to hold funds and settle outcomes — a single point of failure and mistrust.',
    approach: 'Built a blockchain prediction platform on Ethereum smart contracts: users predict, stake tokens, and receive automated rewards based on match outcomes, with cryptographic verification for trustless, transparent settlement. Web3.js for chain interactions; React frontend.',
    outcome: 'TODO: add usage metrics.',
    highlights: ['Trustless on-chain settlement'],
    tech: ['Solidity', 'Web3.js', 'React'],
    cover: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=800',
    gallery: [],
    websiteUrl: '',
    githubUrl: 'https://github.com/basictech01/cricketvoteblockchain',
    status: 'live',
  },
];
```

- [ ] **Step 3: Write the failing helper tests**

Create `lib/projects.test.ts`:
```ts
import { describe, it, expect } from 'vitest'
import { PROJECTS } from '../constants'
import {
  getProjectBySlug, getFeaturedProjects, filterProjects, getNextProject,
  TYPE_LABELS, TAG_LABELS,
} from './projects'

describe('project helpers', () => {
  it('finds a project by slug', () => {
    expect(getProjectBySlug('dapper')?.name).toBe('Dapper')
  })

  it('returns undefined for an unknown slug', () => {
    expect(getProjectBySlug('nope')).toBeUndefined()
  })

  it('returns only featured projects', () => {
    const featured = getFeaturedProjects()
    expect(featured.length).toBeGreaterThan(0)
    expect(featured.every(p => p.tags.includes('featured'))).toBe(true)
  })

  it('filters by type', () => {
    const mobile = filterProjects(PROJECTS, 'mobile', 'all')
    expect(mobile.every(p => p.type === 'mobile')).toBe(true)
    expect(mobile.length).toBe(2)
  })

  it('filters by tag', () => {
    const oss = filterProjects(PROJECTS, 'all', 'open-source')
    expect(oss.every(p => p.tags.includes('open-source'))).toBe(true)
  })

  it('returns everything when filters are "all"', () => {
    expect(filterProjects(PROJECTS, 'all', 'all').length).toBe(PROJECTS.length)
  })

  it('cycles to the next project and wraps around', () => {
    const last = PROJECTS[PROJECTS.length - 1]
    expect(getNextProject(last.slug).slug).toBe(PROJECTS[0].slug)
  })

  it('has a label for every type and tag', () => {
    expect(TYPE_LABELS.web3).toBe('Web3')
    expect(TAG_LABELS['open-source']).toBe('Open Source')
  })
})
```

- [ ] **Step 4: Run the tests to confirm they fail**

Run: `yarn test lib/projects.test.ts`
Expected: FAIL — cannot resolve `./projects` (module not created yet).

- [ ] **Step 5: Implement `lib/projects.ts`**

```ts
import { PROJECTS } from '../constants'
import { Project, ProjectType, ProjectTag } from '../types'

export const ALL_TYPES: ProjectType[] = ['web', 'mobile', 'ai', 'web3', 'ecommerce', 'backend']
export const ALL_TAGS: ProjectTag[] = ['open-source', 'client-work', 'in-house', 'featured']

export const TYPE_LABELS: Record<ProjectType, string> = {
  web: 'Web', mobile: 'Mobile', ai: 'AI / ML', web3: 'Web3', ecommerce: 'E-Commerce', backend: 'Backend',
}

export const TAG_LABELS: Record<ProjectTag, string> = {
  'open-source': 'Open Source', 'client-work': 'Client Work', 'in-house': 'In-House', featured: 'Featured',
}

export function getProjectBySlug(slug: string): Project | undefined {
  return PROJECTS.find(p => p.slug === slug)
}

export function getFeaturedProjects(): Project[] {
  return PROJECTS.filter(p => p.tags.includes('featured'))
}

export function filterProjects(
  projects: Project[],
  type: ProjectType | 'all',
  tag: ProjectTag | 'all',
): Project[] {
  return projects.filter(p =>
    (type === 'all' || p.type === type) &&
    (tag === 'all' || p.tags.includes(tag)),
  )
}

export function getNextProject(slug: string): Project {
  const i = PROJECTS.findIndex(p => p.slug === slug)
  return PROJECTS[(i + 1) % PROJECTS.length]
}
```

- [ ] **Step 6: Run the tests to confirm they pass**

Run: `yarn test lib/projects.test.ts`
Expected: PASS — all 8 tests pass.

- [ ] **Step 7: Update `components/Work.tsx` to the new `Project` shape (keep full list for now)**

The current `Work.tsx` imports `SELECTED_WORK` and `WorkItem` and reads `work.solution`, `work.description`, `work.image`, `work.tech.split(' · ')`. Update it minimally so the build stays green (Task 9 restructures it into a teaser later):

- Change the imports:
```ts
import { PROJECTS } from '../constants';
import { Project } from '../types';
```
- Change the list map to use `PROJECTS` and rename the card type to `Project`:
```ts
{PROJECTS.map((work, index) => (
  <WorkCard key={work.slug} work={work} index={index} />
))}
```
```ts
const WorkCard: React.FC<{ work: Project, index: number }> = ({ work, index }) => {
```
- Replace `work.solution` with `work.summary`.
- Remove the `work.description && (...)` paragraph block entirely (the new model has no `description`; the detail page covers that).
- Replace `work.image` with `work.cover`.
- Replace the tech rendering `work.tech.split(' · ').map(...)` with `work.tech.map(...)` (it's already an array):
```ts
{work.tech.map((t: string, i: number) => (
  <span key={i} className="text-[10px] xs:text-xs font-medium py-1 px-2 sm:px-3 bg-white border border-slate-200 rounded-full text-slate-600 shadow-sm">
    {t}
  </span>
))}
```
Leave all the framer-motion markup, layout, and link rendering (`websiteUrl`/`githubUrl`) unchanged.

- [ ] **Step 8: Verify the build still works and looks identical**

Run: `yarn build && yarn test`
Expected: build succeeds; all tests pass. Run `yarn preview` and confirm the Work section still lists all 8 projects and looks the same (minus the removed long description paragraph).

- [ ] **Step 9: Checkpoint (user commits)**

```bash
git add types.ts constants.ts lib/projects.ts lib/projects.test.ts components/Work.tsx
git status
```

---

## Task 4: ContactContext (TDD)

Lift the contact-modal open/close state into context so any page can trigger it.

**Files:**
- Create: `components/layout/ContactContext.tsx`, `components/layout/ContactContext.test.tsx`

**Interfaces:**
- Produces: `ContactProvider: React.FC<{ children; isOpen; onOpen; onClose }>` is NOT the shape — instead a self-contained provider that owns state:
  - `ContactProvider: React.FC<{ children: React.ReactNode }>` — owns `isOpen` state.
  - `useContact(): { isOpen: boolean; open: () => void; close: () => void }` — throws if used outside the provider.

- [ ] **Step 1: Write the failing test**

Create `components/layout/ContactContext.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ContactProvider, useContact } from './ContactContext'

function Probe() {
  const { isOpen, open, close } = useContact()
  return (
    <div>
      <span data-testid="state">{isOpen ? 'open' : 'closed'}</span>
      <button onClick={open}>open</button>
      <button onClick={close}>close</button>
    </div>
  )
}

describe('ContactContext', () => {
  it('starts closed and toggles open/close', () => {
    render(<ContactProvider><Probe /></ContactProvider>)
    expect(screen.getByTestId('state')).toHaveTextContent('closed')
    fireEvent.click(screen.getByText('open'))
    expect(screen.getByTestId('state')).toHaveTextContent('open')
    fireEvent.click(screen.getByText('close'))
    expect(screen.getByTestId('state')).toHaveTextContent('closed')
  })

  it('throws when used outside the provider', () => {
    expect(() => render(<Probe />)).toThrow(/useContact must be used within a ContactProvider/)
  })
})
```

- [ ] **Step 2: Run the test to confirm it fails**

Run: `yarn test components/layout/ContactContext.test.tsx`
Expected: FAIL — cannot resolve `./ContactContext`.

- [ ] **Step 3: Implement `components/layout/ContactContext.tsx`**

```tsx
import React, { createContext, useContext, useState, useCallback } from 'react';

interface ContactState {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

const ContactCtx = createContext<ContactState | null>(null);

export const ContactProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  return (
    <ContactCtx.Provider value={{ isOpen, open, close }}>
      {children}
    </ContactCtx.Provider>
  );
};

export function useContact(): ContactState {
  const ctx = useContext(ContactCtx);
  if (!ctx) throw new Error('useContact must be used within a ContactProvider');
  return ctx;
}
```

- [ ] **Step 4: Run the test to confirm it passes**

Run: `yarn test components/layout/ContactContext.test.tsx`
Expected: PASS — both tests pass.

- [ ] **Step 5: Checkpoint (user commits)**

```bash
git add components/layout/ContactContext.tsx components/layout/ContactContext.test.tsx
git status
```

---

## Task 5: Seo component

A reusable per-page `<head>` wrapper around `vite-react-ssg`'s `Head` (which manages document head during prerender + hydration).

**Files:**
- Create: `components/Seo.tsx`
- (Adds the runtime deps used by later tasks.)

**Interfaces:**
- Consumes: `Head` from `vite-react-ssg`.
- Produces: `Seo: React.FC<{ title; description; canonical?; image?; type?; jsonLd?: object }>` rendering the head tags. Default `image = 'https://basictech.in/og-basic-tech.png'`, default `type = 'website'`.

- [ ] **Step 1: Add routing + SSG dependencies**

```bash
yarn add react-router-dom@^6.28.0 vite-react-ssg@^0.8.0
```

- [ ] **Step 2: Implement `components/Seo.tsx`**

```tsx
import React from 'react';
import { Head } from 'vite-react-ssg';

interface SeoProps {
  title: string;
  description: string;
  canonical?: string;
  image?: string;
  type?: string;
  jsonLd?: object;
}

const DEFAULT_IMAGE = 'https://basictech.in/og-basic-tech.png';

export const Seo: React.FC<SeoProps> = ({
  title,
  description,
  canonical,
  image = DEFAULT_IMAGE,
  type = 'website',
  jsonLd,
}) => (
  <Head>
    <title>{title}</title>
    <meta name="description" content={description} />
    {canonical && <link rel="canonical" href={canonical} />}
    <meta property="og:type" content={type} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content={image} />
    {canonical && <meta property="og:url" content={canonical} />}
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    <meta name="twitter:image" content={image} />
    {jsonLd && (
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
    )}
  </Head>
);
```

- [ ] **Step 3: Smoke test the import compiles**

Run: `yarn build` is premature (no routes yet). Instead typecheck by importing in a temp test. Create `components/Seo.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest'
import { Seo } from './Seo'

describe('Seo', () => {
  it('is a component', () => {
    expect(typeof Seo).toBe('function')
  })
})
```
Run: `yarn test components/Seo.test.tsx`
Expected: PASS.

- [ ] **Step 4: Checkpoint (user commits)**

```bash
git add components/Seo.tsx components/Seo.test.tsx package.json yarn.lock
git status
```

---

## Task 6: Routing shell — Layout, Home page, routes, SSG entry

Introduce routing and prerendering. Move the nav + lenis into `Layout`, the section stack into `pages/Home.tsx`, wire the contact modal through context, and switch the entry to `ViteReactSSG`. Home must stay pixel-identical.

**Files:**
- Create: `pages/Home.tsx`, `pages/NotFound.tsx`, `components/layout/Layout.tsx`, `routes.tsx`
- Modify: `index.tsx`, `index.html`, `package.json`
- Delete: `App.tsx`

**Interfaces:**
- Consumes: `ContactProvider`/`useContact` (Task 4), `Seo` (Task 5), existing section components, `ContactModal`, `Footer`, `Hero`.
- Produces: `routes` (default export of `routes.tsx`) as a `vite-react-ssg` `RouteRecord[]`; `Layout`; `Home`; `NotFound`.

- [ ] **Step 1: Create `pages/Home.tsx` (move the section stack out of `App.tsx`)**

```tsx
import React from 'react';
import { Hero } from '../components/Hero';
import { Philosophy } from '../components/Philosophy';
import { Services } from '../components/Services';
import { Differentiation } from '../components/Differentiation';
import { Process } from '../components/Process';
import { Work } from '../components/Work';
import { AISection } from '../components/AISection';
import { TechStack } from '../components/TechStack';
import { Seo } from '../components/Seo';
import { useContact } from '../components/layout/ContactContext';

const Home: React.FC = () => {
  const { open } = useContact();
  return (
    <>
      <Seo
        title="Basic Tech | AI-Powered Software Development for Startups & Businesses"
        description="Basic Tech builds web apps, mobile apps, backend systems, and AI-powered products for startups and growing businesses. Elite engineers, AI-driven workflows."
        canonical="https://basictech.in/"
      />
      <Hero onStartProject={open} />
      <Philosophy />
      <Services />
      <Differentiation />
      <Process />
      <Work />
      <AISection />
      <TechStack />
    </>
  );
};

export default Home;
```

- [ ] **Step 2: Create `pages/NotFound.tsx`**

```tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Seo } from '../components/Seo';

const NotFound: React.FC = () => (
  <section className="min-h-[70vh] flex items-center justify-center bg-white">
    <Seo title="Page Not Found | Basic Tech" description="The page you were looking for doesn’t exist." />
    <div className="text-center px-6">
      <p className="text-brand-blue font-mono text-sm tracking-widest uppercase mb-3">404</p>
      <h1 className="text-3xl sm:text-4xl font-semibold text-slate-900 tracking-tight mb-4">Page not found</h1>
      <p className="text-slate-600 mb-8">The page you were looking for doesn’t exist or has moved.</p>
      <Link to="/" className="inline-block bg-slate-900 text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-slate-800 transition-colors">
        Back to home
      </Link>
    </div>
  </section>
);

export default NotFound;
```

- [ ] **Step 3: Create `components/layout/Layout.tsx` (nav + lenis + scroll reset + contact modal)**

Move the sticky nav and lenis init from `App.tsx` here. The nav "Basic Tech." logo links home; add a "Work" link; the Contact button calls `open()` from context.

```tsx
import React, { useEffect, useRef } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import { Footer } from '../Footer';
import { ContactModal } from '../ContactModal';
import { ContactProvider, useContact } from './ContactContext';

const Nav: React.FC = () => {
  const { open } = useContact();
  return (
    <nav className="fixed top-0 left-0 w-full z-50 transition-all duration-300 pointer-events-none">
      <div className="absolute inset-0 bg-white/70 backdrop-blur-md border-b border-white/20" />
      <div className="container mx-auto px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10 2xl:px-12 py-4 flex justify-between items-center relative z-10">
        <Link to="/" className="flex items-center gap-3 pointer-events-auto cursor-pointer">
          <div className="w-10 h-10 bg-brand-blue rounded-full flex items-center justify-center shadow-md shadow-blue-500/20">
            <span className="text-white font-bold text-lg tracking-tight">BT</span>
          </div>
          <span className="font-semibold tracking-tight text-xl text-slate-900 hidden sm:block">Basic Tech.</span>
        </Link>

        <div className="flex items-center gap-6 pointer-events-auto">
          <Link to="/work" className="text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors hidden sm:block">
            Work
          </Link>
          <button
            onClick={open}
            className="bg-slate-900 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-slate-800 transition-colors hidden sm:block shadow-lg hover:shadow-xl hover:-translate-y-0.5 transform duration-300"
          >
            Contact
          </button>
        </div>
      </div>
    </nav>
  );
};

const Shell: React.FC = () => {
  const { isOpen, open, close } = useContact();
  const location = useLocation();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
    });
    lenisRef.current = lenis;
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    return () => { lenis.destroy(); lenisRef.current = null; };
  }, []);

  // Reset scroll to top on route change.
  useEffect(() => {
    lenisRef.current?.scrollTo(0, { immediate: true });
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="w-full bg-white min-h-screen">
      <Nav />
      <main>
        <Outlet />
      </main>
      <Footer onStartConversation={open} />
      <ContactModal isOpen={isOpen} onClose={close} />
    </div>
  );
};

export const Layout: React.FC = () => (
  <ContactProvider>
    <Shell />
  </ContactProvider>
);

export default Layout;
```

Note: `Footer` keeps its existing `onStartConversation` prop; `Hero` keeps its `onStartProject` prop (passed from `Home` via `useContact`). Both wrap the `<Outlet/>` so the modal and footer appear on every route.

- [ ] **Step 4: Create `routes.tsx`**

```tsx
import type { RouteRecord } from 'vite-react-ssg';
import { Layout } from './components/layout/Layout';
import Home from './pages/Home';
import NotFound from './pages/NotFound';

export const routes: RouteRecord[] = [
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, Component: Home },
      { path: '*', Component: NotFound },
    ],
  },
];

export default routes;
```

- [ ] **Step 5: Replace `index.tsx` with the `ViteReactSSG` entry**

```tsx
import { ViteReactSSG } from 'vite-react-ssg';
import { routes } from './routes';
import './index.css';

export const createRoot = ViteReactSSG({ routes });
```
(Importing `./index.css` here ensures the stylesheet is part of the build graph. Keep the `<link rel="stylesheet" href="/index.css" />` in `index.html` too — harmless and helps dev.)

- [ ] **Step 6: Update `package.json` scripts to use the SSG CLI**

Replace the `dev`/`build` scripts:
```json
"dev": "vite-react-ssg dev --port 3000",
"build": "vite-react-ssg build",
"preview": "vite preview"
```
Keep `test`/`test:watch` from Task 2.

- [ ] **Step 7: Delete `App.tsx`**

```bash
git rm App.tsx
```
(Its responsibilities now live in `Layout` + `pages/Home.tsx`.)

- [ ] **Step 8: Build and verify prerendering + parity**

Run: `yarn build`
Expected: build completes; `dist/index.html` exists and contains the Hero copy as real text (not just an empty `<div id="root">`). Verify:
```bash
grep -c "Basic Tech" dist/index.html        # expect >= 1
test -f dist/404.html && echo "404 ok"        # vite-react-ssg emits 404 for the '*' route
```

- [ ] **Step 9: Visual + interaction check**

Run: `yarn preview`
Expected: home page is pixel-identical to current production; the nav now shows a **Work** link; clicking **Contact** (nav) opens the modal; clicking **Start a project** in the Hero opens the modal; the Footer CTA opens the modal. No console errors.

- [ ] **Step 10: Run the full test suite**

Run: `yarn test`
Expected: all prior tests still pass.

- [ ] **Step 11: Checkpoint (user commits)**

```bash
git add pages/Home.tsx pages/NotFound.tsx components/layout/Layout.tsx routes.tsx index.tsx index.html package.json yarn.lock
git rm App.tsx
git status
```

---

## Task 7: `/work` index page — filterable portfolio grid

**Files:**
- Create: `components/work/ProjectCard.tsx`, `components/work/FilterBar.tsx`, `pages/WorkIndex.tsx`, `pages/WorkIndex.test.tsx`
- Modify: `routes.tsx`

**Interfaces:**
- Consumes: `PROJECTS`, `filterProjects`, `getFeaturedProjects` not needed here; `TYPE_LABELS`, `TAG_LABELS`, `ALL_TYPES`, `ALL_TAGS` (Task 3); `Seo` (Task 5); `Project`, `ProjectType`, `ProjectTag` types.
- Produces: `ProjectCard: React.FC<{ project: Project }>`; `FilterBar: React.FC<{ type; tag; onType; onTag }>`; `WorkIndex` (default export of `pages/WorkIndex.tsx`).

- [ ] **Step 1: Implement `components/work/ProjectCard.tsx`**

```tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Project } from '../../types';
import { TYPE_LABELS } from '../../lib/projects';

export const ProjectCard: React.FC<{ project: Project }> = ({ project }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.6 }}
    className="group"
  >
    <Link to={`/work/${project.slug}`} className="block">
      <div className="relative overflow-hidden aspect-[3/2] bg-slate-200 rounded-sm shadow-sm mb-4">
        <img
          src={project.cover}
          alt={project.name}
          className="w-full h-full object-cover object-top grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
        />
        <span className="absolute top-3 left-3 text-[10px] font-mono tracking-wider uppercase bg-white/90 text-brand-blue px-2 py-1 rounded-sm">
          {TYPE_LABELS[project.type]}
        </span>
      </div>
      <span className="text-brand-blue font-mono text-[10px] xs:text-xs tracking-wider uppercase">
        {project.vertical}
      </span>
      <h3 className="text-lg sm:text-xl font-semibold text-slate-900 tracking-tight leading-tight mt-1 mb-2 group-hover:text-brand-blue transition-colors">
        {project.name}
      </h3>
      <p className="text-sm text-slate-600 font-light leading-relaxed line-clamp-2">{project.summary}</p>
    </Link>
  </motion.div>
);
```

- [ ] **Step 2: Implement `components/work/FilterBar.tsx`**

```tsx
import React from 'react';
import { ProjectType, ProjectTag } from '../../types';
import { ALL_TYPES, ALL_TAGS, TYPE_LABELS, TAG_LABELS } from '../../lib/projects';

interface FilterBarProps {
  type: ProjectType | 'all';
  tag: ProjectTag | 'all';
  onType: (t: ProjectType | 'all') => void;
  onTag: (t: ProjectTag | 'all') => void;
}

const chip = (active: boolean) =>
  `text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
    active
      ? 'bg-slate-900 text-white border-slate-900'
      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
  }`;

export const FilterBar: React.FC<FilterBarProps> = ({ type, tag, onType, onTag }) => (
  <div className="space-y-4 mb-12">
    <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by type">
      <button className={chip(type === 'all')} onClick={() => onType('all')}>All Types</button>
      {ALL_TYPES.map(t => (
        <button key={t} className={chip(type === t)} onClick={() => onType(t)}>{TYPE_LABELS[t]}</button>
      ))}
    </div>
    <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by tag">
      <button className={chip(tag === 'all')} onClick={() => onTag('all')}>All</button>
      {ALL_TAGS.map(t => (
        <button key={t} className={chip(tag === t)} onClick={() => onTag(t)}>{TAG_LABELS[t]}</button>
      ))}
    </div>
  </div>
);
```

- [ ] **Step 3: Write the failing test for `WorkIndex`**

Create `pages/WorkIndex.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import WorkIndex from './WorkIndex'
import { PROJECTS } from '../constants'

const renderPage = () =>
  render(<MemoryRouter><WorkIndex /></MemoryRouter>)

describe('WorkIndex', () => {
  it('renders every project by default', () => {
    renderPage()
    const grid = screen.getByTestId('project-grid')
    expect(within(grid).getAllByRole('heading', { level: 3 }).length).toBe(PROJECTS.length)
  })

  it('filters to mobile projects only', () => {
    renderPage()
    fireEvent.click(screen.getByRole('button', { name: 'Mobile' }))
    const grid = screen.getByTestId('project-grid')
    const headings = within(grid).getAllByRole('heading', { level: 3 }).map(h => h.textContent)
    expect(headings).toContain('Kumbh Milan')
    expect(headings).not.toContain('Dapper')
  })
})
```

- [ ] **Step 4: Run the test to confirm it fails**

Run: `yarn test pages/WorkIndex.test.tsx`
Expected: FAIL — cannot resolve `./WorkIndex`.

- [ ] **Step 5: Implement `pages/WorkIndex.tsx`**

```tsx
import React, { useMemo, useState } from 'react';
import { PROJECTS, } from '../constants';
import { filterProjects } from '../lib/projects';
import { ProjectType, ProjectTag } from '../types';
import { ProjectCard } from '../components/work/ProjectCard';
import { FilterBar } from '../components/work/FilterBar';
import { Seo } from '../components/Seo';
import { Reveal } from '../components/ui/Reveal';

const WorkIndex: React.FC = () => {
  const [type, setType] = useState<ProjectType | 'all'>('all');
  const [tag, setTag] = useState<ProjectTag | 'all'>('all');
  const visible = useMemo(() => filterProjects(PROJECTS, type, tag), [type, tag]);

  return (
    <section className="pt-32 pb-24 bg-white min-h-screen">
      <Seo
        title="Our Work | Basic Tech"
        description="Selected projects by Basic Tech — web apps, mobile apps, AI, Web3, and e-commerce built for startups and businesses."
        canonical="https://basictech.in/work"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Basic Tech — Selected Work',
          url: 'https://basictech.in/work',
        }}
      />
      <div className="container mx-auto px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10 2xl:px-12">
        <Reveal>
          <p className="text-xs sm:text-sm font-semibold tracking-widest text-slate-400 uppercase mb-4">Our Work</p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-slate-900 tracking-tight mb-10 max-w-2xl">
            Products and platforms we’ve shipped.
          </h1>
        </Reveal>

        <FilterBar type={type} tag={tag} onType={setType} onTag={setTag} />

        {visible.length === 0 ? (
          <p className="text-slate-500">No projects match these filters.</p>
        ) : (
          <div data-testid="project-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
            {visible.map(p => (
              <ProjectCard key={p.slug} project={p} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default WorkIndex;
```

- [ ] **Step 6: Run the test to confirm it passes**

Run: `yarn test pages/WorkIndex.test.tsx`
Expected: PASS — both tests pass.

- [ ] **Step 7: Register the `/work` route**

In `routes.tsx`, import and add the route as a child of `/` BEFORE the `*` catch-all:
```tsx
import WorkIndex from './pages/WorkIndex';
```
```tsx
children: [
  { index: true, Component: Home },
  { path: 'work', Component: WorkIndex },
  { path: '*', Component: NotFound },
],
```

- [ ] **Step 8: Build and verify the route prerenders**

Run: `yarn build`
Expected: build succeeds; `dist/work/index.html` (or `dist/work.html`) exists.
```bash
test -e dist/work/index.html -o -e dist/work.html && echo "work route ok"
grep -rl "Products and platforms we" dist/work* | head   # text present in static HTML
```

- [ ] **Step 9: Manual check**

Run `yarn preview`, navigate to `/work`: the grid shows all projects; clicking a type/tag chip filters live; clicking a card navigates to `/work/<slug>` (will 404 until Task 8 — acceptable here).

- [ ] **Step 10: Checkpoint (user commits)**

```bash
git add components/work/ProjectCard.tsx components/work/FilterBar.tsx pages/WorkIndex.tsx pages/WorkIndex.test.tsx routes.tsx
git status
```

---

## Task 8: `/work/:slug` detail page

**Files:**
- Create: `pages/WorkDetail.tsx`, `pages/WorkDetail.test.tsx`
- Modify: `routes.tsx`

**Interfaces:**
- Consumes: `getProjectBySlug`, `getNextProject`, `TYPE_LABELS`, `TAG_LABELS` (Task 3); `useContact` (Task 4); `Seo` (Task 5); `useParams`, `Link`, `Navigate` from react-router-dom; `PROJECTS` for `getStaticPaths`.
- Produces: `WorkDetail` (default export). Route uses `getStaticPaths` returning `/work/<slug>` for every project so each prerenders.

- [ ] **Step 1: Write the failing test**

Create `pages/WorkDetail.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { ContactProvider } from '../components/layout/ContactContext'
import WorkDetail from './WorkDetail'

function renderAt(path: string) {
  return render(
    <ContactProvider>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path="/work/:slug" element={<WorkDetail />} />
          <Route path="/" element={<div>home</div>} />
        </Routes>
      </MemoryRouter>
    </ContactProvider>,
  )
}

describe('WorkDetail', () => {
  it('renders the project name and outcome for a known slug', () => {
    renderAt('/work/dapper')
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Dapper')
    expect(screen.getByText(/Asia-Pacific/i)).toBeInTheDocument()
  })

  it('redirects an unknown slug home', () => {
    renderAt('/work/does-not-exist')
    expect(screen.getByText('home')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run the test to confirm it fails**

Run: `yarn test pages/WorkDetail.test.tsx`
Expected: FAIL — cannot resolve `./WorkDetail`.

- [ ] **Step 3: Implement `pages/WorkDetail.tsx`**

```tsx
import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { getProjectBySlug, getNextProject, TYPE_LABELS, TAG_LABELS } from '../lib/projects';
import { useContact } from '../components/layout/ContactContext';
import { Seo } from '../components/Seo';
import { Reveal } from '../components/ui/Reveal';

const WorkDetail: React.FC = () => {
  const { slug = '' } = useParams();
  const project = getProjectBySlug(slug);
  const { open } = useContact();

  if (!project) return <Navigate to="/" replace />;

  const next = getNextProject(project.slug);

  return (
    <article className="pt-32 pb-24 bg-white">
      <Seo
        title={`${project.name} — ${project.vertical} | Basic Tech`}
        description={project.summary}
        canonical={`https://basictech.in/work/${project.slug}`}
        image={project.cover.startsWith('http') ? project.cover : undefined}
        type="article"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'CreativeWork',
          name: project.name,
          about: project.vertical,
          url: `https://basictech.in/work/${project.slug}`,
          keywords: project.tech.join(', '),
        }}
      />
      <div className="container mx-auto px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10 2xl:px-12 max-w-4xl">
        <Link to="/work" className="text-sm text-slate-500 hover:text-brand-blue transition-colors">← All work</Link>

        {/* Hero */}
        <Reveal className="mt-6">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="text-[10px] font-mono tracking-wider uppercase bg-blue-50 text-brand-blue px-2 py-1 rounded-sm">
              {TYPE_LABELS[project.type]}
            </span>
            {project.tags.map(t => (
              <span key={t} className="text-[10px] font-medium uppercase tracking-wide text-slate-500 border border-slate-200 px-2 py-1 rounded-sm">
                {TAG_LABELS[t]}
              </span>
            ))}
            {project.year && <span className="text-xs text-slate-400">{project.year}</span>}
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-slate-900 tracking-tight leading-tight mb-3">
            {project.name}
          </h1>
          <p className="text-base sm:text-lg text-slate-600 font-light mb-2">{project.client} · {project.vertical}</p>
          <p className="text-lg text-slate-700 font-light leading-relaxed max-w-2xl">{project.summary}</p>

          <div className="flex flex-wrap gap-3 mt-6">
            {project.websiteUrl && (
              <a href={project.websiteUrl} target="_blank" rel="noopener noreferrer"
                 className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-blue hover:text-blue-700 px-4 py-2 border border-brand-blue/30 hover:border-brand-blue rounded-sm bg-white hover:bg-blue-50 transition-colors">
                Visit Website
              </a>
            )}
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
                 className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-700 hover:text-slate-900 px-4 py-2 border border-slate-300 hover:border-slate-400 rounded-sm bg-white hover:bg-slate-50 transition-colors">
                View Code
              </a>
            )}
          </div>
        </Reveal>

        {/* Cover */}
        <div className="relative overflow-hidden aspect-[16/9] bg-slate-200 rounded-sm shadow-sm my-12">
          <img src={project.cover} alt={project.name} className="w-full h-full object-cover object-top" />
        </div>

        {/* Narrative */}
        <div className="grid grid-cols-1 gap-10">
          <Section title="The Problem" body={project.problem} />
          <Section title="Our Approach" body={project.approach} />
          <Section title="Outcome" body={project.outcome} />
        </div>

        {/* Highlights */}
        {project.highlights && project.highlights.length > 0 && (
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
            {project.highlights.map((h, i) => (
              <div key={i} className="border-l-2 border-brand-blue pl-4">
                <p className="text-sm font-medium text-slate-800 leading-snug">{h}</p>
              </div>
            ))}
          </div>
        )}

        {/* Tech */}
        <div className="mt-12">
          <h2 className="text-xs font-semibold tracking-widest text-slate-400 uppercase mb-4">Tech Stack</h2>
          <div className="flex flex-wrap gap-2">
            {project.tech.map((t, i) => (
              <span key={i} className="text-xs font-medium py-1 px-3 bg-white border border-slate-200 rounded-full text-slate-600 shadow-sm">{t}</span>
            ))}
          </div>
        </div>

        {/* Gallery */}
        {project.gallery && project.gallery.length > 0 && (
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {project.gallery.map((src, i) => (
              <img key={i} src={src} alt={`${project.name} screenshot ${i + 1}`} className="w-full rounded-sm shadow-sm" />
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mt-20 text-center bg-slate-50 rounded-lg py-12 px-6">
          <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight mb-4">Want to build something like this?</h2>
          <button onClick={open} className="bg-slate-900 text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-slate-800 transition-colors shadow-lg">
            Start a project
          </button>
        </div>

        {/* Next */}
        <div className="mt-16 border-t border-slate-200 pt-8 flex justify-between items-center">
          <span className="text-sm text-slate-400">Next project</span>
          <Link to={`/work/${next.slug}`} className="text-lg font-semibold text-slate-900 hover:text-brand-blue transition-colors">
            {next.name} →
          </Link>
        </div>
      </div>
    </article>
  );
};

const Section: React.FC<{ title: string; body: string }> = ({ title, body }) => (
  <div>
    <h2 className="text-xs font-semibold tracking-widest text-slate-400 uppercase mb-3">{title}</h2>
    <p className="text-base text-slate-700 font-light leading-relaxed">{body}</p>
  </div>
);

export default WorkDetail;
```

- [ ] **Step 4: Run the test to confirm it passes**

Run: `yarn test pages/WorkDetail.test.tsx`
Expected: PASS — both tests pass.

- [ ] **Step 5: Register the dynamic route with `getStaticPaths`**

In `routes.tsx`, import `WorkDetail` and `PROJECTS`, and add the route (after `work`, before `*`):
```tsx
import WorkDetail from './pages/WorkDetail';
import { PROJECTS } from './constants';
```
```tsx
{
  path: 'work/:slug',
  Component: WorkDetail,
  getStaticPaths: () => PROJECTS.map(p => `/work/${p.slug}`),
},
```

- [ ] **Step 6: Build and verify every slug prerenders**

Run: `yarn build`
Expected: build succeeds; one static HTML file per project slug.
```bash
ls dist/work        # expect a directory/file per slug (dapper, kumbh-milan, ...)
grep -rl "Asia-Pacific" dist/work/dapper* | head   # outcome text present in static HTML
```

- [ ] **Step 7: Manual check**

`yarn preview`, navigate `/work` → click any card → detail page renders with all sections, working Visit/Code links, "Start a project" opens the modal, and "Next project" cycles. Unknown slug (e.g. `/work/zzz`) redirects home.

- [ ] **Step 8: Checkpoint (user commits)**

```bash
git add pages/WorkDetail.tsx pages/WorkDetail.test.tsx routes.tsx
git status
```

---

## Task 9: Home Work section → featured teaser + "View all work"

Convert the full-list `Work` section on the home page into a teaser of featured projects with a link to `/work`.

**Files:**
- Modify: `components/Work.tsx`

**Interfaces:**
- Consumes: `getFeaturedProjects` (Task 3), `Link` from react-router-dom, existing `Reveal`.
- Produces: the same `Work` component (still imported by `pages/Home.tsx`), now rendering only featured projects + a "View all work →" link.

- [ ] **Step 1: Update `components/Work.tsx` to render featured projects + a link**

Change the data source and add the link. Replace the import and the list source:
```ts
import { Link } from 'react-router-dom';
import { getFeaturedProjects } from '../lib/projects';
import { Project } from '../types';
```
In the `Work` component body, replace `PROJECTS.map(...)` with the featured subset, and add a "View all work" link below the grid:
```tsx
export const Work: React.FC = () => {
  const featured = getFeaturedProjects();
  return (
    <section className="py-16 sm:py-20 md:py-24 bg-slate-50">
      <div className="container mx-auto px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10 2xl:px-12">
        <Reveal>
          <h2 className="text-xs sm:text-sm font-semibold tracking-widest text-slate-400 uppercase mb-10 sm:mb-12 md:mb-16 leading-none">Selected Work</h2>
        </Reveal>

        <div className="grid grid-cols-1 gap-12 sm:gap-14 md:gap-16">
          {featured.map((work, index) => (
            <WorkCard key={work.slug} work={work} index={index} />
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link to="/work" className="inline-flex items-center gap-2 text-sm font-medium text-brand-blue hover:text-blue-700 transition-colors">
            View all work →
          </Link>
        </div>
      </div>
    </section>
  );
};
```
Keep the existing `WorkCard` implementation from Task 3 (already on the new `Project` shape) unchanged.

- [ ] **Step 2: Build and run the suite**

Run: `yarn build && yarn test`
Expected: build succeeds; all tests pass.

- [ ] **Step 3: Manual check**

`yarn preview`, home page: the Selected Work section now shows only the featured projects (HillsQuills, Dr. Smit Bharat Solanki, Praeq, Dapper) in the existing alternating layout, followed by a **"View all work →"** link that routes to `/work`. The rest of the home page is unchanged.

- [ ] **Step 4: Checkpoint (user commits)**

```bash
git add components/Work.tsx
git status
```

---

## Final Verification

- [ ] **Full build + test sweep**

Run: `yarn build && yarn test && yarn preview`
Expected:
- Build emits static HTML for `/`, `/work`, every `/work/<slug>`, and a 404.
- All unit/component tests pass.
- Home page is pixel-identical to current production.
- `/work` filters live; cards route to detail pages; detail pages prerender with unique `<title>`/meta (verify a couple via `view-source`).
- The contact modal opens from the nav, Hero, Footer, and the detail-page CTA on every route.
- No `cdn.tailwindcss.com` / `esm.sh` requests; no console errors.

---

## Self-Review Notes (author)

- **Spec coverage:** Phase 0 build hardening → Tasks 1–2, 5–6; routing + per-page SEO → Tasks 5–8; data model → Task 3; `/work` index → Task 7; `/work/:slug` detail → Task 8; home teaser + nav Work link → Tasks 6 & 9; ContactModal lifted to context → Task 4. All M1 spec sections map to a task.
- **No-commit constraint:** every "Commit" step is reframed as a "Checkpoint (user commits)" — the agent stages and stops.
- **Type consistency:** `Project`/`ProjectType`/`ProjectTag`, `cover`, `summary`, `tech: string[]`, and helper signatures (`getProjectBySlug`, `getFeaturedProjects`, `filterProjects`, `getNextProject`, `TYPE_LABELS`, `TAG_LABELS`, `ALL_TYPES`, `ALL_TAGS`) are defined in Task 3 and used consistently in Tasks 7–9.
- **Open risk:** exact `vite-react-ssg` output path for the `/work` route (`dist/work/index.html` vs `dist/work.html`) and 404 emission can vary by version — Step checks accept either; if `getStaticPaths`/`Head` APIs differ in the installed version, consult its README and adjust the entry/route shape (this is the only version-sensitive surface).
```
