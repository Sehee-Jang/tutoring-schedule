/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./pages/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        grey: {
          15: "#262626", // grey/15 설정
        },
      },
      textColor: {
        DEFAULT: "var(--foreground, #262626)", // 기본 글씨 색상 설정
      },
    },
  },
  darkMode: "class", // 다크 모드 설정 (필요에 따라 'media'로 변경 가능)
  plugins: [],
};
