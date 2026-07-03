export interface Testimonial {
  quote: string;
  author: string;
  role: string;
  company: string;
  avatar?: string;
}

// TODO: replace with real client testimonials + attribution.
export const TESTIMONIALS: Testimonial[] = [
  { quote: 'TODO: a specific, outcome-focused client quote.', author: 'TODO: Name', role: 'TODO: Role', company: 'TODO: Company' },
  { quote: 'TODO: a second client quote.', author: 'TODO: Name', role: 'TODO: Role', company: 'TODO: Company' },
  { quote: 'TODO: a third client quote.', author: 'TODO: Name', role: 'TODO: Role', company: 'TODO: Company' },
];
