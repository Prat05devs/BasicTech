export interface Result {
  metric: string;
  label: string;
}

// Seeded from real project highlights; TODO: add/replace with more results.
export const RESULTS: Result[] = [
  { metric: 'Millions', label: 'concurrent users handled (Kumbh Milan)' },
  { metric: 'Top 300', label: 'globally at Lovable\'s competition (Dapper)' },
  { metric: '23+', label: 'error scenarios hardened (Inventory system)' },
  { metric: 'TODO', label: 'TODO: add another headline result' },
];
