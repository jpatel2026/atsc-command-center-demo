/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          50: "#f6f7f9",
          100: "#eceef2",
          200: "#d4d8e0",
          300: "#a8b0bd",
          400: "#717a8a",
          500: "#4b5462",
          600: "#363d49",
          700: "#262b34",
          800: "#1a1d24",
          900: "#0f1116",
          950: "#070809",
        },
        accent: {
          50: "#eef7ff",
          100: "#daedff",
          200: "#bedfff",
          300: "#92cbff",
          400: "#5fb0ff",
          500: "#3a91ff",
          600: "#2474f5",
          700: "#1c5ddc",
          800: "#1d4eb0",
          900: "#1e448b",
        },
        ok: { 500: "#22c55e", 600: "#16a34a", 700: "#15803d" },
        warn: { 500: "#f59e0b", 600: "#d97706" },
        bad: { 500: "#ef4444", 600: "#dc2626" },
      },
      fontFamily: {
        sans: ['"Inter"', "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "SFMono-Regular", "monospace"],
      },
      boxShadow: {
        soft: "0 1px 2px rgba(7,8,9,.06), 0 4px 16px rgba(7,8,9,.08)",
      },
    },
  },
  plugins: [],
};
