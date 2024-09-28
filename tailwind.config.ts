import type { Config } from "tailwindcss";
const { nextui } = require("@nextui-org/react");

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        "border-beam": "border-beam calc(var(--duration)*1s) infinite linear",
      },
      keyframes: {
        "border-beam": {
          "100%": {
            "offset-distance": "100%",
          },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        // Define the primary color only for background and borders, but leave text unaffected
        primary: {
          DEFAULT: "#037F71", // Default primary color
          light: "#53A99E", // Optional lighter variant
          dark: "#025B4F", // Optional darker variant
        },
        // You can also create a separate set of colors for text specifically
        // customText: {
        //   DEFAULT: "#333333", // Custom default text color
        //   light: "#666666", // Optional lighter text variant
        //   dark: "#000000", // Optional darker text variant
        // },
        // customBackground: {
        //   DEFAULT: "#00554B", // Custom default background color
        //   light: "#F5F5F5", // Optional lighter background variant
        //   dark: "#E5E5E5", // Optional darker background variant
        // },
    
      },
    },
  },
  plugins: [nextui()],
};

export default config;
