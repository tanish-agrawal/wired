/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        chatBg: "#0f172a",
        chatCard: "#1e293b",
        chatSidebar: "#111827",
        chatAccent: "#6366f1",
      }
    },
  },
  plugins: [],
}
