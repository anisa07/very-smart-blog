/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        appear: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        disappear: {
          '0': { opacity: 1 },
          '100%': { opacity: 0 },
        },
      },
      animation: {
        appear: 'appear 1s ease-in-out forwards',
        disappear: 'disappear 1s ease-in-out forwards',
      }
    },
  },
  plugins: [],
};
