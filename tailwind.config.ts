import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#8B0000',
          light: '#a00000',
          accent: '#C62828',
        },
        ink: '#1a1a1a',
        paper: '#F5F5F0',
      },
      fontFamily: {
        sans: ['var(--font-noto-sans-jp)', 'sans-serif'],
        serif: ['var(--font-noto-serif-jp)', 'serif'],
      },
      maxWidth: {
        page: '1100px',
        section: '900px',
      },
      letterSpacing: {
        wide2: '0.1em',
        wide3: '0.2em',
        wide4: '0.3em',
      },
    },
  },
  plugins: [],
};

export default config;
