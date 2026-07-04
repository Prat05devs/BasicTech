# Phase 4 — Trust Layer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the trust layer — `/engagement` (models + results + booking CTA), MDX legal pages (`/gdpr`, `/privacy`, `/terms`, `/cookies`) via a shared `ContentPage`, a home testimonials section, and a footer nav with a booking CTA.

**Architecture:** Reuse the M3 MDX pipeline (`loadCollection`/`getEntry`/`Prose`) for the prose legal pages and the M2 lead-tagging `ContactModal` for booking (no new dependencies). New routes prerender statically (the M1/M2 pattern). `/engagement` and testimonials are structured React/data pages; legal pages are MDX rendered by one `ContentPage` component.

**Tech Stack:** React 19, TS ~5.8, Vite 6, react-router-dom 6.30, vite-react-ssg 0.8.9, @mdx-js/rollup 3, @tailwindcss/typography, framer-motion, lucide-react. Tests: Vitest + RTL. Package manager: **yarn**.

## Global Constraints

- **Package manager is yarn.** `yarn test`, `yarn build`, `yarn dev`. NEVER npm / `package-lock.json`.
- **DO NOT run `git commit`.** No-commit mode. Each "Checkpoint" = `git add -A` to STAGE + verify + STOP; the human commits.
- **Files at the repo ROOT** (`pages/`, `components/`, `data/`, `content/`, `routes.tsx`), not `src/`.
- **Brand tokens exact:** `brand.blue #2F80ED`, `brand.dark #0f172a`, Inter. Reuse the existing design system (`Reveal`, `Prose`, `container mx-auto px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10 2xl:px-12`). No new visual language.
- **No new dependencies.** Booking reuses `useContact().open('Discovery call')`. Legal pages reuse the existing MDX pipeline.
- **No hard prices** on `/engagement` — models + process only.
- **Legal copy is a non-binding TEMPLATE, not legal advice.** Each legal MDX body OPENS with a blockquote: `> **Draft — pending legal review.** This is a template, not legal advice.` (owner removes after counsel review). Do NOT present it as finalized.
- **Top nav unchanged** (`NAV_LINKS` stays 6). Engagement + legal are reached via the footer + home CTA.
- **Prerender:** new static routes auto-discover; legal MDX bodies must appear in the static HTML (M3 pattern). Build rises to ~23 pages.
- **SEO:** one `<title>`/description/canonical + JSON-LD per route; `index.html` untouched.

---

## File Structure

**New**
- `data/engagement.ts`, `data/results.ts`, `data/testimonials.ts`, `data/legalPages.ts`
- `content/legal/gdpr.mdx`, `content/legal/privacy.mdx`, `content/legal/terms.mdx`, `content/legal/cookies.mdx`
- `components/engagement/ModelCard.tsx`, `components/TestimonialsSection.tsx`, `components/content/ContentPage.tsx`
- `pages/Engagement.tsx`
- Tests: `pages/Engagement.test.tsx`, `components/content/ContentPage.test.tsx`, `components/TestimonialsSection.test.tsx`, `components/Footer.test.tsx`

**Modified**
- `routes.tsx` (5 new routes), `pages/Home.tsx` (insert testimonials), `components/Footer.tsx` (nav rows + booking CTA)

---

## Task 1: `/engagement`

**Files:**
- Create: `data/engagement.ts`, `data/results.ts`, `components/engagement/ModelCard.tsx`, `pages/Engagement.tsx`, `pages/Engagement.test.tsx`
- Modify: `routes.tsx`

**Interfaces:**
- Consumes: `useContact().open(context)`, `Seo`, `Reveal`.
- Produces: `EngagementModel`, `ENGAGEMENT_MODELS`, `Result`, `RESULTS`, `ModelCard: React.FC<{ model: EngagementModel }>`, `Engagement` (default export).

- [ ] **Step 1: Create `data/engagement.ts`**

```ts
export interface EngagementModel {
  slug: string;
  name: string;
  summary: string;
  bestFor: string;
  includes: string[];
  process: string[];
}

export const ENGAGEMENT_MODELS: EngagementModel[] = [
  {
    slug: 'mvp',
    name: 'Fixed-scope MVP',
    summary: 'A defined product, shipped in weeks — from idea to market-ready.',
    bestFor: 'Founders validating an idea or raising on a working product.',
    includes: ['Discovery & scope', 'Design & build', 'Launch & handover'],
    process: ['Scope workshop', 'Architecture first', 'Weekly build increments', 'Ship + support window'],
  },
  {
    slug: 'retainer',
    name: 'Monthly retainer',
    summary: 'A senior team, continuously — ongoing product and platform work.',
    bestFor: 'Teams that need sustained delivery without hiring in-house.',
    includes: ['Dedicated engineers', 'Roadmap & delivery', 'Maintenance & on-call'],
    process: ['Onboarding', 'Rolling backlog', 'Biweekly reviews', 'Continuous delivery'],
  },
  {
    slug: 'build-partner',
    name: 'Build-partner',
    summary: 'We build alongside you, longer-term — co-owning outcomes.',
    bestFor: 'Ventures where deep, shared ownership beats a vendor relationship.',
    includes: ['Embedded team', 'Shared roadmap', 'Equity / blended models'],
    process: ['Alignment', 'Joint planning', 'Build & iterate', 'Scale together'],
  },
];
```

- [ ] **Step 2: Create `data/results.ts`**

```ts
export interface Result {
  metric: string;
  label: string;
}

// Seeded from real project highlights; TODO: add/replace with more results.
export const RESULTS: Result[] = [
  { metric: 'Millions', label: 'concurrent users handled (Kumbh Milan)' },
  { metric: 'Top 300', label: 'globally at Lovable’s competition (Dapper)' },
  { metric: '23+', label: 'error scenarios hardened (Inventory system)' },
  { metric: 'TODO', label: 'TODO: add another headline result' },
];
```

- [ ] **Step 3: Create `components/engagement/ModelCard.tsx`**

```tsx
import React from 'react';
import { motion } from 'framer-motion';
import { EngagementModel } from '../../data/engagement';

export const ModelCard: React.FC<{ model: EngagementModel }> = ({ model }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.6 }}
    className="flex flex-col h-full border border-slate-200 rounded-lg p-6 bg-white"
  >
    <h3 className="text-xl font-semibold text-slate-900 tracking-tight mb-2">{model.name}</h3>
    <p className="text-sm text-slate-600 font-light leading-relaxed mb-4">{model.summary}</p>
    <p className="text-xs font-medium text-brand-blue mb-4">Best for: {model.bestFor}</p>
    <div className="mb-4">
      <p className="text-xs font-semibold tracking-widest text-slate-400 uppercase mb-2">Includes</p>
      <ul className="space-y-1">
        {model.includes.map((i) => (
          <li key={i} className="text-sm text-slate-700 flex gap-2"><span className="text-brand-blue">·</span>{i}</li>
        ))}
      </ul>
    </div>
    <div className="mt-auto">
      <p className="text-xs font-semibold tracking-widest text-slate-400 uppercase mb-2">How it works</p>
      <ol className="space-y-1">
        {model.process.map((p, i) => (
          <li key={p} className="text-sm text-slate-600 font-light">{i + 1}. {p}</li>
        ))}
      </ol>
    </div>
  </motion.div>
);
```

- [ ] **Step 4: Write the failing test `pages/Engagement.test.tsx`**

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ContactProvider, useContact } from '../components/layout/ContactContext';
import Engagement from './Engagement';
import { ENGAGEMENT_MODELS } from '../data/engagement';

function Probe() {
  const { isOpen, context } = useContact();
  return <div data-testid="probe">{isOpen ? 'open' : 'closed'}|{context ?? ''}</div>;
}

function renderPage() {
  return render(
    <ContactProvider><MemoryRouter><Engagement /><Probe /></MemoryRouter></ContactProvider>,
  );
}

describe('Engagement', () => {
  it('renders a card per engagement model and the results strip', () => {
    renderPage();
    const grid = screen.getByTestId('model-grid');
    expect(within(grid).getAllByRole('heading', { level: 3 }).length).toBe(ENGAGEMENT_MODELS.length);
    expect(screen.getByTestId('results-strip')).toBeInTheDocument();
  });
  it('"Book a discovery call" opens the contact modal tagged Discovery call', () => {
    renderPage();
    fireEvent.click(screen.getAllByRole('button', { name: /book a discovery call/i })[0]);
    expect(screen.getByTestId('probe')).toHaveTextContent('open|Discovery call');
  });
});
```

- [ ] **Step 5: Run it to confirm failure**

Run: `yarn test pages/Engagement.test.tsx`
Expected: FAIL — cannot resolve `./Engagement`.

- [ ] **Step 6: Implement `pages/Engagement.tsx`**

```tsx
import React from 'react';
import { ENGAGEMENT_MODELS } from '../data/engagement';
import { RESULTS } from '../data/results';
import { ModelCard } from '../components/engagement/ModelCard';
import { useContact } from '../components/layout/ContactContext';
import { Seo } from '../components/Seo';
import { Reveal } from '../components/ui/Reveal';

const Engagement: React.FC = () => {
  const { open } = useContact();
  const book = () => open('Discovery call');

  return (
    <section className="pt-32 pb-24 bg-white min-h-screen">
      <Seo
        title="How We Work | Basic Tech"
        description="Engagement models for building software with Basic Tech — fixed-scope MVPs, retainers, and build-partnerships. Book a discovery call."
        canonical="https://basictech.in/engagement"
        jsonLd={{ '@context': 'https://schema.org', '@type': 'Service', name: 'Basic Tech Engagement Models', provider: { '@type': 'Organization', name: 'Basic Tech' }, url: 'https://basictech.in/engagement' }}
      />
      <div className="container mx-auto px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10 2xl:px-12">
        <Reveal>
          <p className="text-xs sm:text-sm font-semibold tracking-widest text-slate-400 uppercase mb-4">How we work</p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-slate-900 tracking-tight mb-4 max-w-2xl">Ways to work with us.</h1>
          <p className="text-base sm:text-lg text-slate-600 font-light mb-12 max-w-2xl">Pick the engagement that fits where you are. Not sure? Book a call and we’ll figure it out together.</p>
        </Reveal>

        {/* Results strip */}
        <div data-testid="results-strip" className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16 border-y border-slate-200 py-8">
          {RESULTS.map((r, i) => (
            <div key={i}>
              <p className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight">{r.metric}</p>
              <p className="text-xs sm:text-sm text-slate-500 font-light mt-1">{r.label}</p>
            </div>
          ))}
        </div>

        {/* Models */}
        <div data-testid="model-grid" className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {ENGAGEMENT_MODELS.map((m) => <ModelCard key={m.slug} model={m} />)}
        </div>

        {/* CTA */}
        <div className="mt-20 text-center bg-slate-50 rounded-lg py-12 px-6">
          <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight mb-4">Let’s talk about your project.</h2>
          <p className="text-slate-600 font-light mb-8 max-w-xl mx-auto">A 30-minute discovery call — no pitch, just a conversation about what you’re building.</p>
          <button onClick={book} className="bg-slate-900 text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-slate-800 transition-colors shadow-lg">
            Book a discovery call
          </button>
        </div>
      </div>
    </section>
  );
};

export default Engagement;
```

- [ ] **Step 7: Run it to confirm pass**

Run: `yarn test pages/Engagement.test.tsx`
Expected: PASS — both tests pass.

- [ ] **Step 8: Register the `/engagement` route**

In `routes.tsx`, add the import and the route BEFORE `{ path: '*' }`:
```tsx
import Engagement from './pages/Engagement';
```
```tsx
  { path: 'engagement', Component: Engagement },
```

- [ ] **Step 9: Build-verify**

Run: `yarn build`
Expected: `dist/engagement.html` exists, one `<title>`, canonical `https://basictech.in/engagement`.
```bash
test -e dist/engagement.html && echo "engagement ok"; grep -c '<title' dist/engagement.html
```

- [ ] **Step 10: Checkpoint (user commits)**

```bash
git add data/engagement.ts data/results.ts components/engagement/ModelCard.tsx pages/Engagement.tsx pages/Engagement.test.tsx routes.tsx
git status
```

---

## Task 2: Legal pages (`/gdpr`, `/privacy`, `/terms`, `/cookies`)

**Files:**
- Create: `data/legalPages.ts`, `content/legal/gdpr.mdx`, `content/legal/privacy.mdx`, `content/legal/terms.mdx`, `content/legal/cookies.mdx`, `components/content/ContentPage.tsx`, `components/content/ContentPage.test.tsx`
- Modify: `routes.tsx`

**Interfaces:**
- Consumes: `loadCollection`/`getEntry` (M3), `Prose` (M3), `formatDate` (`lib/format`), `Seo`, `Navigate`.
- Produces: `LEGAL: ContentEntry[]`, `ContentPage: React.FC<{ slug: string }>`.

- [ ] **Step 1: Create `data/legalPages.ts`**

```ts
import { loadCollection } from '../lib/content';

export const LEGAL = loadCollection(import.meta.glob('/content/legal/*.mdx', { eager: true }));
```

- [ ] **Step 2: Create the four legal MDX files**

`content/legal/gdpr.mdx`:
```mdx
---
title: "GDPR & Data Handling"
date: "2026-07-01"
excerpt: "How Basic Tech handles client and personal data, NDAs, IP ownership, and residency."
---

> **Draft — pending legal review.** This is a template, not legal advice.

## Our stance

We treat client and personal data as confidential and process it only to deliver
the services we’ve agreed to. We’re happy to sign an NDA before any engagement.

## Data residency & sub-processors

We can scope where data is stored and processed, and we maintain a list of
sub-processors available on request.

## IP ownership

Work product is assigned to the client on payment, as set out in the engagement
agreement.

## Your rights

Under the GDPR you may request access, correction, or deletion of personal data.
Contact us to exercise these rights.
```

`content/legal/privacy.mdx`:
```mdx
---
title: "Privacy Policy"
date: "2026-07-01"
excerpt: "What data this site collects and how it’s used."
---

> **Draft — pending legal review.** This is a template, not legal advice.

## What we collect

When you contact us, we collect the details you submit (name, email, message).
The site does not sell personal data.

## How we use it

To respond to your enquiry and provide our services.

## Contact

Email us to ask about the data we hold about you.
```

`content/legal/terms.mdx`:
```mdx
---
title: "Terms of Service"
date: "2026-07-01"
excerpt: "The terms governing use of this website."
---

> **Draft — pending legal review.** This is a template, not legal advice.

## Use of this site

This site is provided for information about Basic Tech’s services. Engagement
terms are set out in separate signed agreements.

## Liability

The site content is provided “as is” without warranties.
```

`content/legal/cookies.mdx`:
```mdx
---
title: "Cookie Policy"
date: "2026-07-01"
excerpt: "How this site uses cookies."
---

> **Draft — pending legal review.** This is a template, not legal advice.

## Cookies we use

This site uses minimal cookies necessary for it to function. We’ll update this
page if we add analytics or other cookies.
```

- [ ] **Step 3: Write the failing test `components/content/ContentPage.test.tsx`**

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ContentPage } from './ContentPage';

function renderWith(slug: string) {
  return render(
    <MemoryRouter initialEntries={['/page']}>
      <Routes>
        <Route path="/page" element={<ContentPage slug={slug} />} />
        <Route path="/" element={<div>home</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('ContentPage', () => {
  it('renders a known legal page title + MDX body', () => {
    renderWith('gdpr');
    expect(screen.getByRole('heading', { level: 1, name: /GDPR/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Our stance' })).toBeInTheDocument(); // from the MDX body
  });
  it('redirects an unknown slug home', () => {
    renderWith('does-not-exist');
    expect(screen.getByText('home')).toBeInTheDocument();
  });
});
```

- [ ] **Step 4: Run it to confirm failure**

Run: `yarn test components/content/ContentPage.test.tsx`
Expected: FAIL — cannot resolve `./ContentPage`.

- [ ] **Step 5: Implement `components/content/ContentPage.tsx`**

```tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { LEGAL } from '../../data/legalPages';
import { getEntry } from '../../lib/content';
import { Prose } from './Prose';
import { Seo } from '../Seo';
import { formatDate } from '../../lib/format';

export const ContentPage: React.FC<{ slug: string }> = ({ slug }) => {
  const entry = getEntry(LEGAL, slug);
  if (!entry) return <Navigate to="/" replace />;
  const { frontmatter } = entry;

  return (
    <article className="pt-32 pb-24 bg-white">
      <Seo
        title={`${frontmatter.title} | Basic Tech`}
        description={frontmatter.excerpt}
        canonical={`https://basictech.in/${slug}`}
        jsonLd={{ '@context': 'https://schema.org', '@type': 'WebPage', name: frontmatter.title, url: `https://basictech.in/${slug}` }}
      />
      <div className="container mx-auto px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10 2xl:px-12 max-w-3xl">
        <header className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-semibold text-slate-900 tracking-tight">{frontmatter.title}</h1>
          <p className="text-sm text-slate-400 mt-2">Last updated {formatDate(frontmatter.date)}</p>
        </header>
        <Prose entry={entry} />
      </div>
    </article>
  );
};
```

- [ ] **Step 6: Run it to confirm pass**

Run: `yarn test components/content/ContentPage.test.tsx`
Expected: PASS — both tests pass (real MDX body heading renders; unknown slug redirects).

- [ ] **Step 7: Register the four legal routes**

In `routes.tsx`, add the import and the routes BEFORE `{ path: '*' }`:
```tsx
import { ContentPage } from './components/content/ContentPage';
```
```tsx
  { path: 'gdpr', element: <ContentPage slug="gdpr" /> },
  { path: 'privacy', element: <ContentPage slug="privacy" /> },
  { path: 'terms', element: <ContentPage slug="terms" /> },
  { path: 'cookies', element: <ContentPage slug="cookies" /> },
```

- [ ] **Step 8: Build-verify the legal MDX prerenders**

Run: `yarn build`
Expected: each legal route prerenders with its MDX body text:
```bash
for p in gdpr privacy terms cookies; do test -e dist/$p.html && echo "$p ok"; done
grep -q "Our stance" dist/gdpr.html && echo "gdpr MDX body prerendered"
grep -o 'rel="canonical" href="[^"]*"' dist/gdpr.html   # https://basictech.in/gdpr
```

- [ ] **Step 9: Full suite**

Run: `yarn test`
Expected: all green.

- [ ] **Step 10: Checkpoint (user commits)**

```bash
git add data/legalPages.ts content/legal/ components/content/ContentPage.tsx components/content/ContentPage.test.tsx routes.tsx
git status
```

---

## Task 3: Testimonials (home)

**Files:**
- Create: `data/testimonials.ts`, `components/TestimonialsSection.tsx`, `components/TestimonialsSection.test.tsx`
- Modify: `pages/Home.tsx`

**Interfaces:**
- Consumes: `Reveal`.
- Produces: `Testimonial`, `TESTIMONIALS`, `TestimonialsSection` (named export).

- [ ] **Step 1: Create `data/testimonials.ts`**

```ts
export interface Testimonial {
  quote: string;
  author: string;
  role: string;
  company: string;
  avatar?: string;
}

// TODO: replace with real client testimonials + attribution.
export const TESTIMONIALS: Testimonial[] = [
  { quote: 'TODO: a specific, outcome-focused client quote.', author: 'TODO: Name', role: 'TODO: Role', company: 'TODO: Company' },
  { quote: 'TODO: a second client quote.', author: 'TODO: Name', role: 'TODO: Role', company: 'TODO: Company' },
  { quote: 'TODO: a third client quote.', author: 'TODO: Name', role: 'TODO: Role', company: 'TODO: Company' },
];
```

- [ ] **Step 2: Write the failing test `components/TestimonialsSection.test.tsx`**

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { TestimonialsSection } from './TestimonialsSection';
import { TESTIMONIALS } from '../data/testimonials';

describe('TestimonialsSection', () => {
  it('renders a card per testimonial', () => {
    render(<TestimonialsSection />);
    const list = screen.getByTestId('testimonials');
    expect(within(list).getAllByRole('blockquote').length).toBe(TESTIMONIALS.length);
  });
});
```

- [ ] **Step 3: Run it to confirm failure**

Run: `yarn test components/TestimonialsSection.test.tsx`
Expected: FAIL — cannot resolve `./TestimonialsSection`.

- [ ] **Step 4: Implement `components/TestimonialsSection.tsx`**

```tsx
import React from 'react';
import { TESTIMONIALS } from '../data/testimonials';
import { Reveal } from './ui/Reveal';

export const TestimonialsSection: React.FC = () => (
  <section className="py-16 sm:py-20 md:py-24 bg-white">
    <div className="container mx-auto px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10 2xl:px-12">
      <Reveal>
        <h2 className="text-xs sm:text-sm font-semibold tracking-widest text-slate-400 uppercase mb-10 sm:mb-12 md:mb-16 leading-none">What clients say</h2>
      </Reveal>
      <div data-testid="testimonials" className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {TESTIMONIALS.map((t, i) => (
          <figure key={i} className="flex flex-col">
            <blockquote className="text-base text-slate-700 font-light leading-relaxed mb-4">“{t.quote}”</blockquote>
            <figcaption className="mt-auto">
              <p className="text-sm font-semibold text-slate-900">{t.author}</p>
              <p className="text-xs text-slate-500">{t.role}, {t.company}</p>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  </section>
);
```

- [ ] **Step 5: Run it to confirm pass**

Run: `yarn test components/TestimonialsSection.test.tsx`
Expected: PASS.

- [ ] **Step 6: Insert `<TestimonialsSection />` into `pages/Home.tsx`**

Add the import:
```tsx
import { TestimonialsSection } from '../components/TestimonialsSection';
```
Insert the section after `<Differentiation />` (keep the rest of the order unchanged):
```tsx
      <Differentiation />
      <TestimonialsSection />
      <Process />
```

- [ ] **Step 7: Build + full suite**

Run: `yarn test` then `yarn build`
Expected: full suite green; build succeeds; the home page now shows the testimonials section (still prerenders the home route).
```bash
grep -q "What clients say" dist/index.html && echo "testimonials on home"
```

- [ ] **Step 8: Checkpoint (user commits)**

```bash
git add data/testimonials.ts components/TestimonialsSection.tsx components/TestimonialsSection.test.tsx pages/Home.tsx
git status
```

---

## Task 4: Footer nav + booking CTA

**Files:**
- Modify: `components/Footer.tsx`
- Create: `components/Footer.test.tsx`

**Interfaces:**
- Consumes: `useContact().open(context)`, `react-router-dom` `Link`.

- [ ] **Step 1: Write the failing test `components/Footer.test.tsx`**

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ContactProvider, useContact } from './layout/ContactContext';
import { Footer } from './Footer';

function Probe() {
  const { isOpen, context } = useContact();
  return <div data-testid="probe">{isOpen ? 'open' : 'closed'}|{context ?? ''}</div>;
}

function renderFooter() {
  return render(
    <ContactProvider>
      <MemoryRouter>
        <Footer onStartConversation={() => {}} />
        <Probe />
      </MemoryRouter>
    </ContactProvider>,
  );
}

describe('Footer', () => {
  it('renders page + legal nav links', () => {
    renderFooter();
    expect(screen.getByRole('link', { name: 'Engagement' })).toHaveAttribute('href', '/engagement');
    expect(screen.getByRole('link', { name: 'Privacy' })).toHaveAttribute('href', '/privacy');
    expect(screen.getByRole('link', { name: 'Work' })).toHaveAttribute('href', '/work');
  });
  it('"Book a discovery call" opens the contact modal tagged Discovery call', () => {
    renderFooter();
    fireEvent.click(screen.getByRole('button', { name: /book a discovery call/i }));
    expect(screen.getByTestId('probe')).toHaveTextContent('open|Discovery call');
  });
});
```

- [ ] **Step 2: Run it to confirm failure**

Run: `yarn test components/Footer.test.tsx`
Expected: FAIL — no Engagement/Privacy links + no booking button yet.

- [ ] **Step 3: Replace `components/Footer.tsx` with the version that adds nav rows + booking CTA**

```tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Instagram, Linkedin } from 'lucide-react';
import { useContact } from './layout/ContactContext';

interface FooterProps {
  onStartConversation: () => void;
}

const PAGE_LINKS = [
  { to: '/work', label: 'Work' },
  { to: '/products', label: 'Products' },
  { to: '/infra', label: 'AI Infra' },
  { to: '/team', label: 'Team' },
  { to: '/blog', label: 'Blog' },
  { to: '/research', label: 'Research' },
  { to: '/engagement', label: 'Engagement' },
];

const LEGAL_LINKS = [
  { to: '/privacy', label: 'Privacy' },
  { to: '/terms', label: 'Terms' },
  { to: '/cookies', label: 'Cookies' },
  { to: '/gdpr', label: 'GDPR' },
];

export const Footer: React.FC<FooterProps> = ({ onStartConversation }) => {
  const { open } = useContact();

  return (
    <section className="relative min-h-[70vh] sm:min-h-[75vh] md:h-[80vh] flex items-center justify-center overflow-hidden py-8 sm:py-12 md:py-0">
      {/* Parallax Background Image */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('https://picsum.photos/1920/1080?grayscale&blur=2')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: typeof window !== 'undefined' && window.innerWidth > 768 ? 'fixed' : 'scroll',
        }}
      >
        <div className="absolute inset-0 bg-slate-900/60" />
      </div>

      {/* Floating Footer Card */}
      <div className="container mx-auto px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10 2xl:px-12 relative z-10 w-full max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="bg-white/10 backdrop-blur-md border border-white/20 p-6 sm:p-8 md:p-12 lg:p-16 xl:p-20 rounded-xl sm:rounded-2xl text-center shadow-2xl"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-semibold text-white mb-4 sm:mb-5 md:mb-6 px-2 tracking-tight leading-tight">Let's Build Something Solid.</h2>
          <p className="text-base sm:text-lg md:text-lg lg:text-xl text-blue-100 font-light mb-8 sm:mb-10 md:mb-12 max-w-2xl mx-auto px-2 leading-relaxed">
            Tell us what you're building. We'll tell you how we'd approach it.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <motion.button
              onClick={onStartConversation}
              className="inline-flex items-center gap-2 sm:gap-3 md:gap-4 bg-brand-blue text-white px-6 sm:px-7 md:px-8 py-3 sm:py-3.5 md:py-4 rounded-full font-medium text-sm sm:text-base md:text-lg hover:bg-blue-600 active:bg-blue-700 transition-all duration-300 group shadow-lg shadow-blue-900/50 touch-manipulation"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Start a Conversation
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>
            <button
              onClick={() => open('Discovery call')}
              className="inline-flex items-center gap-2 bg-white/10 border border-white/30 text-white px-6 py-3 sm:py-3.5 md:py-4 rounded-full font-medium text-sm sm:text-base md:text-lg hover:bg-white/20 transition-colors touch-manipulation"
            >
              Book a discovery call
            </button>
          </div>

          {/* Nav links */}
          <nav className="mt-10 sm:mt-12 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            {PAGE_LINKS.map((l) => (
              <Link key={l.to} to={l.to} className="text-blue-100 hover:text-white text-sm transition-colors">{l.label}</Link>
            ))}
          </nav>
          <nav className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            {LEGAL_LINKS.map((l) => (
              <Link key={l.to} to={l.to} className="text-blue-200/80 hover:text-white text-xs transition-colors">{l.label}</Link>
            ))}
          </nav>

          <div className="mt-8 sm:mt-10 flex flex-col md:flex-row items-center justify-between border-t border-white/10 pt-6 sm:pt-7 md:pt-8 gap-4 sm:gap-5 md:gap-6">
            <div className="text-blue-200 text-xs sm:text-sm text-center md:text-left">
              &copy; {new Date().getFullYear()} Basic Tech. All rights reserved.
            </div>
            <div className="flex gap-4 sm:gap-5 md:gap-6">
              <SocialLink icon={Instagram} href="https://www.instagram.com/basictech01/" />
              <SocialLink icon={Linkedin} href="https://www.linkedin.com/company/basictech01/posts/?feedView=all" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const SocialLink: React.FC<{ icon: any, href: string }> = ({ icon: Icon, href }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-200 hover:text-white active:text-blue-300 transition-colors p-2 sm:p-2.5 rounded-full hover:bg-white/10 active:bg-white/20 touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center">
    <Icon className="w-5 h-5 sm:w-5 sm:h-5" />
  </a>
);
```

- [ ] **Step 4: Run it to confirm pass**

Run: `yarn test components/Footer.test.tsx`
Expected: PASS — both tests pass.

- [ ] **Step 5: Full suite + build (home parity)**

Run: `yarn test` then `yarn build`
Expected: full suite green; build prerenders ~23 pages; the footer (on every page) now shows the page + legal links + the booking button; the existing "Start a Conversation" CTA and home layout are otherwise unchanged.

- [ ] **Step 6: Checkpoint (user commits)**

```bash
git add components/Footer.tsx components/Footer.test.tsx
git status
```

---

## Final Verification

- [ ] **Full build + test sweep**

Run: `yarn test && yarn build && yarn preview`
Expected:
- Full suite green, output pristine.
- `/engagement`, `/gdpr`, `/privacy`, `/terms`, `/cookies` all prerender; legal MDX bodies present in static HTML; one `<title>`/canonical each; ~23 pages total.
- `/engagement` shows the models + results strip; "Book a discovery call" (engagement + footer) opens the modal tagged "Discovery call".
- Home shows the testimonials section; footer shows page + legal links on every page.
- Each legal page shows its "Draft — pending legal review" note; `index.html` untouched; no duplicate head tags.

---

## Self-Review Notes (author)

- **Spec coverage:** `/engagement` → Task 1; legal pages + `ContentPage` → Task 2; testimonials → Task 3; footer nav + booking → Task 4; booking = `open('Discovery call')` (Tasks 1 & 4); SEO/prerender → build-verify steps. Top nav intentionally unchanged (spec §3.5). All spec §4 sections map to a task.
- **No new deps:** booking reuses `useContact`; legal reuses the M3 MDX pipeline (`loadCollection`/`getEntry`/`Prose`) + `formatDate`.
- **No-commit:** every "Commit" reframed as "Checkpoint (user commits)".
- **Type/name consistency:** `EngagementModel`/`ENGAGEMENT_MODELS`, `Result`/`RESULTS`, `Testimonial`/`TESTIMONIALS`, `LEGAL`/`ContentPage` defined once and consumed consistently; `ContentPage` slug prop matches the route `element` usage; `open('Discovery call')` tag string identical across engagement + footer + tests.
- **Legal discipline:** every legal MDX opens with the "Draft — pending legal review" blockquote; copy is template-only (spec §7).
- **Placeholder discipline:** `TODO:` only in data files (`results.ts`, `testimonials.ts`) and the legal template bodies; the engagement-model copy is real conceptual content.
