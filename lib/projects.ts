import { PROJECTS } from '../constants'
import { Project, ProjectType, ProjectTag } from '../types'

export const ALL_TYPES: ProjectType[] = ['web', 'mobile', 'ai', 'web3', 'ecommerce', 'backend']
export const ALL_TAGS: ProjectTag[] = ['open-source', 'client-work', 'in-house', 'featured', 'brand-site']

export const TYPE_LABELS: Record<ProjectType, string> = {
  web: 'Web', mobile: 'Mobile', ai: 'AI / ML', web3: 'Web3', ecommerce: 'E-Commerce', backend: 'Backend',
}

export const TAG_LABELS: Record<ProjectTag, string> = {
  'open-source': 'Open Source', 'client-work': 'Client Work', 'in-house': 'In-House', featured: 'Featured', 'brand-site': 'Brand Site',
}

export function getProjectBySlug(slug: string): Project | undefined {
  return PROJECTS.find(p => p.slug === slug)
}

export function getFeaturedProjects(): Project[] {
  return PROJECTS.filter(p => p.tags.includes('featured'))
}

export function filterProjects(
  projects: Project[],
  type: ProjectType | 'all',
  tag: ProjectTag | 'all',
): Project[] {
  return projects.filter(p =>
    (type === 'all' || p.type === type) &&
    (tag === 'all' || p.tags.includes(tag)),
  )
}

export function getNextProject(slug: string): Project {
  const i = PROJECTS.findIndex(p => p.slug === slug)
  return PROJECTS[(i + 1) % PROJECTS.length]
}
