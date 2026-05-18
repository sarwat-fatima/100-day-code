/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        beige: {
          DEFAULT: "hsl(var(--paper))",
          2: "hsl(var(--paper-2))"
        },
        paper: {
          DEFAULT: "hsl(var(--paper))",
          2: "hsl(var(--paper-2))"
        },
        ink: {
          DEFAULT: "hsl(var(--ink))",
          2: "hsl(var(--ink-2))"
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          fg: "hsl(var(--accent-fg))"
        },
        border: "hsl(var(--border))",
        ring: "hsl(var(--ring))"
      },
      fontFamily: {
        serif: ["var(--font-serif)", "ui-serif", "Georgia", "serif"],
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "Segoe UI", "Roboto", "Arial", "sans-serif"]
      },
      letterSpacing: {
        editorial: "0.06em"
      },
      boxShadow: {
        lift: "0 18px 40px rgba(0,0,0,.08)"
      }
    }
  },
  plugins: [require("tailwindcss-animate")]
};
