# Basic Tech — Site Expansion Design

- **Date:** 2026-06-30
- **Status:** Approved (Milestone 1 ready for planning)
- **Owner:** Pranav Pandey

## 1. Context

Basic Tech is an AI-first tech consultancy whose core business is building
micro-SaaS products, with a goal of converting **European and US clients**. The
company also intends to showcase its own SaaS products and an in-house **AI
inference / infra layer**.

The current site is a polished **React 19 + Vite + TypeScript single-page app**:

- One scrolling page: `Hero → Philosophy → Services → Differentiation → Process →
  Work → AISection → TechStack → Footer`, plus an app-level `ContactModal`.
- Animation via `framer-motion`; smooth scroll via `lenis`; icons via
  `lucide-react`.
- **Tailwind via CDN** (`cdn.tailwindcss.com`), config inline in `index.html`
  (brand `#2F80ED`, slate neutrals, Inter font, custom screens/container).
- Dependencies loaded at runtime through an **`esm.sh` importmap** in
  `index.html` (Google AI Studio export style).
- **No router** and **no per-page metadata** — the whole site is one URL.
- SEO is hand-rolled in `index.html` (meta + OpenGraph + JSON-LD `Organization`).

### Problem

Almost everything the owner wants next — dedicated project pages, a team page, a
blog, research papers, product/infra pages — requires **real routes with their
own URLs and their own meta tags**, individually indexable by search engines
(the whole point is SEO- and credibility-driven client conversion). The current
single-page, CDN-runtime setup cannot deliver that.

## 2. Goals & Non-Goals

### Goals
- Preserve the existing design system exactly — no visual regression.
- Introduce real, individually-indexable routes with per-page SEO.
- Milestone 1: a categorized, filterable **projects portfolio** with a
  **dedicated detail page per project**.
- Establish the architecture so later phases (products, infra, team, blog,
  research, trust pages) drop in cleanly.

### Non-Goals (for Milestone 1)
- No CMS/backend. Content lives in typed data files (and later MDX).
- No migration to Next.js (explicitly chosen against — keep Vite).
- No new visual language; reuse existing components and tokens.
- Products, AI-infra, team, blog, research, and trust pages are **later phases**,
  documented here for context but not built in M1.

## 3. Locked-in Decisions

1. **Architecture:** Keep the Vite app; add `react-router-dom` +
   **static prerendering** via `vite-react-ssg` so each route emits real HTML.
   (Chosen over a Next.js migration and over a no-prerender client router.)
2. **First milestone:** Projects revamp + detail pages.
3. **Content:** Structure-first with realistic placeholders + clear `TODO`
   markers; real copy/photos/metrics filled in later.
4. **Phase 0 build migration is included in Milestone 1** (required for
   prerendering to work).
5. **Taxonomy:** projects categorized on two axes — `type`
   (web/mobile/ai/web3/ecommerce/backend) and `tags`
   (open-source/client-work/in-house/featured).
6. **Home page:** the current `Work` section becomes a **teaser** (top featured
   projects) linking to a new `/work` index.

## 4. Full Roadmap (phased; each phase ships independently)

| Phase | Scope | Routes added |
|---|---|---|
| **0 — Build hardening** *(bundled into M1)* | Make app prerender-able + routing shell | — |
| **1 — Projects** *(this milestone)* | Categorized, filterable portfolio + page per project | `/work`, `/work/:slug` |
| **2 — Products & AI Infra** | Own micro-SaaS + inference layer as product pages | `/products`, `/infra` |
| **3 — Team & Publishing** | Team page + blog + research (MDX) | `/team`, `/blog`, `/blog/:slug`, `/research` |
| **4 — Trust layer** | Case-study metrics, engagement/pricing, GDPR, testimonials, book-a-call, legal | `/engagement`, `/gdpr`, `/privacy`, `/terms` |

### Strategic additions recommended for EU/US client conversion (Phases 2–4)
- Case studies with **quantified outcomes** (time-to-market, users handled,
  conversion lift, cost saved).
- **GDPR / data-handling page** (NDAs, IP ownership, data residency) — a real
  conversion blocker for European clients.
- Testimonials + client logos; **"Book a discovery call"** CTA (Cal.com).
- Dedicated **service/solution landing pages** for buyer-intent SEO.
- **Engagement models** page (fixed-scope MVP / retainer / build-partner).
- Newsletter capture; FAQ; Careers; legal pages.

## 5. Milestone 1 — Detailed Design

### 5.1 Phase 0 — Build hardening (prerequisite)

1. **Remove the `esm.sh` importmap** from `index.html`; let Vite bundle the deps
   already declared in `package.json` (react, react-dom, framer-motion, lenis,
   lucide-react).
2. **Move Tailwind from CDN to a real build:** Tailwind **v3 via PostCSS**.
   Port the existing inline `tailwind.config` (custom `screens`, `brand.blue`/
   `brand.dark`, `container`, `spacing`, `backgroundImage`, Inter font) verbatim
   into `tailwind.config.js`; add `postcss.config.js` and the
   `@tailwind base/components/utilities` directives to `index.css`. Output must
   render pixel-identical to today. (Tailwind v4 considered and rejected — config
   rewrite risk.)
3. **Add routing + prerender:** `react-router-dom` + `vite-react-ssg`. Each route
   prerenders to its own static HTML with its own head tags.
4. **Introduce a `Layout`** (in `components/layout/`):
   - Sticky nav (existing markup) + nav links (`Work`, `Contact`).
   - `<Outlet />` for page content.
   - `Footer`.
   - **`ContactModal` lifted into a React context** (`ContactProvider` /
     `useContact()`) so any button on any page can open it.
   - Re-init or reset `lenis` + scroll-to-top on route change.
5. **Reusable `<Seo>` component** (using `vite-react-ssg`'s head support /
   `react-helmet-async`): sets `title`, `description`, canonical, OpenGraph,
   Twitter, and optional JSON-LD per page. The global `Organization` JSON-LD
   stays in `index.html`.

**Acceptance:** `npm run build` produces static HTML per route; home page is
visually identical to current production; no console errors; ContactModal opens
from every page.

### 5.2 Data model

Extend the current `WorkItem` into a richer `Project` type (`types.ts`).
Project data stays in `constants.ts` for M1 (the `Work` component already imports
from there) — minimizes churn; a `data/projects.ts` split is deferred to a later
phase if the file grows unwieldy.

```ts
interface Project {
  slug: string;                 // URL key, e.g. "kumbh-milan"
  name: string;
  client: string;
  vertical: string;             // industry (existing field)
  type: 'web' | 'mobile' | 'ai' | 'web3' | 'ecommerce' | 'backend';
  tags: Array<'open-source' | 'client-work' | 'in-house' | 'featured'>;
  year?: string;
  role?: string;                // what we did
  summary: string;              // existing 'solution'
  problem: string;              // detail-page narrative   (placeholder if unknown)
  approach: string;             // detail-page narrative   (placeholder if unknown)
  outcome: string;              // metrics-focused         (placeholder if unknown)
  highlights?: string[];        // bullet metrics
  tech: string[];               // split existing ' · ' strings
  cover: string;                // existing 'image'
  gallery?: string[];           // placeholder if none
  websiteUrl?: string;
  githubUrl?: string;
  status?: 'live' | 'archived';
}
```

Migrate all 8 existing projects into this shape: keep real copy, infer
`type`/`tags` from stack (e.g. Kumbh Milan → `mobile`; CricketVoteCrypto →
`web3` + `open-source`; HillsQuills → `web` + `client-work`), assign slugs, split
`tech` strings, mark missing `problem`/`approach`/`outcome`/`gallery` with clear
`TODO` placeholders. Add a few more projects only if real ones are provided.

### 5.3 Routing

```
/                 Home  (existing sections; Work section → teaser)
/work             Projects index (filterable grid)
/work/:slug       Project detail
*                 404 page
```

### 5.4 `/work` index page

- Hero strip (title + one-line positioning).
- **Filter bar:** chips to filter by `type` and by `tags` (client-side; "All"
  default). Optional text search deferred.
- Responsive card grid reusing existing aesthetic (grayscale→color hover, blue
  accents, tech pills): cover image, name, vertical, `type` badge, `tag` pills.
- Card click → `/work/:slug`.
- `<Seo>` with a `CollectionPage` JSON-LD.

### 5.5 `/work/:slug` detail page

Layout reuses existing design language:

1. **Hero:** name, client, industry, year, type/tag badges, **Visit Website** /
   **View Code** buttons.
2. **Overview** (`summary`).
3. **Problem.**
4. **Approach.**
5. **Outcome** — metrics/`highlights` emphasized.
6. **Tech stack** chips.
7. **Gallery** (placeholder images if none).
8. **Next project** link (cycles through list).
9. **CTA** — "Start a project like this" → opens ContactModal via `useContact()`.

`<Seo>` per page with `CreativeWork` JSON-LD. Static params generated from the
project list so every slug prerenders.

### 5.6 Home page changes

- `Work` section → **teaser**: top 3–4 projects tagged `featured`, in the
  existing alternating layout, + a **"View all work →"** link to `/work`.
- Sticky nav gains a **Work** link (router link to `/work`); existing on-page
  anchors still scroll within the home page.
- All other home sections unchanged.

## 6. File / Structure Changes (anticipated)

- **New:** `tailwind.config.js`, `postcss.config.js`,
  `src/router.tsx` (or route config), `components/layout/Layout.tsx`,
  `components/layout/ContactContext.tsx`, `components/Seo.tsx`,
  `pages/Home.tsx`, `pages/WorkIndex.tsx`, `pages/WorkDetail.tsx`,
  `pages/NotFound.tsx`.
- **Changed:** `index.html` (drop importmap + Tailwind CDN; keep org JSON-LD),
  `index.css` (Tailwind directives), `index.tsx`/`App.tsx` (mount router +
  providers), `types.ts` (`Project`), `constants.ts` (project data + slugs),
  `components/Work.tsx` (teaser variant), `package.json` (new deps).
- **Unchanged visuals:** Hero, Philosophy, Services, Differentiation, Process,
  AISection, TechStack, Footer, ContactModal internals.

## 7. Testing & Verification

- `npm run build` + `npm run preview`: confirm static HTML exists per route and
  each route has a unique `<title>`/meta (view source, JS disabled).
- Visual parity check on home vs current production.
- Filter interactions on `/work`; every project card routes correctly; every
  slug renders a detail page; 404 for unknown slug.
- ContactModal opens from nav, home, `/work`, and a detail page.
- Lighthouse/manual: no Tailwind-CDN runtime, no FOUC, no console errors.

## 8. Content TODOs (owner to provide later)

- Real `problem`/`approach`/`outcome` + **quantified metrics** per project.
- Real project screenshots/galleries (replace Unsplash placeholders).
- Decide final taxonomy values if any project doesn't fit the six `type`s.

## 9. Future Phases (context only — not built in M1)

- **Phase 2:** `/products` (own micro-SaaS) + `/infra` (AI inference layer as a
  platform/product, "own the stack" narrative).
- **Phase 3:** `/team`, `/blog` + `/blog/:slug`, `/research` (MDX via Vite plugin).
- **Phase 4:** trust layer — case-study metrics, `/engagement`, `/gdpr`,
  testimonials, Cal.com booking, legal pages, newsletter, FAQ, careers.
