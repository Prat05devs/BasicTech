# Phase 2 — Products & AI Infra Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a pre-launch `/products` catalog and a flagship `/infra` (AI inference layer) page, with early-access CTAs that reuse the existing `ContactModal` (tagged with a lead source), plus the nav links and a mobile menu to reach them.

**Architecture:** Reuse the Milestone 1 foundation — vite-react-ssg static prerendering (static named routes auto-discovered), `components/Seo.tsx`, `components/layout/ContactContext.tsx` (`ContactProvider`/`useContact`), `components/ui/Reveal.tsx`, brand tokens. Two new prerendered routes are data-driven from typed files. The `ContactContext.open()` is extended to carry an optional lead-source string that flows into the `ContactModal` submission, with NO new backend.

**Tech Stack:** React 19, TypeScript ~5.8, Vite 6, react-router-dom 6.30, vite-react-ssg 0.8.9, framer-motion, lucide-react, Tailwind v3 (PostCSS). Tests: Vitest + React Testing Library. Package manager: **yarn**.

## Global Constraints

- **Package manager is yarn.** Use `yarn test`, `yarn build`, `yarn dev`. NEVER run npm or generate a `package-lock.json`.
- **DO NOT run `git commit`.** No-commit mode. Each "Checkpoint" step means: `git add -A` to STAGE the work, run the verification, then STOP and report — the human commits. Use `git rm` only where a task explicitly deletes a file.
- **Files live at the repo ROOT** (`pages/`, `components/`, `data/`, `routes.tsx`), not under `src/`.
- **Brand tokens exact:** `brand.blue #2F80ED`, `brand.dark #0f172a`, font Inter. Reuse the existing design system (`Reveal`, the `container mx-auto px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10 2xl:px-12` width pattern, tech-pill/badge styling, grayscale→color hover). No new visual language.
- **Prerender:** static named routes (`/products`, `/infra`) are auto-discovered by vite-react-ssg — no `vite.config.ts ssgOptions.includedRoutes` change is needed (confirmed in M1). After this phase the build prerenders **13 pages**.
- **SEO:** each new route must prerender its own single `<title>`/description/canonical + JSON-LD. `index.html` no longer carries per-page tags (fixed in M1) — do not re-add any.
- **Backwards compatibility (critical):** existing CTAs call `open` as `onClick={open}` / `onStartProject={open}` / `onStartConversation={open}`, so React passes a **MouseEvent** as the first argument. `open(context?)` MUST ignore non-string arguments (runtime `typeof === 'string'` guard) so those call sites keep working and never submit an event object as the lead source. Existing `open()` behavior (untagged) must be unchanged.
- **Naming:** Work projects stay `PROJECTS` (`constants.ts`/`lib/projects.ts`); these new products are `PRODUCTS` (`data/products.ts`) — distinct domains.

---

## File Structure

**New files**
- `data/products.ts` — `Product` type, `ProductStatus`, `PRODUCTS` (placeholder data), `STATUS_LABELS`, `STATUS_STYLES`.
- `data/infra.ts` — `INFRA_VALUES`, `INFRA_CAPABILITIES`, `INFRA_PRINCIPLES` arrays + their item types.
- `components/products/ProductCard.tsx` — one product card (status badge + "Notify me" CTA).
- `pages/Products.tsx` — `/products` catalog page.
- `pages/Infra.tsx` — `/infra` flagship page (with small local presentational subcomponents).
- `pages/Products.test.tsx`, `pages/Infra.test.tsx`, `components/layout/Nav.test.tsx`.

**Modified files**
- `components/layout/ContactContext.tsx` — `open(context?: string)` + `context` in the context value (with non-string guard).
- `components/layout/ContactContext.test.tsx` — cover the new `context` behavior.
- `components/ContactModal.tsx` — optional `context?: string` prop → submission `source` field + a subject badge.
- `components/layout/Layout.tsx` — `Shell` passes `context` to `ContactModal`; `Nav` is exported, gains Products + AI Infra links and a mobile menu.
- `routes.tsx` — register `/products` and `/infra`.

---

## Task 1: Lead-capture extension (ContactContext + ContactModal + Layout)

Extend the contact flow so any CTA can tag the lead source, without breaking existing untagged callers.

**Files:**
- Modify: `components/layout/ContactContext.tsx`, `components/layout/ContactContext.test.tsx`, `components/ContactModal.tsx`, `components/layout/Layout.tsx`

**Interfaces:**
- Produces: `useContact()` now returns `{ isOpen: boolean; context?: string; open: (context?: string) => void; close: () => void }`. `open('X')` sets `context='X'`; `open()` or `open(<non-string>)` sets `context=undefined`; `close()` clears it. `ContactModal` accepts an optional `context?: string`.

- [ ] **Step 1: Update the failing tests for the new context behavior**

Replace the body of `components/layout/ContactContext.test.tsx` with (keeps the original two tests, adds three):

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ContactProvider, useContact } from './ContactContext'

function Probe() {
  const { isOpen, context, open, close } = useContact()
  return (
    <div>
      <span data-testid="state">{isOpen ? 'open' : 'closed'}</span>
      <span data-testid="context">{context ?? 'none'}</span>
      <button onClick={() => open()}>open-plain</button>
      <button onClick={() => open('AI Infra — Early Access')}>open-tagged</button>
      <button onClick={(e) => open(e as unknown as string)}>open-event</button>
      <button onClick={close}>close</button>
    </div>
  )
}

describe('ContactContext', () => {
  it('starts closed with no context and toggles open/close', () => {
    render(<ContactProvider><Probe /></ContactProvider>)
    expect(screen.getByTestId('state')).toHaveTextContent('closed')
    expect(screen.getByTestId('context')).toHaveTextContent('none')
    fireEvent.click(screen.getByText('open-plain'))
    expect(screen.getByTestId('state')).toHaveTextContent('open')
    expect(screen.getByTestId('context')).toHaveTextContent('none')
    fireEvent.click(screen.getByText('close'))
    expect(screen.getByTestId('state')).toHaveTextContent('closed')
  })

  it('open(context) stores the lead source and close clears it', () => {
    render(<ContactProvider><Probe /></ContactProvider>)
    fireEvent.click(screen.getByText('open-tagged'))
    expect(screen.getByTestId('state')).toHaveTextContent('open')
    expect(screen.getByTestId('context')).toHaveTextContent('AI Infra — Early Access')
    fireEvent.click(screen.getByText('close'))
    expect(screen.getByTestId('context')).toHaveTextContent('none')
  })

  it('ignores a non-string argument (e.g. a click event passed by onClick={open})', () => {
    render(<ContactProvider><Probe /></ContactProvider>)
    fireEvent.click(screen.getByText('open-event'))
    expect(screen.getByTestId('state')).toHaveTextContent('open')
    expect(screen.getByTestId('context')).toHaveTextContent('none')
  })

  it('throws when used outside the provider', () => {
    expect(() => render(<Probe />)).toThrow(/useContact must be used within a ContactProvider/)
  })
})
```

- [ ] **Step 2: Run the tests to confirm they fail**

Run: `yarn test components/layout/ContactContext.test.tsx`
Expected: FAIL — `context` is undefined in the value / `open` ignores its arg (the `data-testid="context"` and tagged assertions fail).

- [ ] **Step 3: Implement the extended `components/layout/ContactContext.tsx`**

```tsx
import React, { createContext, useContext, useState, useCallback } from 'react';

interface ContactState {
  isOpen: boolean;
  context?: string;
  open: (context?: string) => void;
  close: () => void;
}

const ContactCtx = createContext<ContactState | null>(null);

export const ContactProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [context, setContext] = useState<string | undefined>(undefined);

  // Guard: existing callers use `onClick={open}`, which passes a MouseEvent.
  // Only a real string is treated as a lead-source tag.
  const open = useCallback((ctx?: string) => {
    setContext(typeof ctx === 'string' ? ctx : undefined);
    setIsOpen(true);
  }, []);
  const close = useCallback(() => {
    setIsOpen(false);
    setContext(undefined);
  }, []);

  return (
    <ContactCtx.Provider value={{ isOpen, context, open, close }}>
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

- [ ] **Step 4: Run the tests to confirm they pass**

Run: `yarn test components/layout/ContactContext.test.tsx`
Expected: PASS — all 4 tests pass.

- [ ] **Step 5: Add the `context` prop to `components/ContactModal.tsx`**

Three edits:

(a) Props interface + signature (lines 7–12):
```tsx
interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  context?: string;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose, context }) => {
```

(b) In `handleSubmit`, add a `source` field to the formspree request body (the object passed to `JSON.stringify`, currently ending `message: formData.message,`):
```tsx
        body: JSON.stringify({
          inquiryType: selectedInquiryType?.label || "Not specified",
          name: formData.name,
          email: formData.email,
          phone: `${selectedCountry.dialCode}${formData.phone}`,
          country: selectedCountry.name,
          message: formData.message,
          source: context || "Direct",
        }),
```

(c) Render a subject badge when `context` is set — insert it immediately after the intro paragraph (the `<p>...within 24 hours.</p>` at line 362) and before `<form ...>`:
```tsx
                        {context && (
                          <div className="mb-5 inline-flex items-center gap-2 bg-blue-50 border border-brand-blue/20 text-brand-blue text-xs font-medium px-3 py-1.5 rounded-full">
                            {context}
                          </div>
                        )}
```

- [ ] **Step 6: Pass `context` through `components/layout/Layout.tsx`**

In the `Shell` component, the line `const { isOpen, open, close } = useContact();` becomes:
```tsx
  const { isOpen, open, close, context } = useContact();
```
And the modal render becomes:
```tsx
      <ContactModal isOpen={isOpen} onClose={close} context={context} />
```

- [ ] **Step 7: Verify build + full suite (no regression to existing CTAs)**

Run: `yarn test` then `yarn build`
Expected: all tests pass (incl. the 4 ContactContext tests); `yarn build` succeeds and still prerenders 11 pages. Manually reason: nav Contact button, Hero, Footer, and WorkDetail CTA still call `open` (now ignoring the event) → modal opens with no badge, exactly as before.

- [ ] **Step 8: Checkpoint (user commits)**

```bash
git add components/layout/ContactContext.tsx components/layout/ContactContext.test.tsx components/ContactModal.tsx components/layout/Layout.tsx
git status
```

---

## Task 2: Products page (`/products`)

A pre-launch catalog: data file + card + page + route.

**Files:**
- Create: `data/products.ts`, `components/products/ProductCard.tsx`, `pages/Products.tsx`, `pages/Products.test.tsx`
- Modify: `routes.tsx`

**Interfaces:**
- Consumes: `useContact().open(context)` (Task 1), `Seo`, `Reveal`.
- Produces: `Product`/`ProductStatus` types, `PRODUCTS`, `STATUS_LABELS`, `STATUS_STYLES` (from `data/products.ts`); `ProductCard: React.FC<{ product: Product }>`; `Products` (default export of `pages/Products.tsx`).

- [ ] **Step 1: Create `data/products.ts`**

```ts
export type ProductStatus = 'building' | 'beta' | 'coming-soon' | 'live';

export interface Product {
  slug: string;
  name: string;
  tagline: string;       // one-line value proposition
  description: string;
  status: ProductStatus;
  category: string;      // e.g. 'AI', 'DevTools', 'Productivity'
  cover?: string;
  url?: string;          // present when beta/live
}

export const STATUS_LABELS: Record<ProductStatus, string> = {
  building: 'In Development',
  beta: 'Beta',
  'coming-soon': 'Coming Soon',
  live: 'Live',
};

export const STATUS_STYLES: Record<ProductStatus, string> = {
  building: 'bg-amber-50 text-amber-700 border-amber-200',
  beta: 'bg-blue-50 text-brand-blue border-brand-blue/20',
  'coming-soon': 'bg-slate-100 text-slate-600 border-slate-200',
  live: 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

// Placeholder catalog — TODO: replace with real products, taglines, and statuses.
export const PRODUCTS: Product[] = [
  {
    slug: 'product-one',
    name: 'TODO: Product One',
    tagline: 'TODO: one-line value proposition for product one.',
    description: 'TODO: what it does, who it is for, and why it matters.',
    status: 'building',
    category: 'AI',
  },
  {
    slug: 'product-two',
    name: 'TODO: Product Two',
    tagline: 'TODO: one-line value proposition for product two.',
    description: 'TODO: what it does, who it is for, and why it matters.',
    status: 'coming-soon',
    category: 'DevTools',
  },
  {
    slug: 'product-three',
    name: 'TODO: Product Three',
    tagline: 'TODO: one-line value proposition for product three.',
    description: 'TODO: what it does, who it is for, and why it matters.',
    status: 'beta',
    category: 'Productivity',
  },
];
```

- [ ] **Step 2: Create `components/products/ProductCard.tsx`**

```tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Product, STATUS_LABELS, STATUS_STYLES } from '../../data/products';
import { useContact } from '../layout/ContactContext';

export const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const { open } = useContact();
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6 }}
      className="flex flex-col h-full border border-slate-200 rounded-lg p-6 bg-white hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-brand-blue font-mono text-[10px] tracking-wider uppercase">{product.category}</span>
        <span className={`text-[10px] font-medium uppercase tracking-wide px-2 py-1 rounded-full border ${STATUS_STYLES[product.status]}`}>
          {STATUS_LABELS[product.status]}
        </span>
      </div>
      <h3 className="text-xl font-semibold text-slate-900 tracking-tight mb-2">{product.name}</h3>
      <p className="text-sm text-brand-blue/90 font-medium mb-3">{product.tagline}</p>
      <p className="text-sm text-slate-600 font-light leading-relaxed mb-6 flex-1">{product.description}</p>
      <div className="flex flex-wrap gap-3 mt-auto">
        <button
          onClick={() => open(`Product waitlist: ${product.name}`)}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 px-4 py-2 rounded-full transition-colors"
        >
          Notify me
        </button>
        {product.url && (
          <a
            href={product.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-blue hover:text-blue-700 px-4 py-2 border border-brand-blue/30 hover:border-brand-blue rounded-full transition-colors"
          >
            Visit
          </a>
        )}
      </div>
    </motion.div>
  );
};
```

- [ ] **Step 3: Write the failing test `pages/Products.test.tsx`**

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { ContactProvider, useContact } from '../components/layout/ContactContext'
import Products from './Products'
import { PRODUCTS } from '../data/products'

function Probe() {
  const { isOpen, context } = useContact()
  return <div data-testid="probe">{isOpen ? 'open' : 'closed'}|{context ?? ''}</div>
}

function renderPage() {
  return render(
    <ContactProvider>
      <MemoryRouter>
        <Products />
        <Probe />
      </MemoryRouter>
    </ContactProvider>,
  )
}

describe('Products', () => {
  it('renders a card per product with status badges', () => {
    renderPage()
    const grid = screen.getByTestId('product-grid')
    expect(within(grid).getAllByRole('heading', { level: 3 }).length).toBe(PRODUCTS.length)
    expect(within(grid).getAllByText('In Development').length).toBeGreaterThan(0)
  })

  it('"Notify me" opens the contact modal tagged with the product name', () => {
    renderPage()
    const grid = screen.getByTestId('product-grid')
    fireEvent.click(within(grid).getAllByRole('button', { name: 'Notify me' })[0])
    expect(screen.getByTestId('probe')).toHaveTextContent(`open|Product waitlist: ${PRODUCTS[0].name}`)
  })
})
```

- [ ] **Step 4: Run the test to confirm it fails**

Run: `yarn test pages/Products.test.tsx`
Expected: FAIL — cannot resolve `./Products`.

- [ ] **Step 5: Implement `pages/Products.tsx`**

```tsx
import React from 'react';
import { PRODUCTS } from '../data/products';
import { ProductCard } from '../components/products/ProductCard';
import { Seo } from '../components/Seo';
import { Reveal } from '../components/ui/Reveal';

const Products: React.FC = () => (
  <section className="pt-32 pb-24 bg-white min-h-screen">
    <Seo
      title="Products | Basic Tech"
      description="The micro-SaaS products Basic Tech is building — an AI-first studio shipping its own software."
      canonical="https://basictech.in/products"
      jsonLd={{
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Basic Tech — Products',
        url: 'https://basictech.in/products',
      }}
    />
    <div className="container mx-auto px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10 2xl:px-12">
      <Reveal>
        <p className="text-xs sm:text-sm font-semibold tracking-widest text-slate-400 uppercase mb-4">Products</p>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-slate-900 tracking-tight mb-4 max-w-2xl">
          The products we’re building.
        </h1>
        <p className="text-base sm:text-lg text-slate-600 font-light mb-12 max-w-2xl">
          We don’t just build software for clients — we build our own. Here’s what’s in the works.
        </p>
      </Reveal>

      <div data-testid="product-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {PRODUCTS.map(p => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>
    </div>
  </section>
);

export default Products;
```

- [ ] **Step 6: Run the test to confirm it passes**

Run: `yarn test pages/Products.test.tsx`
Expected: PASS — both tests pass.

- [ ] **Step 7: Register the `/products` route**

In `routes.tsx`, add the import and the child route BEFORE `{ path: '*', ... }`:
```tsx
import Products from './pages/Products';
```
```tsx
  { path: 'products', Component: Products },
```

- [ ] **Step 8: Build-verify the route prerenders**

Run: `yarn build`
Expected: build succeeds; `dist/products.html` exists and contains the page text and exactly one canonical:
```bash
test -e dist/products.html && echo "products route ok"
grep -c '<title' dist/products.html        # expect 1
grep -o 'rel="canonical" href="[^"]*"' dist/products.html   # expect https://basictech.in/products
```

- [ ] **Step 9: Checkpoint (user commits)**

```bash
git add data/products.ts components/products/ProductCard.tsx pages/Products.tsx pages/Products.test.tsx routes.tsx
git status
```

---

## Task 3: AI Infra page (`/infra`)

The flagship page: content data + page (with small local subcomponents) + route.

**Files:**
- Create: `data/infra.ts`, `pages/Infra.tsx`, `pages/Infra.test.tsx`
- Modify: `routes.tsx`

**Interfaces:**
- Consumes: `useContact().open(context)` (Task 1), `Seo`, `Reveal`.
- Produces: `INFRA_VALUES`, `INFRA_CAPABILITIES`, `INFRA_PRINCIPLES` (from `data/infra.ts`); `Infra` (default export of `pages/Infra.tsx`).

- [ ] **Step 1: Create `data/infra.ts`**

```ts
export interface InfraItem {
  title: string;
  body: string;
}

// Why we run our own inference layer. Conceptual value props (real copy).
export const INFRA_VALUES: InfraItem[] = [
  {
    title: 'Control & reliability',
    body: 'Owning the inference path means no surprise rate limits, deprecations, or outages dictated by a third party. We tune the stack end to end for the workloads we ship.',
  },
  {
    title: 'Cost efficiency at scale',
    body: 'Running our own infra lets us drive down per-request cost as volume grows, instead of paying a margin on every token to an external provider.',
  },
  {
    title: 'Data privacy & residency',
    body: 'Customer data stays within infrastructure we control, with clear residency boundaries — a direct answer to the data-handling questions European and US clients ask first.',
  },
  {
    title: 'No vendor lock-in',
    body: 'A portable, model-agnostic layer keeps us free to adopt the best models as the field moves, without rewrites or contractual handcuffs.',
  },
];

// What the layer offers. TODO: replace with concrete, real capabilities/specs.
export const INFRA_CAPABILITIES: InfraItem[] = [
  { title: 'TODO: Dedicated inference endpoints', body: 'TODO: describe the serving capability, supported model families, and throughput.' },
  { title: 'TODO: Workload-tuned hardware', body: 'TODO: describe the hardware/orchestration story.' },
  { title: 'TODO: Observability & guardrails', body: 'TODO: describe monitoring, evals, and safety controls.' },
];

// Short, honest principles — signal seriousness without overclaiming.
export const INFRA_PRINCIPLES: string[] = [
  'Own the critical path; rent only what is genuinely commodity.',
  'Privacy and residency are defaults, not add-ons.',
  'Portability over lock-in — models are swappable, the platform is ours.',
];
```

- [ ] **Step 2: Write the failing test `pages/Infra.test.tsx`**

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { ContactProvider, useContact } from '../components/layout/ContactContext'
import Infra from './Infra'
import { INFRA_VALUES } from '../data/infra'

function Probe() {
  const { isOpen, context } = useContact()
  return <div data-testid="probe">{isOpen ? 'open' : 'closed'}|{context ?? ''}</div>
}

function renderPage() {
  return render(
    <ContactProvider>
      <MemoryRouter>
        <Infra />
        <Probe />
      </MemoryRouter>
    </ContactProvider>,
  )
}

describe('Infra', () => {
  it('renders the hero and all value props', () => {
    renderPage()
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
    for (const v of INFRA_VALUES) {
      expect(screen.getByText(v.title)).toBeInTheDocument()
    }
  })

  it('"Get early access" opens the contact modal tagged for AI Infra', () => {
    renderPage()
    fireEvent.click(screen.getAllByRole('button', { name: /get early access/i })[0])
    expect(screen.getByTestId('probe')).toHaveTextContent('open|AI Infra — Early Access')
  })
})
```

- [ ] **Step 3: Run the test to confirm it fails**

Run: `yarn test pages/Infra.test.tsx`
Expected: FAIL — cannot resolve `./Infra`.

- [ ] **Step 4: Implement `pages/Infra.tsx`**

```tsx
import React from 'react';
import { useContact } from '../components/layout/ContactContext';
import { INFRA_VALUES, INFRA_CAPABILITIES, INFRA_PRINCIPLES, InfraItem } from '../data/infra';
import { Seo } from '../components/Seo';
import { Reveal } from '../components/ui/Reveal';

const Infra: React.FC = () => {
  const { open } = useContact();
  const getAccess = () => open('AI Infra — Early Access');

  return (
    <article className="bg-white">
      <Seo
        title="AI Inference Infrastructure | Basic Tech"
        description="Basic Tech runs its own AI inference layer — control, cost efficiency, data residency, and no vendor lock-in. Join the early-access list."
        canonical="https://basictech.in/infra"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: 'Basic Tech AI Inference Layer',
          serviceType: 'AI inference infrastructure',
          provider: { '@type': 'Organization', name: 'Basic Tech' },
          url: 'https://basictech.in/infra',
        }}
      />

      {/* Hero */}
      <section className="pt-32 pb-20 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10 2xl:px-12 max-w-4xl">
          <Reveal>
            <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wide bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1 rounded-full mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> In development
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold text-slate-900 tracking-tight leading-tight mb-6">
              We run our own<br />AI inference layer.
            </h1>
            <p className="text-lg text-slate-600 font-light leading-relaxed max-w-2xl mb-8">
              Basic Tech is an AI-first studio — so we’re building the infrastructure to match. Our own inference layer means control, cost efficiency, and data residency we can stand behind.
            </p>
            <button onClick={getAccess} className="bg-slate-900 text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-slate-800 transition-colors shadow-lg">
              Get early access
            </button>
          </Reveal>
        </div>
      </section>

      {/* Why own the stack */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10 2xl:px-12">
          <Reveal>
            <h2 className="text-xs sm:text-sm font-semibold tracking-widest text-slate-400 uppercase mb-12">Why we own the stack</h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
            {INFRA_VALUES.map((v) => <Item key={v.title} item={v} />)}
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10 2xl:px-12">
          <Reveal>
            <h2 className="text-xs sm:text-sm font-semibold tracking-widest text-slate-400 uppercase mb-12">Capabilities</h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {INFRA_CAPABILITIES.map((c) => (
              <div key={c.title} className="border border-slate-200 rounded-lg p-6 bg-white">
                <h3 className="text-lg font-semibold text-slate-900 tracking-tight mb-2">{c.title}</h3>
                <p className="text-sm text-slate-600 font-light leading-relaxed">{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10 2xl:px-12 max-w-3xl">
          <Reveal>
            <h2 className="text-xs sm:text-sm font-semibold tracking-widest text-slate-400 uppercase mb-8">Principles</h2>
          </Reveal>
          <ul className="space-y-4">
            {INFRA_PRINCIPLES.map((p, i) => (
              <li key={i} className="flex gap-3 text-lg text-slate-700 font-light leading-relaxed">
                <span className="w-2 h-2 rounded-full bg-brand-blue mt-2.5 flex-shrink-0" />
                {p}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-slate-900">
        <div className="container mx-auto px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10 2xl:px-12 text-center max-w-2xl">
          <h2 className="text-3xl sm:text-4xl font-semibold text-white tracking-tight mb-4">Want in early?</h2>
          <p className="text-slate-300 font-light mb-8">We’re onboarding a small group of early-access partners. Tell us about your workload.</p>
          <button onClick={getAccess} className="bg-white text-slate-900 px-6 py-3 rounded-full text-sm font-medium hover:bg-slate-100 transition-colors shadow-lg">
            Get early access
          </button>
        </div>
      </section>
    </article>
  );
};

const Item: React.FC<{ item: InfraItem }> = ({ item }) => (
  <div>
    <div className="w-3 h-3 bg-brand-blue rounded-full mb-4" />
    <h3 className="text-xl font-semibold text-slate-900 tracking-tight mb-2">{item.title}</h3>
    <p className="text-base text-slate-600 font-light leading-relaxed">{item.body}</p>
  </div>
);

export default Infra;
```

- [ ] **Step 5: Run the test to confirm it passes**

Run: `yarn test pages/Infra.test.tsx`
Expected: PASS — both tests pass.

- [ ] **Step 6: Register the `/infra` route**

In `routes.tsx`, add the import and the child route BEFORE `{ path: '*', ... }` (after `products`):
```tsx
import Infra from './pages/Infra';
```
```tsx
  { path: 'infra', Component: Infra },
```

- [ ] **Step 7: Build-verify the route prerenders**

Run: `yarn build`
Expected: build succeeds; `dist/infra.html` exists with the hero text and exactly one canonical:
```bash
test -e dist/infra.html && echo "infra route ok"
grep -c '<title' dist/infra.html      # expect 1
grep -o 'rel="canonical" href="[^"]*"' dist/infra.html   # expect https://basictech.in/infra
```

- [ ] **Step 8: Checkpoint (user commits)**

```bash
git add data/infra.ts pages/Infra.tsx pages/Infra.test.tsx routes.tsx
git status
```

---

## Task 4: Nav links + mobile menu

Surface the new pages in the nav and add a mobile menu (the nav currently has no mobile access).

**Files:**
- Modify: `components/layout/Layout.tsx`
- Create: `components/layout/Nav.test.tsx`

**Interfaces:**
- Consumes: `useContact().open`, `react-router-dom` `Link`/`useLocation`, `lucide-react` `Menu`/`X`.
- Produces: `Nav` is exported from `Layout.tsx` (named export) so it can be tested; it renders Work/Products/AI Infra links + Contact, and a mobile menu panel toggled by a hamburger.

- [ ] **Step 1: Write the failing test `components/layout/Nav.test.tsx`**

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { ContactProvider } from './ContactContext'
import { Nav } from './Layout'

function renderNav() {
  return render(
    <ContactProvider>
      <MemoryRouter>
        <Nav />
      </MemoryRouter>
    </ContactProvider>,
  )
}

describe('Nav', () => {
  it('renders Work, Products, and AI Infra links', () => {
    renderNav()
    // Desktop links are always in the DOM (visibility is CSS-only).
    expect(screen.getAllByRole('link', { name: 'Work' }).length).toBeGreaterThan(0)
    expect(screen.getAllByRole('link', { name: 'Products' }).length).toBeGreaterThan(0)
    expect(screen.getAllByRole('link', { name: 'AI Infra' }).length).toBeGreaterThan(0)
  })

  it('toggles the mobile menu panel', () => {
    renderNav()
    expect(screen.queryByTestId('mobile-menu')).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /open menu/i }))
    const panel = screen.getByTestId('mobile-menu')
    expect(within(panel).getByRole('link', { name: 'Products' })).toBeInTheDocument()
    // Closes when a link in the panel is clicked.
    fireEvent.click(within(panel).getByRole('link', { name: 'AI Infra' }))
    expect(screen.queryByTestId('mobile-menu')).not.toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run the test to confirm it fails**

Run: `yarn test components/layout/Nav.test.tsx`
Expected: FAIL — `Nav` is not exported from `./Layout` (and Products/AI Infra links + mobile menu don't exist yet).

- [ ] **Step 3: Replace the `Nav` component in `components/layout/Layout.tsx`**

Add `Menu, X` to the existing `lucide-react` import (or add the import if none), add `useState` to the React import, and replace the existing `Nav` component definition with this exported version. Leave `Shell` and `Layout` as they are (Shell already renders `<Nav />`).

```tsx
const NAV_LINKS = [
  { to: '/work', label: 'Work' },
  { to: '/products', label: 'Products' },
  { to: '/infra', label: 'AI Infra' },
];

export const Nav: React.FC = () => {
  const { open } = useContact();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  // Close the mobile menu whenever the route changes.
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

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

        {/* Desktop links */}
        <div className="hidden sm:flex items-center gap-6 pointer-events-auto">
          {NAV_LINKS.map((l) => (
            <Link key={l.to} to={l.to} className="text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors">
              {l.label}
            </Link>
          ))}
          <button
            onClick={() => open()}
            className="bg-slate-900 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-slate-800 transition-colors shadow-lg hover:shadow-xl hover:-translate-y-0.5 transform duration-300"
          >
            Contact
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          className="sm:hidden pointer-events-auto p-2 -mr-2 text-slate-800"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile panel */}
      {menuOpen && (
        <div data-testid="mobile-menu" className="sm:hidden relative z-10 pointer-events-auto bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-1">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setMenuOpen(false)}
                className="py-3 text-base font-medium text-slate-800 hover:text-brand-blue transition-colors border-b border-slate-100 last:border-0"
              >
                {l.label}
              </Link>
            ))}
            <button
              onClick={() => { setMenuOpen(false); open(); }}
              className="mt-3 bg-slate-900 text-white px-5 py-3 rounded-full text-sm font-medium hover:bg-slate-800 transition-colors text-center"
            >
              Contact
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};
```

Ensure the file's imports include: `import React, { useEffect, useRef, useState } from 'react';`, `import { Outlet, Link, useLocation } from 'react-router-dom';`, and `import { Menu, X } from 'lucide-react';` (merge with existing imports; `useEffect`/`useRef`/`Outlet`/`useLocation` are already used by `Shell`).

- [ ] **Step 4: Run the test to confirm it passes**

Run: `yarn test components/layout/Nav.test.tsx`
Expected: PASS — both tests pass.

- [ ] **Step 5: Verify full suite + build + home parity**

Run: `yarn test` then `yarn build`
Expected: full suite green; `yarn build` prerenders **13 pages** (`/`, `/work`, 8 slugs, `/products`, `/infra`, `/404`). The home page is unchanged except the nav now shows Work/Products/AI Infra (desktop) and a hamburger (mobile).

- [ ] **Step 6: Checkpoint (user commits)**

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
- Build prerenders 13 pages; `dist/products.html` and `dist/infra.html` each have exactly one `<title>`/description/self-canonical.
- `/products` shows the placeholder catalog with status badges; "Notify me" opens the contact modal showing a "Product waitlist: …" badge.
- `/infra` shows the flagship page; "Get early access" opens the modal showing an "AI Infra — Early Access" badge.
- The contact modal still opens untagged (no badge) from the nav Contact button, Hero, Footer, and WorkDetail CTA (backwards compatibility).
- Nav shows the three links on desktop and a working mobile menu; home page otherwise unchanged.

---

## Self-Review Notes (author)

- **Spec coverage:** routing+nav+mobile menu → Tasks 2,3,4; lead-capture extension → Task 1; `/infra` → Task 3; `/products` → Task 2; SEO/prerender → build-verify steps in Tasks 2–4. Footer intentionally unchanged (spec §4.1). All spec sections map to a task.
- **No-commit:** every "Commit" reframed as "Checkpoint (user commits)".
- **Backwards-compat guard:** Task 1's `typeof ctx === 'string'` guard + its dedicated test cover the `onClick={open}` (event-as-arg) hazard across all existing callers.
- **Type/name consistency:** `Product`/`ProductStatus`/`PRODUCTS`/`STATUS_LABELS`/`STATUS_STYLES` (Task 2) and `INFRA_VALUES`/`INFRA_CAPABILITIES`/`INFRA_PRINCIPLES`/`InfraItem` (Task 3) are defined once and consumed consistently; `useContact().open(context?)` signature is uniform across Tasks 1–4; `Nav` exported in Task 4 matches its test import.
- **Placeholder discipline:** `TODO:` strings appear only inside `data/products.ts`/`data/infra.ts` content (the spec's deliberate structure-first placeholders), never in plan steps.
