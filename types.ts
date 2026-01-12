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

export interface WorkItem {
  name: string;
  client: string;
  vertical: string;
  solution: string;
  tech: string;
  image: string;
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