/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#0b0f19',
          surface: '#111827',
          card: '#161f33',
          border: '#1f293d',
          hover: '#1e293b',
          muted: '#94a3b8',
        },
        accent: {
          emerald: '#10b981',
          cyan: '#06b6d4',
          sky: '#38bdf8',
        }
      },
      fontFamily: {
        mono: ['"Fira Code"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

