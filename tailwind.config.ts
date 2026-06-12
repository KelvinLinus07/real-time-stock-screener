import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0b0e11",
        surface: "#131720",
        surfaceLight: "#1a1f2b",
        border: "#252b38",
        primary: "#2563eb",
        accent: "#3b82f6",
        bullish: "#16c784",
        bearish: "#ea3943",
        textPrimary: "#e5e7eb",
        textSecondary: "#9ca3af",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
