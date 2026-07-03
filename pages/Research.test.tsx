import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Research from './Research';
import { PAPERS } from '../data/papers';
import { RESEARCH_ARTICLES } from '../data/researchArticles';

describe('Research', () => {
  it('renders papers and articles sections', () => {
    render(<MemoryRouter><Research /></MemoryRouter>);
    const papers = screen.getByTestId('papers-list');
    const articles = screen.getByTestId('articles-list');
    expect(within(papers).getAllByRole('link').length).toBe(PAPERS.length);
    expect(within(articles).getAllByRole('link').length).toBe(RESEARCH_ARTICLES.length);
    expect(within(articles).getByText('A sample research write-up')).toBeInTheDocument();
  });
});
