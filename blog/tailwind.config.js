/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0a192f',
          light: '#112240',
          lightest: '#233554',
          subbar: '#0d1c38',
        },
        accent: {
          green: '#64ffda',
          'green-tint': 'rgba(100, 255, 218, 0.1)',
        },
        slate: {
          muted: '#8892b0',
          light: '#a8b2d1',
          white: '#e6f1ff',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      }
    },
  },
  plugins: [],
}

