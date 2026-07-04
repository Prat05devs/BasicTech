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
    expect(screen.getByText(/Reimagining Thrift Fashion/i)).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Project Overview' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Key Constraints' })).toBeInTheDocument()
    expect(screen.getByText(/movement-led brand experience/i)).toBeInTheDocument()
  })

  it('renders the CampaignOps case study copy', () => {
    renderAt('/work/campaign-ops')
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('CampaignOps')
    expect(screen.getByText(/event execution is rarely handled in one place/i)).toBeInTheDocument()
    expect(screen.getByText(/AI proposes, humans approve/i)).toBeInTheDocument()
    expect(screen.getByText(/operating memory of an event-driven organization/i)).toBeInTheDocument()
  })

  it('renders the Quality Care Clinics case study copy', () => {
    renderAt('/work/quality-care-clinics')
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Quality Care Clinics')
    expect(screen.getByText(/Admin Console for Managing Doctors/i)).toBeInTheDocument()
    expect(screen.getByText(/reliable back-office system/i)).toBeInTheDocument()
    expect(screen.getByText(/Multi-Clinic Scheduling Logic/i)).toBeInTheDocument()
  })

  it('renders the newly updated brand-site case studies', () => {
    renderAt('/work/axocom')
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('AxoCom')
    expect(screen.getByText(/Corporate Website for a Media and Communications Company/i)).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Services and Ventures' })).toBeInTheDocument()
    expect(screen.getByText(/Professional brand presence/i)).toBeInTheDocument()
  })

  it('redirects an unknown slug home', () => {
    renderAt('/work/does-not-exist')
    expect(screen.getByText('home')).toBeInTheDocument()
  })
})
