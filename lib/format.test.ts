import { describe, it, expect } from 'vitest';
import { formatDate } from './format';

describe('formatDate', () => {
  it('includes year and month for a full date', () => {
    const result = formatDate('2026-07-01');
    expect(result).toContain('2026');
    expect(result).toContain('July');
  });

  it('includes the day for the default options', () => {
    const result = formatDate('2026-07-01');
    expect(result).toContain('1');
  });

  it('month-year option omits the day', () => {
    const result = formatDate('2026-07-01', { year: 'numeric', month: 'long' });
    expect(result).toContain('2026');
    expect(result).toContain('July');
    // "July 2026" — no day number present as a standalone token
    expect(result).not.toMatch(/\b\d{1,2},\b/);
  });
});
