/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Pangolin", "cursive"],
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        washwize: {
          primary: "#000000",
          secondary: "#23A5C2",
          accent: "#76DFF7",
          neutral: "#FFFFFF",
          "base-100": "#C3C1C1",
          info: "#0CA5E9",
          success: "#04B45F",
          warning: "#F4BF50",
          error: "#F62E2E",
        },
      },
    ],
    darkTheme: "washwize",
  },
};
