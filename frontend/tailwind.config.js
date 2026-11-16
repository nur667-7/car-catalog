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
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          500: '#10b981',
          600: '#0e7a5a',
          700: '#0b664b',
          800: '#08523c',
          900: '#064030',
        },
        page: '#f4f5f9'
      }
    },
  },
  plugins: [],
}
