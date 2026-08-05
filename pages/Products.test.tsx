import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { ContactProvider, useContact } from '../components/layout/ContactContext'
import Products from './Products'

function Probe() {
  const { isOpen, context } = useContact()
  return <div data-testid="probe">{isOpen ? 'open' : 'closed'}|{context ?? ''}</div>
}

function renderPage() {
  return render(
    <ContactProvider>
      <MemoryRouter>
        <Products />
        <Probe />
      </MemoryRouter>
    </ContactProvider>,
  )
}

describe('Products', () => {
  it('renders the Uniun feature with headline, status, and CTAs', () => {
    renderPage()
    const feature = screen.getByTestId('uniun-feature')
    expect(feature).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 3, name: 'Uniun' })).toBeInTheDocument()
    expect(screen.getByText('Live')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /visit uniun\.in/i })).toHaveAttribute('href', 'https://www.uniun.in/')
    expect(screen.getByRole('link', { name: /app store/i })).toHaveAttribute(
      'href',
      'https://apps.apple.com/in/app/uniun/id6778077321',
    )
    expect(screen.getByRole('link', { name: /google play/i })).toHaveAttribute(
      'href',
      'https://play.google.com/store/apps/details?id=in.uniun.app&hl=en_IN',
    )
  })

  it('carousel cycles through the three Uniun pillars', async () => {
    renderPage()
    // Starts on Brahma
    expect(screen.getByText(/Brahma · Create/i)).toBeInTheDocument()

    const nextBtn = screen.getByRole('button', { name: /next screenshot/i })
    fireEvent.click(nextBtn)
    expect(await screen.findByText(/Vishnu · Reflect/i)).toBeInTheDocument()

    fireEvent.click(nextBtn)
    expect(await screen.findByText(/Shiv · Transform/i)).toBeInTheDocument()

    // Wraps back to Brahma
    fireEvent.click(nextBtn)
    expect(await screen.findByText(/Brahma · Create/i)).toBeInTheDocument()
  })
})
