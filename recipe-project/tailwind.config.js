/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./*.html"],
  theme: {
    extend: {
      colors: {
        "primary": "#13ec5b",
        "background-light": "#f6f8f6",
        "background-dark": "#102216",
      },
      fontFamily: {
        "display": ["Manrope"],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries'),
  ],
}
