/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#012169', // Approx Pantone 282 C
          50: '#eaf3fb',
          100: '#d7e9fb',
          200: '#b1d5f7',
          300: '#89bff2',
          400: '#4f96ea',
          500: '#012169',
          600: '#011a57',
          700: '#011444',
          800: '#001033',
          900: '#000a22'
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial']
      }
    },
  },
  plugins: [],
}
