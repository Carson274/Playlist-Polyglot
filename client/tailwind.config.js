/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        mytheme: {
          "primary": "#1DB954",
          "secondary": "white",
          "accent": "#131313",
          "neutral": "#D6D6D6",
        },
      },
    ],
  },
}

