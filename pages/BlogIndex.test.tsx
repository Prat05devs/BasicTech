import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import BlogIndex from './BlogIndex';
import { BLOG } from '../data/blog';

describe('BlogIndex', () => {
  it('renders a card per post linking to its slug', () => {
    render(<MemoryRouter><BlogIndex /></MemoryRouter>);
    const list = screen.getByTestId('post-list');
    expect(within(list).getAllByRole('link').length).toBe(BLOG.length);
    expect(within(list).getByText(/Harness Loops, Agents, and Skills/)).toBeInTheDocument();
    expect(within(list).getByRole('link', { name: /Harness Loops, Agents, and Skills/ })).toHaveAttribute('href', '/blog/harness-loops-agents-skills');
  });
});
