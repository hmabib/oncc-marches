/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        oncc: {
          green: "#0B6B3A",
          deepgreen: "#0A3D24",
          ink: "#10241A",
          gold: "#E9A426",
          goldlight: "#FCD116",
          red: "#CE1126",
          cream: "#FFF9EF",
          sand: "#F3EAD3",
          leaf: "#1E9E5A",
          muted: "#5B6B60",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 10px 30px -12px rgba(16,36,26,.25)",
      },
    },
  },
  plugins: [],
};
