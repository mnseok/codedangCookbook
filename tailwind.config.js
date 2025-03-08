/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}', // ✅ 전체 `src/` 폴더를 포함
    './src/components/ui/**/*.{js,ts,jsx,tsx}', // ✅ UI 폴더 포함 (세부적으로 추가)
    './src/hooks/**/*.{js,ts,jsx,tsx}', // ✅ hooks 폴더 추가
    './src/lib/**/*.{js,ts,jsx,tsx}' // ✅ lib 폴더 추가
  ],
  theme: {
    extend: {}
  },
  plugins: [require('@tailwindcss/typography')]
}
