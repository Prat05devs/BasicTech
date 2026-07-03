import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { ContactProvider } from './ContactContext'
import { Nav } from './Layout'

function renderNav() {
  return render(
    <ContactProvider>
      <MemoryRouter>
        <Nav />
      </MemoryRouter>
    </ContactProvider>,
  )
}

describe('Nav', () => {
  it('renders Work, Products, and AI Infra links', () => {
    renderNav()
    // Desktop links are always in the DOM (visibility is CSS-only).
    expect(screen.getAllByRole('link', { name: 'Work' }).length).toBeGreaterThan(0)
    expect(screen.getAllByRole('link', { name: 'Products' }).length).toBeGreaterThan(0)
    expect(screen.getAllByRole('link', { name: 'AI Infra' }).length).toBeGreaterThan(0)
    expect(screen.getAllByRole('link', { name: 'Team' }).length).toBeGreaterThan(0)
    expect(screen.getAllByRole('link', { name: 'Blog' }).length).toBeGreaterThan(0)
    expect(screen.getAllByRole('link', { name: 'Research' }).length).toBeGreaterThan(0)
  })

  it('toggles the mobile menu panel', () => {
    renderNav()
    expect(screen.queryByTestId('mobile-menu')).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /open menu/i }))
    const panel = screen.getByTestId('mobile-menu')
    expect(within(panel).getByRole('link', { name: 'Products' })).toBeInTheDocument()
    // Closes when a link in the panel is clicked.
    fireEvent.click(within(panel).getByRole('link', { name: 'AI Infra' }))
    expect(screen.queryByTestId('mobile-menu')).not.toBeInTheDocument()
  })
})
