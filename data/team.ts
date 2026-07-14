export interface TeamMemberLink { label: string; href: string; }

export interface TeamMember {
  slug: string;
  name: string;
  role: string;
  bio: string;
  photo?: string;
  links?: TeamMemberLink[];
}

// TODO: replace with real team members, bios, photos, and links.
export const TEAM: TeamMember[] = [
  {
	  slug: 'pranav-pandey',
	  name: 'Pranav Pandey',
	  role: 'Senior Consultant - Global Engineering & Systems Strategy',
	  bio: 'Pranav supports Basic Tech as a senior consultant, bringing global engineering perspective from his work at LinkedIn as a Senior Software Engineer in Systems Infrastructure, focused on MySQL, distributed systems, high availability, and scalable backend platforms. He guides Basic Tech across technical strategy, engineering quality, system design, and long-term product execution.',
	  photo: '/pranavPhoto.png',
	  links: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/prapandey/' },
    { label: 'GitHub', href: 'https://github.com/pranavpandey1998official' }
  ]
},
{
  slug: 'malav-patel',
  name: 'Malav Patel',
  role: 'Europe Charter Lead - AI Solutions Architecture & Forward Deployed Engineering',
  bio: 'Malav leads Basic Tech’s Europe charter across AI solution architecture, forward deployed engineering, production AI systems, and compliance-first delivery. With 12+ years in technology and deep experience in agentic AI, RAG, AI security, MLOps, cloud infrastructure, and EU-compliant SaaS, he helps Basic Tech design scalable, governed, audited, and production-ready AI solutions for global clients.',
  photo: '/malavPhoto.jpeg',
  links: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/malavpatel112/' },
    { label: 'GitHub', href: 'https://github.com/mlvpatel' }
  ]
},
{
  slug: 'kevin-patel',
  name: 'Kevin Patel',
  role: 'Senior Consultant - Planet-Scale Systems & Mobile Engineering Strategy',
  bio: 'Kevin supports Basic Tech as a senior consultant with global engineering experience from Google in Poland, where he built planet-scale distributed filesystem replication. He also brings deep mobile expertise across Android, iOS, React Native, and Flutter.',
  photo: '/kevinpatel.png',
},
  {
  slug: 'prateek-thapliyal',
  name: 'Prateek Thapliyal',
	  role: 'India Charter Lead - Customer Success & Forward Deployed Engineering',
	  bio: 'Prateek leads Basic Tech’s India charter across customer success, forward deployed engineering, AI-assisted workflows, and client solution delivery. He works closely with clients and internal teams to turn business requirements into structured, scalable, and high-quality digital solutions.',
	  photo: '/prateekPhoto.png',
	  links: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/prateek-thapliyal-496576244/' },
    { label: 'GitHub', href: 'https://github.com/prat05devs' }
  ]
},
];
