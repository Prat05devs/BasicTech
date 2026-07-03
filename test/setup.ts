import '@testing-library/jest-dom'
import { vi } from 'vitest'

// vite-react-ssg's Head uses react-helmet-async which requires HelmetProvider.
// In the jsdom test environment there is no ViteReactSSG wrapper, so we stub
// Head out as a transparent no-op to prevent "Cannot read properties of undefined
// (reading 'add')" errors from react-helmet-async's Dispatcher.
vi.mock('vite-react-ssg', () => ({
  Head: ({ children }: { children?: React.ReactNode }) => children ?? null,
}))

// framer-motion uses IntersectionObserver and ResizeObserver for whileInView/useInView.
// jsdom does not implement these; provide minimal stubs so components render without crashing.
if (typeof IntersectionObserver === 'undefined') {
  class IntersectionObserverStub {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  ;(globalThis as any).IntersectionObserver = IntersectionObserverStub
}

if (typeof ResizeObserver === 'undefined') {
  class ResizeObserverStub {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  ;(globalThis as any).ResizeObserver = ResizeObserverStub
}
