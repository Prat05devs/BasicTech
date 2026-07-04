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
