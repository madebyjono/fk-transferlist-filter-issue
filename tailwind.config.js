/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app.vue",
    "./formkit.theme.mjs" // <-- add your theme file
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

