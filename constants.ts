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
    description: "Built a scalable mobile application that handled millions of concurrent users during one of the world's largest religious gatherings. The platform featured real-time geolocation services, chat functionality, and community features that allowed pilgrims to discover and connect with others in their vicinity. Implemented robust backend infrastructure to handle peak traffic loads and ensure seamless user experience across different network conditions.",
    tech: "Flutter · Firebase · Real-Time Geolocation",
    image: "https://images.unsplash.com/photo-1742316963876-51ddb4fa2fef?q=80&w=2496&auto=format&fit=crop",
    websiteUrl: "",
    githubUrl: "https://github.com/basictech01/kumbh-milan"
  },
  {
    name: "DoonPlot",
    client: "Real Estate Agencies",
    vertical: "PropTech",
    solution: "Modernizing land sales by replacing static brochures with interactive, mobile-first geospatial experiences.",
    description: "Developed an innovative property mapping platform that transformed traditional land sales processes. The application integrated Google Maps API with custom GeoJSON data to provide interactive property visualization, boundary mapping, and location-based search capabilities. Built with a focus on mobile-first design to enable real estate agents to showcase properties effectively on-the-go, significantly improving customer engagement and sales conversion rates.",
    tech: "React · Google Maps API · GeoJSON",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800",
    websiteUrl: "https://doonplot.in",
    githubUrl: "https://github.com/basictech01/LandMarketing"
  },
  {
    name: "CricketVoteCrypto",
    client: "CricketVote",
    vertical: "Web3 & Gaming",
    solution: "A decentralized IPL prediction platform using smart contracts and cryptographic verification for trustless rewards.",
    description: "Created a blockchain-based prediction platform for IPL cricket matches using Ethereum smart contracts. The platform enabled users to make predictions, stake tokens, and receive automated rewards based on match outcomes. Implemented secure smart contract architecture with cryptographic verification to ensure trustless and transparent reward distribution. Integrated Web3.js for seamless blockchain interactions and built an intuitive React frontend for user engagement.",
    tech: "Solidity · Web3.js · React",
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=800",
    websiteUrl: "", // Add deployed website URL here
    githubUrl: "https://github.com/basictech01/cricketvoteblockchain"
  }
];