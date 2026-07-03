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
  { slug: 'member-one', name: 'TODO: Member One', role: 'TODO: Role', bio: 'TODO: short bio.', links: [] },
  { slug: 'member-two', name: 'TODO: Member Two', role: 'TODO: Role', bio: 'TODO: short bio.', links: [] },
  { slug: 'member-three', name: 'TODO: Member Three', role: 'TODO: Role', bio: 'TODO: short bio.', links: [] },
];
