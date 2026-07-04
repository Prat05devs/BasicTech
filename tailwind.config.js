import typography from '@tailwindcss/typography'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './**/*.{ts,tsx}', './content/**/*.mdx', '!./node_modules/**'],
  theme: {
    screens: {
      'xs': '375px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
      '3xl': '1920px',
      '4xl': '2560px',
      '5xl': '3840px',
    },
    extend: {
      fontFamily: { sans: ['Inter', 'sans-serif'] },
      colors: { brand: { blue: '#2F80ED', dark: '#0f172a' } },
      backgroundImage: {
        'grid-pattern':
          'linear-gradient(to right, #f1f5f9 1px, transparent 1px), linear-gradient(to bottom, #f1f5f9 1px, transparent 1px)',
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem', xs: '1rem', sm: '1.5rem', md: '2rem',
          lg: '2.5rem', xl: '3rem', '2xl': '4rem', '3xl': '5rem', '4xl': '6rem',
        },
        screens: {
          xs: '100%', sm: '640px', md: '768px', lg: '1024px',
          '2xl': '1400px', '3xl': '1600px', '4xl': '1800px',
        },
      },
      spacing: { '18': '4.5rem', '88': '22rem', '100': '25rem', '112': '28rem', '128': '32rem' },
    },
  },
  plugins: [typography],
}
