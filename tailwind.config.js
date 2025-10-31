/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      fontSize: {
        'h1': ['32px', { lineHeight: '38px', letterSpacing: '-0.04em' }],
        'h2': ['28px', { lineHeight: '34px', letterSpacing: '-0.04em' }],
        'h3': ['24px', { lineHeight: '30px', letterSpacing: '-0.01em' }],
        'h4': ['20px', { lineHeight: '26px', letterSpacing: '-0.01em' }],
        'h5': ['18px', { lineHeight: '24px', letterSpacing: '0em' }],
        'h6': ['16px', { lineHeight: '22px', letterSpacing: '0em' }],
        'body-large': ['18px', { lineHeight: '28px', letterSpacing: '0em' }],
        'body-medium': ['16px', { lineHeight: '24px', letterSpacing: '0em' }],
        'body-small': ['14px', { lineHeight: '20px', letterSpacing: '0em' }],
        'caption': ['12px', { lineHeight: '16px', letterSpacing: '0.01em' }],
      },
    },
  },
  plugins: [],
};
