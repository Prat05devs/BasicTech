import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import WorkIndex from './WorkIndex'
import { PROJECTS } from '../constants'

const renderPage = () =>
  render(<MemoryRouter><WorkIndex /></MemoryRouter>)

describe('WorkIndex', () => {
  it('renders every project by default', () => {
    renderPage()
    const grid = screen.getByTestId('project-grid')
    expect(within(grid).getAllByRole('heading', { level: 3 }).length).toBe(PROJECTS.length)
  })

  it('filters to mobile projects only', () => {
    renderPage()
    fireEvent.click(screen.getByRole('button', { name: 'Mobile' }))
    const grid = screen.getByTestId('project-grid')
    const headings = within(grid).getAllByRole('heading', { level: 3 }).map(h => h.textContent)
    expect(headings).toContain('Kumbh Milan')
    expect(headings).not.toContain('Dapper')
  })
})
