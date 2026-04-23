import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Core brand palette — cinematic teal-black with warm accents
        ink: {
          DEFAULT: '#0A1316',   // deep teal-black primary bg
          soft:    '#0D181C',   // slightly lifted surface
          line:    'rgba(240,232,218,0.10)',
        },
        cream: {
          DEFAULT: '#F0E8DA',   // warm off-white text
          muted:   'rgba(240,232,218,0.55)',
          faint:   'rgba(240,232,218,0.28)',
          page:    '#F1ECE1',   // contrast section bg
        },
        brass: {
          DEFAULT: '#C9A961',
          soft:    'rgba(201,169,97,0.18)',
          deep:    '#8C7239',
        },
      },
      fontFamily: {
        display: ['var(--font-archivo)', 'system-ui', 'sans-serif'],
        serif:   ['var(--font-fraunces)', 'Georgia', 'serif'],
        mono:    ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        'logo':  ['clamp(90px, 18vw, 340px)',  { lineHeight: '0.85', letterSpacing: '-0.04em' }],
        'tag':   ['clamp(40px, 6.5vw, 96px)',  { lineHeight: '1.02', letterSpacing: '-0.02em' }],
        'head':  ['clamp(32px, 4vw, 56px)',    { lineHeight: '1.05', letterSpacing: '-0.02em' }],
      },
      letterSpacing: {
        'mono': '0.18em',
      },
      animation: {
        'drift':   'drift 22s ease-in-out infinite alternate',
        'bob':     'bob 1.8s ease-in-out infinite',
        'fade-up': 'fadeUp 1.4s cubic-bezier(.2,.8,.2,1) forwards',
        'pulse-slow': 'pulseSlow 4s ease-in-out infinite',
      },
      keyframes: {
        drift: {
          '0%':   { transform: 'scale(1) translate(0,0)' },
          '100%': { transform: 'scale(1.08) translate(-1%, -1.5%)' },
        },
        bob: {
          '0%, 100%': { transform: 'translateY(-3px)', opacity: '0.4' },
          '50%':      { transform: 'translateY(3px)',  opacity: '1' },
        },
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSlow: {
          '0%, 100%': { opacity: '0.4' },
          '50%':      { opacity: '1' },
        },
      },
      transitionTimingFunction: {
        'brand': 'cubic-bezier(.2,.8,.2,1)',
      },
    },
  },
  plugins: [],
};

export default config;
