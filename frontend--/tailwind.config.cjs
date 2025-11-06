/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx,css,module.css}'], // Tailwind가 클래스명을 추출할 경로
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4F46E5',
          dark: '#4338CA',
          light: '#A855F7',
        },
        secondary: {
          pink: '#EC4899',
          purple: '#A855F7',
        },
        background: {
          DEFAULT: '#F8F9FA',
        },
        gray: {
          900: '#111827',
          700: '#374151',
          500: '#6B7280',
          300: '#D1D5DB',
          200: '#E5E7EB',
          100: '#F3F4F6',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans KR', 'sans-serif'],
      },
      spacing: {
        96: '24rem',
      },
      keyframes: {
        blob: {
          '0%': { transform: 'scale(1) translate(0px, 0px)' },
          '33%': { transform: 'scale(1.1) translate(30px, -50px)' },
          '66%': { transform: 'scale(0.9) translate(-20px, 20px)' },
          '100%': { transform: 'scale(1) translate(0px, 0px)' },
        },
      },
      animation: {
        blob: 'blob 15s infinite ease-in-out',
      },
    },
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/container-queries')],
};
