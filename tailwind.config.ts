import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class", // control dark mode manually with a toggle
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        seismic: {
          black: "#050505",       // Deep black background
          dark: "#0F0F0F",        // Slightly lighter for cards
          purple: "#6D4C6F",      // The muted violet from the slides
          "purple-light": "#9E7B9F", // Highlight purple
          gray: "#EAEAEA",        // Primary text
          muted: "#888888",       // Secondary text
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)"],
        serif: ["var(--font-playfair)"],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'noise': "url('/noise.png')", // will need a tiny noise png asset or svg
      },
    },
  },
  plugins: [],
};
export default config;