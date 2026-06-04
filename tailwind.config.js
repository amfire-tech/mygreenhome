/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#050d08',
        'bg-2': '#030806',
        'green-deep': '#0d1f15',
        'green-forest': '#14361f',
        'green-mid': '#2d5a3d',
        'green-light': '#4a7c59',
        'green-bright': '#4ab87a',
        gold: '#c8a96e',
        'gold-light': '#e8c98e',
        brass: '#b8893f',
        cream: '#f5f0e8',
        ivory: '#f6f3ea',
        'ivory-2': '#faf8f2',
        ink: '#1c1c18',
        sage: '#b7c9b1',
        terracotta: '#b5673a',
      },
      fontFamily: {
        display: ['Cormorant Garamond', 'Georgia', 'serif'],
        body: ['Satoshi', 'Outfit', 'system-ui', 'sans-serif'],
        script: ['Pinyon Script', 'cursive'],
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        bounce: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      },
    },
  },
  plugins: [],
};
