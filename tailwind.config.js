/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bosco: {
          red: '#C63637',
          gray: '#4E4E4E',
          dark: '#121212', // Premium dark mode background
          card: '#1E1E1E', // Dark mode card background
        }
      },
      fontFamily: {
        sans: ['Inter', 'Cairo', 'sans-serif'], 
      }
    },
  },
  plugins: [],
}