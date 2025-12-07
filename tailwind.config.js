/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Outfit', 'sans-serif'],
      },
      colors: {
        space: {
          900: '#0B0E17', // Deepest space background
          800: '#151B2B', // Card background
          700: '#232D42', // Border/Hover
        },
        neon: {
          cyan: '#00F0FF',
          yellow: '#FFD700',
          purple: '#B5179E',
        },
        nebula: {
          start: '#4CC9F0',
          end: '#4361EE',
        }
      },
      backgroundImage: {
        'space-gradient': 'linear-gradient(to right bottom, #0B0E17, #101426, #151B2B)',
      }
    },
  },
  plugins: [],
}
