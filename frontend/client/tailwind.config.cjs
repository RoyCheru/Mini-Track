/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef7ff",
          100: "#d9efff",
          200: "#b9e0ff",
          300: "#86c7ff",
          400: "#4aa8ff",
          500: "#1f7dff",
          600: "#145fe6",
          700: "#134bb8",
          800: "#153f93",
          900: "#163876",
        },
      },
      boxShadow: {
        soft: "0 10px 30px rgba(15, 23, 42, 0.08)",
      },
    },
  },
  plugins: [],
}
