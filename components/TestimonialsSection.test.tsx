import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { TestimonialsSection } from './TestimonialsSection';
import { TESTIMONIALS } from '../data/testimonials';

describe('TestimonialsSection', () => {
  it('renders a card per testimonial', () => {
    render(<TestimonialsSection />);
    const list = screen.getByTestId('testimonials');
    expect(within(list).getAllByRole('blockquote').length).toBe(TESTIMONIALS.length);
  });
});
