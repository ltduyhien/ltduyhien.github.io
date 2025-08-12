/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Nunito Sans"', "sans-serif"],
      },
      colors: {
        "zinc-750": "#2a2a2e",
        "zinc-850": "#202023",
        brand: "rgb(var(--color-brand) / <alpha-value>)",
      },
      spacing: {
        26: "6.5rem", // 104px
      },
    },
  },
  plugins: [],
};
