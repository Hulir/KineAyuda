/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class", 
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
      },
      colors: {
        primary: {
          light: "#8b5cf6", // purple-500
          DEFAULT: "#7c3aed", // purple-600
          dark: "#5b21b6", // purple-800
        },
        secondary: {
          light: "#6366f1", // indigo-500
          DEFAULT: "#4f46e5", // indigo-600
          dark: "#312e81", // indigo-900
        },
      },
      boxShadow: {
        smooth: "0 4px 20px rgba(0, 0, 0, 0.1)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
