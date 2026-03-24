/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: '#0a0a0a',
        platinum: '#E5E7EB',
        oldgold: '#FFFFFF', // sleek monochrome theme (formerly gold #C5A059)
        'oldgold-dim': '#9CA3AF', // neutral gray (formerly dark gold #8a6d3b)
        charcoal: '#121212',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        display: ['"Cinzel"', 'serif'],
        sans: ['"Inter"', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      }
    },
  },
  plugins: [],
}
