/* eslint-disable no-undef */
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': {'max': '639px'}, // Below sm (for mobile screens)
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
    require('daisyui'),
],
}

