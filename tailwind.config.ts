import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#17233D",
          soft: "#3B4A66",
          faint: "#6B7690",
        },
        paper: {
          DEFAULT: "#EFEEE7",
          raised: "#F8F7F2",
          sunken: "#E4E2D8",
        },
        brass: {
          DEFAULT: "#B8862E",
          dark: "#8F6621",
          light: "#D9AE5F",
        },
        forest: {
          DEFAULT: "#1F4D3D",
          light: "#2E6B54",
          tint: "#E3EBE6",
        },
        clay: {
          DEFAULT: "#A23B2E",
          tint: "#F3E4E0",
        },
        line: {
          DEFAULT: "#D8D5C8",
          strong: "#B9B6A7",
        },
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        sans: ["var(--font-public-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-plex-mono)", "ui-monospace", "monospace"],
      },
      maxWidth: {
        content: "1240px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(23,35,61,0.06), 0 1px 0 rgba(23,35,61,0.04)",
        raised: "0 4px 16px rgba(23,35,61,0.10)",
      },
      borderRadius: {
        sm: "4px",
        DEFAULT: "6px",
        md: "8px",
        lg: "12px",
      },
    },
  },
  plugins: [],
};

export default config;
