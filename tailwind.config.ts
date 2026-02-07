import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1B4D6E",
          light: "#2A6F97",
          dark: "#0F2D42",
        },
        accent: {
          DEFAULT: "#C8A96E",
          light: "#E5D5B0",
        },
        success: "#2D9F6F",
        warning: "#E8A838",
        bg: {
          DEFAULT: "#FAFAF8",
          card: "#FFFFFF",
          dark: "#0F1923",
        },
      },
      fontFamily: {
        sans: ["Noto Sans KR", "Pretendard", "system-ui", "sans-serif"],
        serif: ["Playfair Display", "serif"],
      },
      animation: {
        "float": "float 6s ease-in-out infinite",
        "float-delayed": "float 7s ease-in-out infinite 1s",
        "pulse-slow": "pulse 2s infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
