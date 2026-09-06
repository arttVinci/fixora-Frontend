
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Industrial Green Theme Palette
        industrial: {
          bg: '#0D0F0E',
          surface: '#161918',
          'surface-card': '#161918',
          'surface-elevated': '#1F2422',
          border: '#2A2E2C',
          text: '#F2F2F0',
          'text-muted': '#9BA39E',
        },

        primary: {
          50: '#e8f5e9',
          100: '#c8e6c9',
          200: '#a5d6a7',
          300: '#81c784',
          400: '#4caf50',
          500: '#2e7d32', // Primary Engineering Green
          600: '#1b5e20', // Forest Green
          700: '#144717',
          800: '#0e3010',
          900: '#081a09',
          950: '#040d05',
        },

        secondary: {
          50: '#f1f8e9',
          100: '#dcedc8',
          200: '#c5e1a5',
          300: '#aed581',
          400: '#9ccc65',
          500: '#7cb342',
          600: '#689f38',
          700: '#558b2f',
          800: '#33691e',
          900: '#1b5e20',
          950: '#0e3010',
        },

        dark: {
          surface: '#0D0F0E',
          'surface-low': '#161918',
          'surface-high': '#1F2422',
          border: '#2A2E2C',
        },

        fixora: {
          dark: '#0D0F0E',
          primary: '#2E7D32',
          accent: '#4CAF50',
          forest: '#1B5E20',
          light: '#F2F2F0',
          muted: '#9BA39E',
          border: '#2A2E2C',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        heading: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      animation: {
        'hero-reveal': 'hero-reveal 0.8s cubic-bezier(0.16, 1, 0.3, 1) both',
        'scroll-fade': 'scroll-fade 2s ease-in-out infinite',
        'spin-slow': 'spin-slow 6s linear infinite',
        'float-in': 'float-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) both',
        'chat-bounce': 'chat-bounce 1.2s ease-in-out infinite',
        'slide-up': 'slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1) both',
        'fade-in': 'fade-in 0.6s ease-out both',
      },
      keyframes: {
        floating: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        floatingSlow: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-16px)' },
        },
        'hero-reveal': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scroll-fade': {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
        'spin-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'float-in': {
          '0%': { opacity: '0', transform: 'translateY(12px) scale(0.95)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        'chat-bounce': {
          '0%, 60%, 100%': { opacity: '0.3', transform: 'translateY(0)' },
          '30%': { opacity: '1', transform: 'translateY(-3px)' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      boxShadow: {
        floating: '0 30px 60px rgba(0,0,0,.5)',
        premium: '0 40px 80px rgba(0,0,0,.6)',
        chat: '0 20px 40px rgba(0, 0, 0, 0.4)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}