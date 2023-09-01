/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#090F2C',
        contrast: '#AD00FF',
        textColor: '#FFFFFF',
        gray: {
          dark: '#444444',
          light: '#C1C1C1',
        }
      }
    },
  },
  plugins: [],
}
