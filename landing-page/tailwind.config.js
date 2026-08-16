/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Syne", "ui-sans-serif", "system-ui", "sans-serif"],
        sans: ["Outfit", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
      colors: {
        space: "#0B0B10",
        cream: "#FAF9F7",
        neon: {
          DEFAULT: "#A855F7",
          dim: "#7C3AED",
          glow: "#E879F9",
        },
      },
      boxShadow: {
        glass: "0 8px 32px rgba(168, 85, 247, 0.12)",
        neon: "0 0 40px rgba(168, 85, 247, 0.35)",
      },
      animation: {
        float: "float 6s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
    },
  },
  plugins: [],
};
