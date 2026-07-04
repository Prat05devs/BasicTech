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
