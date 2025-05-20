/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3B82F6', // Primary blue
          glow: 'rgba(59, 130, 246, 0.25)',
        },
        ink: '#6366F1', // Accent / focus ink
        body: '#0D1117', // App background
        surface: {
          DEFAULT: 'rgba(255, 255, 255, 0.05)', // Glassmorphic panels
          card: 'rgba(255, 255, 255, 0.07)',
          dark: 'rgba(0, 0, 0, 0.2)',
        },
        success: '#22C55E', // PnL positive
        warning: '#FACC15', // Medium confidence
        error: '#F87171', // PnL negative
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
        mono: ['DM Mono', 'monospace'],
      },
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '16px',
        'lg': '24px',
        'xl': '32px',
        'grid-gap': '24px',
      },
      borderRadius: {
        'card': '16px',
        'button': '12px',
      },
      transitionDuration: {
        'fast': '90ms',
        'medium': '200ms',
        'slow': '260ms',
        'lazy': '600ms',
      },
      transitionTimingFunction: {
        'standard': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      gridTemplateColumns: {
        'desktop': '220px 1fr 340px',
        'tablet': '64px 1fr',
      },
      boxShadow: {
        'glow': '0 4px 20px rgba(59, 130, 246, 0.25)',
        'glow-intense': '0 8px 32px rgba(59, 130, 246, 0.35)',
      },
      backdropBlur: {
        'xs': '4px',
        'sm': '8px',
      },
      animation: {
        'skeleton': 'skeleton-loading 1.5s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
      },
      keyframes: {
        'skeleton-loading': {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 0 rgba(59, 130, 246, 0)' },
          '50%': { boxShadow: '0 0 15px rgba(59, 130, 246, 0.3)' },
        },
      },
      fontSize: {
        'display': 'clamp(2.4rem, 4vw, 4rem)',
      },
      lineHeight: {
        'display': '1.1',
      },
    },
  },
  plugins: [],
  darkMode: 'class', // This isn't actually needed since we're dark-only for the demo
}