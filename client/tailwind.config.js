/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        sentinel: {
          dark: '#0f172a',
          panel: '#1e293b',
          border: '#334155',
          accent: '#3b82f6',
        },
      },
    },
  },
  plugins: [],
};
