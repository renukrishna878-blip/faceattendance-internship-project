/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1976D2',
        secondary: '#5d5f5f',
        background: '#f5f5f5',
        surface: '#ffffff',
        success: '#22c55e',
        error: '#ba1a1a',
        warning: '#f59e0b',
        'on-primary': '#ffffff',
        'on-surface': '#1a1c1c',
        'outline': '#717783',
      },
      fontFamily: {
        sans: ['Roboto Flex', 'sans-serif'],
      },
      borderRadius: {
        'sm': '0.25rem',
        DEFAULT: '0.5rem',
        'md': '0.75rem',
        'lg': '1rem',
        'xl': '1.5rem',
        'full': '9999px',
      }
    },
  },
  plugins: [],
}
