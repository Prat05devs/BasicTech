import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { ContactProvider } from '../components/layout/ContactContext'
import WorkDetail from './WorkDetail'

function renderAt(path: string) {
  return render(
    <ContactProvider>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path="/work/:slug" element={<WorkDetail />} />
          <Route path="/" element={<div>home</div>} />
        </Routes>
      </MemoryRouter>
    </ContactProvider>,
  )
}

describe('WorkDetail', () => {
  it('renders the project name and outcome for a known slug', () => {
    renderAt('/work/dapper')
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Dapper')
    expect(screen.getByText(/Placed 35th in the Asia-Pacific/i)).toBeInTheDocument()
  })

  it('redirects an unknown slug home', () => {
    renderAt('/work/does-not-exist')
    expect(screen.getByText('home')).toBeInTheDocument()
  })
})
