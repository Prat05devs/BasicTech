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
