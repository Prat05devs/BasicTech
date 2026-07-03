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
