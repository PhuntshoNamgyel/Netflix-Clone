/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: "class", // Enable dark mode using the 'dark' class
  theme: {
    extend: {
      colors: {
        netflix: {
          DEFAULT: "#e50914", // Netflix red for both modes
          dark: "#141414", // Dark mode background
          gray: "#222222", // Dark mode gray
          light: "#f5f5f5", // Light mode background
        },
      },
      fontFamily: {
        netflix: ['"Bebas Neue"', "Arial", "sans-serif"],
      },
      borderRadius: {
        xl: "1rem",
      },
    },
  },
  plugins: [],
};