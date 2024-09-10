/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // oder 'media' für systembasierte Dunkelmodus-Erkennung
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './public/index.html',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Space Grotesk', 'sans-serif'],
      },
      borderWidth: {
        '96': '96px', // Füge hier den neuen Wert hinzu
      },
    },
  },
  plugins: [],
}