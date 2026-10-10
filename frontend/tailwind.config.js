/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        nature: {
          50: '#F4F7F4',
          100: '#E4EDE4',
          200: '#CADBCA',
          300: '#A4C0A4',
          400: '#7AA37A',
          500: '#588758',
          600: '#436C43',
          700: '#355535',
          800: '#2A432A',
          900: '#1F321F',
          950: '#0E1B0E',
        },
        sage: {
          50: '#F6F8F5',
          100: '#EAEFE9',
          200: '#D5DFD3',
          300: '#B5C7B3',
          400: '#92AB90',
          500: '#758F73',
          600: '#5C735A',
          700: '#485A47',
          800: '#3C493B',
          900: '#323E32',
        },
        forest: {
          50: '#EFF6F2',
          100: '#DCECE2',
          200: '#BCDBC9',
          300: '#91C2A5',
          400: '#64A47E',
          500: '#41865E',
          600: '#2F6B4A',
          700: '#26553C',
          800: '#214432',
          900: '#1C392B',
          950: '#0D1F17',
        },
        cream: {
          50: '#FDFBF7',
          100: '#FAF6EE',
          200: '#F4ECD9',
          300: '#ECE0C0',
          400: '#E0CCA2',
          500: '#D1B480',
        },
        earth: {
          50: '#FAF6F0',
          100: '#F3EADF',
          200: '#E6D4BF',
          300: '#D5BA9B',
          400: '#C29C77',
          500: '#A97C55',
          600: '#8E6342',
          700: '#6E4C33',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['Newsreader', 'Georgia', 'serif'],
      },
      boxShadow: {
        'soft': '0 4px 24px -2px rgba(28, 57, 43, 0.08)',
        'card': '0 8px 30px rgba(28, 57, 43, 0.06)',
        'glow': '0 0 25px rgba(65, 134, 94, 0.25)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        sway: {
          '0%, 100%': { transform: 'rotate(-2deg)' },
          '50%': { transform: 'rotate(2deg)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        }
      },
      animation: {
        float: 'float 4s ease-in-out infinite',
        sway: 'sway 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2.5s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}
