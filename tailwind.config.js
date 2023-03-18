/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/pages/**/*.{ts,tsx}', './src/components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      screens: {
        '3xl': '1920px',
      },
      fontFamily: {
        notosans: ['Noto Sans KR', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
        nanumBrush: ['Nanum Brush Script', 'cursive'],
      },
      colors: {
        lightyellow: '#FDF4E2',
        lightteal: '#EDF5E1',
        lightblue: '#CAEAF3',
        lightred: '#F9E8E5',
        lightpurple: '#E6E3F5',
        lightgreen: '#E3F6F0',
        primary: '#B0D1D4',
      },
    },
  },
  darkMode: 'class',
  plugins: [],
}
