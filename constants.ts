import { ServiceItem, PillarItem, ProcessStep, WorkItem } from './types';

export const SERVICES: ServiceItem[] = [
  { title: "Web Applications", description: "Scalable, React-based web application development built for performance and long-term maintainability." },
  { title: "Mobile Apps", description: "High-performance mobile app development with native feel and cross-platform efficiency." },
  { title: "Backend Systems", description: "Robust backend development services with secure APIs, microservices, and scalable architectures." },
  { title: "AI Integration", description: "AI-powered software development including LLM integration, vector databases, and intelligent automation." },
  { title: "MVPs for Startups", description: "MVP development for startups — from idea to market-ready product in weeks, not months." }
];

export const PILLARS: PillarItem[] = [
  {
    title: "Elite Engineers",
    subtitle: "Small teams. Deep thinking. Engineers who understand systems, not just frameworks.",
    icon: "Brain"
  },
  {
    title: "AI-Powered Execution",
    subtitle: "AI-assisted development workflows reduce repetition and accelerate delivery without compromising quality.",
    icon: "Bot"
  },
  {
    title: "Engineering Fundamentals",
    subtitle: "Clean, maintainable code. Scalable systems. Software built to last.",
    icon: "Settings"
  }
];

export const PROCESS_STEPS: ProcessStep[] = [
  {
    number: "01",
    title: "Understand the Problem",
    description: "We don't write a single line of code until we fully understand the business problem and its real-world impact."
  },
  {
    number: "02",
    title: "Design the System",
    description: "Architecture first. Data flows, API contracts, and component hierarchies are mapped before execution."
  },
  {
    number: "03",
    title: "Build with AI Leverage",
    description: "AI tooling accelerates scaffolding so engineers focus on complex logic and product decisions."
  },
  {
    number: "04",
    title: "Test & Refine",
    description: "Automated testing pipelines and rigorous reviews ensure stable, production-ready software."
  },
  {
    number: "05",
    title: "Ship & Support",
    description: "Reliable deployment pipelines, monitoring, and long-term support keep systems healthy at scale."
  }
];

export const SELECTED_WORK: WorkItem[] = [
  {
    name: "Kumbh Milan",
    client: "UrbanMatch Inc.",
    vertical: "Social Networking",
    solution: "A hyper-local social discovery platform enabling millions of pilgrims to connect and communicate during the Kumbh Mela.",
    tech: "Flutter · Firebase · Real-Time Geolocation",
    image: "https://images.unsplash.com/photo-1599420186946-7b6fb4e297f0?auto=format&fit=crop&q=80&w=800"
  },
  {
    name: "DoonPlot",
    client: "Real Estate Agencies",
    vertical: "PropTech",
    solution: "Modernizing land sales by replacing static brochures with interactive, mobile-first geospatial experiences.",
    tech: "React · Google Maps API · GeoJSON",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800"
  },
  {
    name: "CricketVoteCrypto",
    client: "CricketVote",
    vertical: "Web3 & Gaming",
    solution: "A decentralized IPL prediction platform using smart contracts and cryptographic verification for trustless rewards.",
    tech: "Solidity · Web3.js · React",
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=800"
  }
];