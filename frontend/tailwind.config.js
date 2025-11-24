/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef2ff',
          100: '#e0e7ff',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
        }
      },
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
      },
      animation: {
        'fadeIn': 'fadeIn 0.6s ease-out',
        'fadeInUp': 'fadeInUp 0.8s ease-out',
        'fadeInDown': 'fadeInDown 0.8s ease-out',
        'slideInLeft': 'slideInLeft 0.8s ease-out',
        'slideInRight': 'slideInRight 0.8s ease-out',
        'scaleIn': 'scaleIn 0.5s ease-out',
        'bounce-slow': 'bounce 2s infinite',
        'spin-slow': 'spin 3s linear infinite',
        'shimmer': 'shimmer 2s infinite',
        'float': 'float 3s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}
