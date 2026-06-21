/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Mapping default green utility classes to Neon Arcade / Indie Game palette
        green: {
          50: '#fff0f7',
          100: '#ffd5ea',
          200: '#ff55aa',
          300: '#ff007f', // Neon Magenta
          400: '#ff007f', 
          500: '#a200ff', // Arcade Purple
          600: '#7a00cc',
          700: '#5a0099',
          800: '#3b0066',
          900: '#1e0033',
          950: '#0f0b21',
        },
        slate: {
          950: '#020617'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
