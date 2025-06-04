/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class", // ✅ Enables class-based dark mode toggle
  theme: {
    extend: {},
  },
  plugins: [],
};

