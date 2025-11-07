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
      colors: {
        // Trust and authority color palette for medical application
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7', // Main primary - trustworthy blue
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        medical: {
          trust: '#2563eb', // Deep trustworthy blue
          authority: '#1e40af', // Authority blue
          calm: '#60a5fa', // Calming light blue
          success: '#10b981', // Medical success green
          warning: '#f59e0b', // Medical warning amber
          critical: '#ef4444', // Critical red
        },
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        'elevated': '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
