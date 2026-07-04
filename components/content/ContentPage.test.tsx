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
