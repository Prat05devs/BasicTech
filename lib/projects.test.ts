import { describe, it, expect } from 'vitest'
import { PROJECTS } from '../constants'
import {
  getProjectBySlug, getFeaturedProjects, filterProjects, getNextProject,
  TYPE_LABELS, TAG_LABELS,
} from './projects'

describe('project helpers', () => {
  it('finds a project by slug', () => {
    expect(getProjectBySlug('dapper')?.name).toBe('Dapper')
  })

  it('returns undefined for an unknown slug', () => {
    expect(getProjectBySlug('nope')).toBeUndefined()
  })

  it('returns only featured projects', () => {
    const featured = getFeaturedProjects()
    expect(featured.length).toBeGreaterThan(0)
    expect(featured.every(p => p.tags.includes('featured'))).toBe(true)
  })

  it('filters by type', () => {
    const mobile = filterProjects(PROJECTS, 'mobile', 'all')
    expect(mobile.every(p => p.type === 'mobile')).toBe(true)
    expect(mobile.length).toBe(2)
  })

  it('filters by tag', () => {
    const oss = filterProjects(PROJECTS, 'all', 'open-source')
    expect(oss.every(p => p.tags.includes('open-source'))).toBe(true)
  })

  it('returns everything when filters are "all"', () => {
    expect(filterProjects(PROJECTS, 'all', 'all').length).toBe(PROJECTS.length)
  })

  it('cycles to the next project and wraps around', () => {
    const last = PROJECTS[PROJECTS.length - 1]
    expect(getNextProject(last.slug).slug).toBe(PROJECTS[0].slug)
  })

  it('has a label for every type and tag', () => {
    expect(TYPE_LABELS.web3).toBe('Web3')
    expect(TAG_LABELS['open-source']).toBe('Open Source')
  })
})
