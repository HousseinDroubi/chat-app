/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        purple_gray: {
          100: "#69649B",
          300: "#393657",
          500: "#2D2B3F",
        },
        light_gray: {
          100: "#FAFAFA",
          300: "#E5E3E3",
          500: "#9F9F9F",
        },
        green_shade: "#18C070",
        orange_shade: "#F9991A",
        semi_transparent: "rgba(0,0,0,0.5)",
      },
      width: {
        600: "600px",
        500: "500px",
        300: "300px",
      },
      height: {
        400: "400px",
        300: "300px",
      },
    },
  },
  plugins: [],
};
