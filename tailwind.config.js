/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      fontWeight: {
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '800',
        black: '900',
      },
      fontSize: {
        // Display typography - Hero sections, landing pages (Golden Ratio: 1.618)
        // Using strategic weight combinations: 800/700, 700/600, 600/500, 500/400
        'display-2xl': ['clamp(3.5rem, 5vw + 1rem, 5rem)', { 
          lineHeight: '1.1', 
          letterSpacing: '-4%',
          fontWeight: '900'
        }],
        'display-xl': ['clamp(3rem, 4vw + 1rem, 4.5rem)', { 
          lineHeight: '1.1', 
          letterSpacing: '-2%',
          fontWeight: '800'
        }],
        'display-lg': ['clamp(2.5rem, 3.5vw + 1rem, 3.75rem)', { 
          lineHeight: '1.15', 
          letterSpacing: '-0.035em',
          fontWeight: '800'
        }],
        // Golden ratio skip: 48px → 32px (not 40px)
        'display-md': ['clamp(2rem, 2.5vw + 1rem, 3rem)', { 
          lineHeight: '1.2', 
          letterSpacing: '-2%',
            fontWeight: '700'
        }],
        'display-sm': ['clamp(1.75rem, 2vw + 0.75rem, 2.5rem)', { 
          lineHeight: '1.25', 
          letterSpacing: '-2%',
          fontWeight: '700'
        }],
        
        // Headings - Structured content (Golden Ratio Hierarchy)
        // Strategic weight pairing: semibold/medium or medium/regular
        'h1': ['clamp(2rem, 2vw + 1rem, 2.25rem)', { 
          lineHeight: '1.2', 
          letterSpacing: '-2%',
          fontWeight: '700'  // Semibold for emphasis
        }],
        'h2': ['clamp(1.5rem, 1.75vw + 0.75rem, 1.875rem)', { 
          lineHeight: '1.25', 
          letterSpacing: '-2%',
          fontWeight: '700'  // Semibold pairs with h1
        }],
        'h3': ['clamp(1.25rem, 1.5vw + 0.5rem, 1.5rem)', { 
          lineHeight: '1.3', 
          letterSpacing: '-2%',
          fontWeight: '500'  // Medium for subtle distinction
        }],
        'h4': ['clamp(1.125rem, 1.25vw + 0.5rem, 1.25rem)', { 
          lineHeight: '1.4', 
          letterSpacing: '-0.015em',
          fontWeight: '500'  // Medium pairs with h3
        }],
        'h5': ['1.125rem', { 
          lineHeight: '1.5', 
          letterSpacing: '-0.01em',
          fontWeight: '500'  // Medium for UI headers
        }],
        'h6': ['1rem', { 
          lineHeight: '1.5', 
          letterSpacing: '-2%',
          fontWeight: '400'  // Regular for smallest headings
        }],
        
        // Body text - Content readability
        'body-xl': ['1.25rem', { 
          lineHeight: '1.75', 
          letterSpacing: '-2%',
          fontWeight: '400'
        }],
        'body-lg': ['1.125rem', { 
          lineHeight: '1.7', 
          letterSpacing: '-2%',
          fontWeight: '400'
        }],
        'body': ['1rem', { 
          lineHeight: '1.65', 
          letterSpacing: '-2%',
          fontWeight: '400'
        }],
        'body-sm': ['0.875rem', { 
          lineHeight: '1.6', 
          letterSpacing: '-2%',
          fontWeight: '400'
        }],
        
        // UI elements - Interface text
        'label': ['0.875rem', { 
          lineHeight: '1.4', 
          letterSpacing: '-2%',
          fontWeight: '500'
        }],
        'caption': ['0.75rem', { 
          lineHeight: '1.4', 
          letterSpacing: '-2%',
          fontWeight: '500'
        }],
        'overline': ['0.625rem', { 
          lineHeight: '1.2', 
          letterSpacing: '-2%',
          fontWeight: '600',
          textTransform: 'uppercase'
        }],
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
        // Semantic text colors for clear hierarchy
        text: {
          primary: '#0f172a',      // slate-900 - Main content, highest emphasis
          secondary: '#334155',    // slate-700 - Secondary content, medium emphasis
          tertiary: '#64748b',     // slate-500 - Tertiary content, low emphasis
          quaternary: '#94a3b8',   // slate-400 - Subtle text, minimal emphasis
          disabled: '#cbd5e1',     // slate-300 - Disabled state
          inverse: '#ffffff',      // white - Dark backgrounds
          link: '#0284c7',         // primary-600 - Interactive links
          linkHover: '#0369a1',    // primary-700 - Link hover state
          success: '#059669',      // emerald-600 - Success messages
          warning: '#d97706',      // amber-600 - Warning messages
          error: '#dc2626',        // red-600 - Error messages
          info: '#0284c7',         // primary-600 - Info messages
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
