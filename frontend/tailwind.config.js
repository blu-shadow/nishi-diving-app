/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Nishi Diving Brand Colors
        ocean: {
          50:  '#eef9ff',
          100: '#d8f0ff',
          200: '#b9e5ff',
          300: '#89d7ff',
          400: '#51bfff',
          500: '#29a0ff',
          600: '#0e7ef5',
          700: '#0767e1',
          800: '#0c52b6',
          900: '#10468f',
          950: '#0d2c5e',
        },
        nishi: {
          primary:   '#0e7ef5',
          secondary: '#0d2c5e',
          accent:    '#00d4aa',
          dark:      '#0a1628',
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in':    'fadeIn 0.3s ease-in-out',
        'slide-up':   'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-dot': 'bounceDot 1.4s infinite ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)',    opacity: '1' },
        },
        slideDown: {
          '0%':   { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)',     opacity: '1' },
        },
        bounceDot: {
          '0%, 80%, 100%': { transform: 'scale(0)' },
          '40%':            { transform: 'scale(1)' },
        }
      },
      boxShadow: {
        'card':   '0 2px 15px -3px rgba(0,0,0,0.07), 0 10px 20px -2px rgba(0,0,0,0.04)',
        'ocean':  '0 4px 20px rgba(14, 126, 245, 0.25)',
        'nav':    '0 -4px 20px rgba(0,0,0,0.08)',
      },
      borderRadius: {
        'xl':  '1rem',
        '2xl': '1.25rem',
        '3xl': '1.5rem',
      }
    },
  },
  plugins: [],
}
