import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Team from './Team';
import { TEAM } from '../data/team';

describe('Team', () => {
  it('renders a card per team member', () => {
    render(<MemoryRouter><Team /></MemoryRouter>);
    const grid = screen.getByTestId('team-grid');
    expect(within(grid).getAllByRole('heading', { level: 3 }).length).toBe(TEAM.length);
  });
});
