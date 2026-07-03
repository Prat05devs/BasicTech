# Basic Tech — Phase 4: Trust Layer Design

- **Date:** 2026-07-01
- **Status:** Approved (ready for planning)
- **Owner:** Pranav Pandey
- **Builds on:** M1 (routing/prerender/Seo), M2 (data pages, lead-tagging `ContactContext`, nav), M3 (MDX pipeline + `lib/content.ts` + `Prose`)
- **Completes the 4-phase roadmap.**

## 1. Context

The site now has Work, Products/Infra, and Team/Blog/Research. Phase 4 adds the
**trust layer** — the content most directly tied to converting European and US
clients: engagement models, a GDPR/data-handling stance, legal pages,
testimonials, a "book a discovery call" path, and a footer nav. It reuses the
M3 MDX pipeline (`loadCollection`/`getEntry`/`Prose`) for the prose-heavy legal
pages, and the M2 lead-tagging `ContactModal` for booking — **no new
dependencies**.

## 2. Goals & Non-Goals

### Goals
- `/engagement` — engagement models (no hard prices) + a results/proof strip +
  a "Book a discovery call" CTA.
- `/gdpr`, `/privacy`, `/terms`, `/cookies` — prose pages rendered from MDX via a
  shared `ContentPage`, with template copy + a visible "draft — pending review"
  note.
- A `TestimonialsSection` (social proof) on the home page.
- A footer **page-link + legal-link** nav, with the booking CTA.
- Every new route prerenders its own SEO; reuse the existing design system.

### Non-Goals
- **No real pricing numbers** (models + process only; "let's talk").
- **No Cal.com / third-party booking** — booking reuses the `ContactModal`.
- No CMS, no real legal review by us (see §7 disclaimer).
- Engagement + legal pages are NOT added to the top nav (stays at 6); they live
  in the footer.
- Content is placeholder/template (`TODO:` + draft notes), per prior phases.

## 3. Locked-in Decisions

1. **Booking** = inline buttons calling `useContact().open('Discovery call')`.
2. **Pricing** = engagement models + process, no numbers.
3. **Legal pages** = MDX templates with a visible "Draft — pending legal review"
   note (NOT legal advice; owner must have counsel review before go-live).
4. **Legal/prose pages** rendered by a shared `ContentPage` over
   `content/legal/*.mdx` (reusing the M3 pipeline); `/engagement` is a structured
   React page.
5. **Nav:** top nav unchanged (6 links); Engagement + legal in the footer.
6. **Scope:** all of the above in one milestone.

## 4. Detailed Design

### 4.1 Routes & footer placement
- New routes (registered before `{ path: '*' }`): `/engagement` (Component),
  `/gdpr`, `/privacy`, `/terms`, `/cookies` (each `element: <ContentPage slug=… />`).
  All static → auto-prerendered. Total ~23 pages.
- **Footer** (`components/Footer.tsx`) gains a page-link row
  (Work, Products, AI Infra, Team, Blog, Research, Engagement) + a legal row
  (Privacy, Terms, Cookies, GDPR) + a "Book a discovery call" button; social
  links stay.
- A "How we work" / "Book a discovery call" CTA on the home page links to
  `/engagement` / opens the modal.

### 4.2 `/engagement`
- `data/engagement.ts` → `EngagementModel[]` (`slug`, `name`, `summary`,
  `includes: string[]`, `bestFor`, `process: string[]`). Three models:
  Fixed-scope MVP, Monthly retainer, Build-partner. Real conceptual copy.
- `data/results.ts` → `Result[]` (`metric`, `label`) — a compact proof strip
  (seeded from real project highlights, e.g. "Millions of concurrent users",
  "Top 300 globally"; `TODO:` where unknown).
- `components/engagement/ModelCard.tsx` — one model card.
- `pages/Engagement.tsx` — hero → results strip → model grid → "how we work"
  process → **Book a discovery call** CTA (`open('Discovery call')`).
  `Service` JSON-LD; canonical `https://basictech.in/engagement`.

### 4.3 Legal/trust pages (shared `ContentPage`)
- `data/legalPages.ts` → `LEGAL = loadCollection(import.meta.glob('/content/legal/*.mdx', { eager: true }))`.
- `content/legal/{gdpr,privacy,terms,cookies}.mdx` — frontmatter
  (`title`, `date` = last-updated, `excerpt`) + template body. Each body OPENS
  with a visible note: `> **Draft — pending legal review.** …` (owner deletes
  when finalized). Copy: GDPR (data handling, NDAs, IP ownership, data residency,
  sub-processors); Privacy/Terms/Cookies standard skeletons.
- `components/content/ContentPage.tsx`:
  ```tsx
  const ContentPage: React.FC<{ slug: string }> = ({ slug }) => {
    const entry = getEntry(LEGAL, slug);
    if (!entry) return <Navigate to="/" replace />;
    // header (title + 'Last updated' date) → <Prose entry={entry} /> in a max-w-3xl container
    // <Seo> from frontmatter, WebPage JSON-LD, canonical https://basictech.in/<slug>
  };
  ```
  Reuses M3 `Prose` + `getEntry`. The draft note lives in the MDX body (not the
  component) so it's removable per page.

### 4.4 Testimonials
- `data/testimonials.ts` → `Testimonial[]` (`quote`, `author`, `role`,
  `company`, `avatar?`) — 3 placeholders (`TODO:`).
- `components/TestimonialsSection.tsx` — a section (heading + testimonial cards),
  reusing brand tokens + `Reveal`.
- Placed on the home page (`pages/Home.tsx`) after `<Differentiation />`.

### 4.5 Footer + booking CTA
- `components/Footer.tsx`: add the page-link + legal-link rows and a
  "Book a discovery call" button (`useContact().open('Discovery call')` — Footer
  imports `useContact`; it already renders within `ContactProvider`). Keep the
  existing social links and `onStartConversation` CTA. Use `react-router-dom`
  `Link` for internal links.

### 4.6 SEO & prerender
Each new route prerenders one `<title>`/description/canonical + JSON-LD; the
legal MDX bodies prerender (M3 pattern — verified by grep). `index.html`
untouched. No duplicate head tags.

## 5. File / Structure Changes

**New:**
- `data/engagement.ts`, `data/results.ts`, `data/testimonials.ts`, `data/legalPages.ts`
- `content/legal/gdpr.mdx`, `content/legal/privacy.mdx`, `content/legal/terms.mdx`, `content/legal/cookies.mdx`
- `components/engagement/ModelCard.tsx`, `components/TestimonialsSection.tsx`, `components/content/ContentPage.tsx`
- `pages/Engagement.tsx`
- Tests: `pages/Engagement.test.tsx`, `components/content/ContentPage.test.tsx`, `components/TestimonialsSection.test.tsx`, `components/Footer.test.tsx`

**Modified:**
- `routes.tsx` (5 new routes)
- `components/Footer.tsx` (nav rows + booking CTA)
- `pages/Home.tsx` (insert `<TestimonialsSection />`)

**Unchanged:** top nav / `NAV_LINKS`, `Seo`, build config, all existing pages
except Home (one inserted section) and Footer.

## 6. Testing & Verification

- `pages/Engagement.test.tsx`: renders a card per model + the results strip;
  "Book a discovery call" opens the modal tagged `Discovery call` (Probe over
  `useContact`).
- `components/content/ContentPage.test.tsx`: `<ContentPage slug="gdpr" />`
  renders the page title + body (real MDX heading); an unknown slug redirects
  home.
- `components/TestimonialsSection.test.tsx`: renders a card per testimonial.
- `components/Footer.test.tsx`: renders the page + legal links (within
  `ContactProvider` + `MemoryRouter`); "Book a discovery call" opens the modal
  tagged `Discovery call`.
- `yarn build`: all 5 routes prerender; legal-page MDX bodies present in static
  HTML; one `<title>`/canonical each; ~23 pages total. Existing pages unchanged
  (home gains the testimonials section).
- `yarn test`: full suite green, output pristine.

## 7. Legal Disclaimer (important)

The copy in `content/legal/*.mdx` is a **non-binding template for structure
only — not legal advice.** Basic Tech must have it reviewed and adapted by
qualified legal counsel (and aligned with actual data practices) before
publishing. Each page ships with a visible "Draft — pending legal review" note
to prevent accidental reliance.

## 8. Content TODOs (owner)

- Real engagement-model details + results metrics; real testimonials
  (quotes/attribution/logos); counsel-reviewed legal copy (then remove the draft
  notes); `public/og-basic-tech.png` (outstanding since M1).

## 9. After Phase 4

Roadmap complete. Future candidates (not planned): blog search/tags/RSS, nav
grouping if it grows, real Cal.com embed, case-study deep-dives, multi-currency.
