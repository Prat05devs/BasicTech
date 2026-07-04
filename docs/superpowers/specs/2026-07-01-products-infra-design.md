# Basic Tech — Phase 2: Products & AI Infra Design

- **Date:** 2026-07-01
- **Status:** Approved (ready for planning)
- **Owner:** Pranav Pandey
- **Builds on:** [2026-06-30-projects-revamp-design.md](2026-06-30-projects-revamp-design.md) (Milestone 1 — routing, prerender, `Seo`, `ContactContext`)

## 1. Context

Milestone 1 turned the single-page site into a multi-route, statically-prerendered
app (react-router-dom + vite-react-ssg, Tailwind via PostCSS) with a projects
portfolio. The foundation now in place and reused here:

- Static prerendered routes (named routes auto-discovered by vite-react-ssg).
- `components/Seo.tsx` for per-page `<title>`/meta/OpenGraph/JSON-LD.
- `components/layout/Layout.tsx` (nav + footer + `ContactModal`) and
  `components/layout/ContactContext.tsx` (`ContactProvider` / `useContact()`).
- `components/ui/Reveal.tsx`, brand tokens (`#2F80ED`/`#0f172a`, Inter),
  the `container mx-auto px-4 sm:px-5 …` width pattern.
- `ContactModal` submits a contact form; its "inquiry type" means *who is
  enquiring* (Entrepreneur/Startup/…), and it currently accepts only
  `isOpen`/`onClose` — no lead-source attribution.

Phase 2 adds Basic Tech's **own offerings**: a pre-launch **Products** catalog and
a flagship **AI inference / infra** page, positioning the company as an AI-first
shop that runs its own stack.

## 2. Goals & Non-Goals

### Goals
- `/infra` — a flagship page positioning the in-development AI inference layer
  ("own the stack"), with an early-access CTA.
- `/products` — a pre-launch catalog of own micro-SaaS with status badges and a
  "notify me" CTA.
- Capture early-access/waitlist interest **with lead attribution** and **no new
  backend**, by reusing the existing `ContactModal`.
- Add `Products` + `AI Infra` to the nav, plus a basic **mobile nav menu**
  (the nav now has 3+ destinations and currently no mobile access).
- Reuse the M1 design system and prerender/SEO foundation; zero regression to
  existing pages (only the shared nav changes, kept visually consistent).

### Non-Goals (this phase)
- No per-product detail pages (pre-launch; YAGNI — added when products launch).
- No real waitlist/email-capture backend (reuse `ContactModal`).
- No CMS. Content lives in typed data files with placeholders + `TODO:` markers.
- No changes to the Work/projects feature.

## 3. Locked-in Decisions

1. **Lead capture:** reuse `ContactModal`, lightly extended so CTAs **tag the
   lead source** (e.g. `AI Infra — Early Access`, `Product waitlist: <name>`).
2. **Products:** catalog grid only this phase (no detail pages).
3. **Mobile nav:** add a simple mobile menu now.
4. **Both pages** built this milestone; `/infra` gets the richer flagship
   treatment.
5. Content is **structure-first with placeholders** (`TODO:` markers), per M1.

## 4. Detailed Design

### 4.1 Routing & Nav

- **Routes** (`routes.tsx`): add `{ path: 'products', Component: Products }` and
  `{ path: 'infra', Component: Infra }` as children of the layout route, BEFORE
  the `{ path: '*' }` catch-all. Static named routes → auto-prerendered (the M1
  pattern; no `ssgOptions.includedRoutes` change needed).
- **Nav** (`components/layout/Layout.tsx`): the desktop nav gains `Work` (exists),
  **Products**, **AI Infra** links + the Contact button. Add a **mobile menu**:
  a hamburger button (visible `sm:hidden`) toggles a dropdown panel containing
  the same links + a Contact action. Menu state is local to the `Nav` component
  (`useState`); the panel closes on link click and on route change.
- **Footer** (`components/Footer.tsx`): **leave as-is this phase** (social links
  only). A footer page-link row is deferred to the Phase 4 trust layer, where the
  full set of destinations (incl. legal/engagement pages) exists.

### 4.2 Lead-capture extension (ContactContext + ContactModal)

Extend the M1 context so CTAs can attribute the lead, backwards-compatibly:

- `components/layout/ContactContext.tsx`:
  - `open(context?: string)` stores an optional `context` string in state
    (cleared on `close`).
  - `useContact()` returns `{ isOpen, open, close, context }`.
  - Existing `open()` calls (nav, Hero, Footer, WorkDetail CTA) keep working —
    `context` is simply `undefined`.
- `components/layout/Layout.tsx`: pass `context` to
  `<ContactModal isOpen={isOpen} onClose={close} context={context} />`.
- `components/ContactModal.tsx`:
  - Add optional `context?: string` prop.
  - When set: include it in the submission payload (e.g. a `source`/`context`
    field) and render a small non-editable subject label at the top of the form
    (e.g. "Early access: AI Infra"). When unset: behave exactly as today.

### 4.3 `/infra` — flagship page

`pages/Infra.tsx`, composed from `data/infra.ts` (arrays so the page stays
declarative and the file focused):

- **Hero:** bold statement ("We run our own AI inference layer" / *own the
  stack*) + sub-copy; primary CTA **Get early access** → `open('AI Infra —
  Early Access')`. Honest **"In development"** status chip.
- **Why we own the stack** — 4 value props (`data/infra.ts` `INFRA_VALUES`):
  control & reliability, cost efficiency at scale, **data privacy & residency**
  (EU/GDPR lever), no vendor lock-in / latency. (Copy is real where confident,
  `TODO:` where specifics are unknown.)
- **Capabilities** — `INFRA_CAPABILITIES` (placeholder specifics, `TODO:`).
- **Roadmap / principles** — short list signalling seriousness without
  overclaiming.
- **Early-access CTA section** — repeat CTA.
- `<Seo>` with `title`/canonical `https://basictech.in/infra` and a `Service`
  (or `Product`) JSON-LD. Visual nod to the existing `AISection` flow-line
  aesthetic (reuse the animated SVG pattern, not a new visual language).

Sub-components kept small: `components/infra/ValueProp.tsx`,
`components/infra/CapabilityCard.tsx` (or compose inline if trivial).

### 4.4 `/products` — pre-launch catalog

`pages/Products.tsx`, data from `data/products.ts`:

```ts
export type ProductStatus = 'building' | 'beta' | 'coming-soon' | 'live';

export interface Product {
  slug: string;
  name: string;
  tagline: string;       // one-liner
  description: string;
  status: ProductStatus;
  category: string;      // e.g. 'DevTools', 'AI', 'Productivity'
  icon?: string;         // lucide icon name
  cover?: string;
  url?: string;          // present when beta/live
}

export const PRODUCTS: Product[];                 // 2–3 placeholder products, TODO-marked
export const STATUS_LABELS: Record<ProductStatus, string>;
export const STATUS_STYLES: Record<ProductStatus, string>; // badge classes
```

- **Hero:** "Products we're building" + sub-copy.
- **Grid** of `components/products/ProductCard.tsx`: name, category, tagline,
  **status badge** (label + color from the maps), and a **Notify me** CTA →
  `open(`Product waitlist: ${product.name}`)`. If `url` present (beta/live),
  also show a "Visit" link.
- `<Seo>` with canonical `https://basictech.in/products` and `CollectionPage`
  JSON-LD.

> Naming note: Work projects remain `PROJECTS` (constants.ts / lib/projects.ts);
> these are `PRODUCTS` (data/products.ts) — distinct domains, named to match.

### 4.5 SEO & prerender

Both routes prerender to their own static HTML with distinct `<title>`,
description, canonical, and JSON-LD (validated like M1 — exactly one each, no
duplicate/conflicting head tags, since `index.html` no longer carries per-page
tags after the M1 fix).

## 5. File / Structure Changes

**New:**
- `pages/Products.tsx`, `pages/Infra.tsx`
- `data/products.ts`, `data/infra.ts`
- `components/products/ProductCard.tsx`
- `components/infra/ValueProp.tsx`, `components/infra/CapabilityCard.tsx`
  (or inline if trivial)
- Tests: `pages/Products.test.tsx`, `pages/Infra.test.tsx`,
  `data/products.test.ts` (if a helper warrants), and a nav mobile-menu test
  (in a Layout/nav test).

**Modified:**
- `routes.tsx` (two new routes)
- `components/layout/Layout.tsx` (nav links + mobile menu; pass `context`)
- `components/layout/ContactContext.tsx` (`open(context?)` + `context` in value)
- `components/layout/ContactContext.test.tsx` (cover the `context` arg)
- `components/ContactModal.tsx` (optional `context` prop → payload + label)

**Unchanged:** all existing page sections, the Work/projects feature, the Seo
component, `components/Footer.tsx`, build/Tailwind config.

## 6. Testing & Verification

- `data/products.ts`: if a helper is added (e.g. status grouping), unit-test it;
  otherwise the data is exercised via the page test.
- `pages/Products.test.tsx`: renders a card per product; status badges render;
  clicking "Notify me" calls `open` with `Product waitlist: <name>` (render
  within `ContactProvider` + a probe asserting `isOpen` + `context`).
- `pages/Infra.test.tsx`: renders hero + the 4 value props + capabilities;
  "Get early access" calls `open('AI Infra — Early Access')`.
- `ContactContext.test.tsx`: `open('X')` sets `context = 'X'`; `close()` clears
  it; `open()` (no arg) leaves `context` undefined (backwards compatible).
- Nav: mobile menu toggles open/closed and closes on link click.
- `yarn build`: `/products` and `/infra` each prerender to static HTML with a
  unique `<title>`/canonical (grep `dist/products.html`, `dist/infra.html`);
  full prerender count increases by 2 (now 13 pages). Existing pages unchanged.
- `yarn test`: full suite green; output pristine.

## 7. Content TODOs (owner to provide later)

- Real product names/taglines/descriptions/status (replace placeholders).
- Real AI-infra capabilities, value-prop specifics, roadmap items.
- Confirm `/infra` JSON-LD type and any concrete specs/pricing once defined.
- Provide a default OG image asset (`public/og-basic-tech.png`) — outstanding
  from M1; used by these pages' default OG too.

## 8. Future Phases (context only — not built here)

- **Phase 3:** `/team`, `/blog` + `/blog/:slug`, `/research` (MDX).
- **Phase 4:** trust layer — case-study metrics, `/engagement`, `/gdpr`,
  testimonials, Cal.com booking, legal pages.
- Per-product detail pages when products launch.
