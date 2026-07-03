import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { ContactProvider, useContact } from '../components/layout/ContactContext'
import Products from './Products'
import { PRODUCTS } from '../data/products'

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
  it('renders a card per product with status badges', () => {
    renderPage()
    const grid = screen.getByTestId('product-grid')
    expect(within(grid).getAllByRole('heading', { level: 3 }).length).toBe(PRODUCTS.length)
    expect(within(grid).getAllByText('In Development').length).toBeGreaterThan(0)
  })

  it('"Notify me" opens the contact modal tagged with the product name', () => {
    renderPage()
    const grid = screen.getByTestId('product-grid')
    fireEvent.click(within(grid).getAllByRole('button', { name: 'Notify me' })[0])
    expect(screen.getByTestId('probe')).toHaveTextContent(`open|Product waitlist: ${PRODUCTS[0].name}`)
  })
})
