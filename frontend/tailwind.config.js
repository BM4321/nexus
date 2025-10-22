/** @type {import('tailwindcss').Config} */
module.exports = {
  // IMPORTANT: This must list all files that use Tailwind classes
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}", // Expo-Router's primary source folder
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};