
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,css,js,jsx,tsx}",
    "../components/**/*.{html,css,js,jsx,tsx}"
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/typography")
  ],
}
