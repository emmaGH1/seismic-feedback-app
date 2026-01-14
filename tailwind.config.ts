/**
 * tailwind.config.ts
 * Context: Updated for "Colocation" structure (everything inside /app).
 * Changes: 
 * - Simplified content path to just scan ./app/**
 */
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}", 
  ],
  theme: {
    extend: {
      colors: {
        seismic: {
          black: "#050505",
          dark: "#0F0F0F",
          purple: "#6D4C6F",
          "purple-light": "#9E7B9F",
          gray: "#EAEAEA",
          muted: "#888888",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)"],
        serif: ["var(--font-playfair)"],
      },
    },
  },
  plugins: [],
};
export default config;