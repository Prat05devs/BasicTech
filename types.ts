export interface ServiceItem {
  title: string;
  description: string;
}

export interface PillarItem {
  title: string;
  subtitle: string;
  icon: string;
}

export interface ProcessStep {
  number: string;
  title: string;
  description: string;
}

export type ProjectType = 'web' | 'mobile' | 'ai' | 'web3' | 'ecommerce' | 'backend';
export type ProjectTag = 'open-source' | 'client-work' | 'in-house' | 'featured' | 'brand-site';

export interface Project {
  slug: string;
  name: string;
  client: string;
  vertical: string;            // industry
  type: ProjectType;
  tags: ProjectTag[];
  year?: string;
  role?: string;
  summary: string;             // short one-liner (was `solution`)
  problem: string;
  approach: string;
  outcome: string;
  highlights?: string[];
  tech: string[];
  cover: string;               // hero/cover image (was `image`)
  gallery?: string[];
  websiteUrl?: string;
  githubUrl?: string;
  status?: 'live' | 'archived';
}

export enum SectionId {
  Hero = 'hero',
  Philosophy = 'philosophy',
  Services = 'services',
  Differentiation = 'differentiation',
  Process = 'process',
  Work = 'work',
  AI = 'ai',
  Contact = 'contact'
}