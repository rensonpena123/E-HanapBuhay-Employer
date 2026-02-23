/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#1a263e',
          yellow: '#fbbf24',
          light: '#f3f4f6',
        }
      }
    },
  },
  plugins: [],
}