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
