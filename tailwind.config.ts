import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        sidebar: {
          bg: "#ffffff",
          hover: "#f1f5f9",
          active: "#e2e8f0",
          border: "#e2e8f0",
          text: {
            primary: "#0f172a",
            secondary: "#64748b",
            inactive: "#94a3b8",
          },
        },
        "dark-sidebar": {
          bg: "#0F172A",
          hover: "#1E293B",
          active: "#2D3B4F",
          border: "#2E3A4F",
          text: {
            primary: "#F8FAFC",
            secondary: "#94A3B8",
            inactive: "#64748B",
          },
        },
      },
      animation: {
        "sidebar-open": "sidebar-open 0.2s ease-out",
        "sidebar-close": "sidebar-close 0.2s ease-out",
      },
      keyframes: {
        "sidebar-open": {
          "0%": { width: "64px" },
          "100%": { width: "256px" },
        },
        "sidebar-close": {
          "0%": { width: "256px" },
          "100%": { width: "64px" },
        },
      },
      transitionProperty: {
        width: "width",
      },
    },
  },
  plugins: [],
} satisfies Config;
