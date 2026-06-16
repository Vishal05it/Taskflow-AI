import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef4ff",
          100: "#e0eaff",
          200: "#c7d8ff",
          300: "#a4bcff",
          400: "#7d96ff",
          500: "#5b6df0",
          600: "#4350d4",
          700: "#363fac",
          800: "#2d3589",
          900: "#2a306e",
        },
      },
    },
  },
  plugins: [],
};

export default config;
