/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        emerald: {
          500: '#10b981',
          600: '#059669',
        },
        purple: {
          500: '#a855f7',
          600: '#9333ea',
        },
        navy: {
          800: '#1e293b',
          900: '#0f172a',
        },
        yellow: {
          400: '#facc15',
          500: '#eab308',
        },
      }
    },
  },
  plugins: [],
}
