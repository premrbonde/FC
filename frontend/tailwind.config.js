/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#000000",
        accent: "#FFC107",
        secondary: "#1A1A1A",
      },
      fontFamily: {
        sans: ["Inter", "Roboto", "sans-serif"],
        heading: ["Poppins", "Montserrat", "sans-serif"],
      },
    },
  },
  plugins: [],
}
