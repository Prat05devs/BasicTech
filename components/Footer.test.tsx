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
