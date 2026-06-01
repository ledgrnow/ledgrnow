import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#07111f",
        mint: "#19c39c",
        coral: "#ff7a59",
        steel: "#64748b"
      },
      boxShadow: {
        glow: "0 24px 80px rgba(25, 195, 156, 0.22)"
      }
    }
  },
  plugins: []
};

export default config;
