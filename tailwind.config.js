/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Core colors
        bg: { 
          900: '#070709' // Deep-space black, eye-friendly
        },
        panel: 'rgba(255,255,255,0.06)', // Frosted glass panels
        primary: '#00E5EE', // CTAs & key links
        accent: '#FF6D9C', // Hover glow, hot tags
        gradientAI: { 
          100: '#0090FF',
          200: '#FF6D9C',
          300: '#FB7E16' 
        },
        // States with +10% saturation to pop over dark canvas
        success: '#22E570',
        warning: '#FADC15',
        error: '#F87878',
      },
      backgroundImage: {
        // AI Gradient for button borders, progress bars
        'ai-gradient': 'linear-gradient(90deg,#FFF -4%,#0090FF 22%,#FF6D9C 48%,#FB7E16 74%,#FFF 100%)',
        'ai-shimmer': 'linear-gradient(90deg,transparent,rgba(255,255,255,0.08),transparent)',
        // Particle effects
        'matrix-sparkle': 'radial-gradient(circle at center, rgba(0,229,238,0.15) 0%, rgba(0,0,0,0) 70%)',
      },
      boxShadow: {
        neon: '0 0 12px var(--c-primary)',
        'neon-accent': '0 0 12px var(--c-accent)',
        glass: '0 8px 32px rgba(0, 0, 0, 0.2)',
        'card-hover': '0 8px 32px rgba(0, 0, 0, 0.3)',
      },
      fontFamily: {
        // Typography (Google Fonts)
        display: ['"Sora Variable"', 'sans-serif'],
        body: ['"Work Sans Variable"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      borderRadius: {
        'card': '16px',
        'button': '12px',
      },
      // Motion & Interaction
      transitionDuration: {
        'fast': '140ms', // Button hover
        'medium': '400ms', // Skeleton loading
        'slow': '600ms', // Page transitions
      },
      transitionTimingFunction: {
        'standard': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'spring': 'cubic-bezier(0.43, 0.13, 0.23, 0.96)', // Spring effect for page transitions
      },
      // Layout & Composition - 8px atomic grid with "fractured" columns
      gridTemplateColumns: {
        'overview': '1fr',
        'signals': 'repeat(auto-fit, minmax(300px, 1fr))',
        'desktop-nav': '64px 1fr',
      },
      spacing: {
        'grid-gap': '24px', // Base grid gap
      },
      animation: {
        'skeleton': 'shimmer 1.5s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'gradient-ring': 'gradient-ring 3s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'matrix-particles': 'matrix-particles 15s linear infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 0 rgba(0, 229, 238, 0)' },
          '50%': { boxShadow: '0 0 15px rgba(0, 229, 238, 0.5)' },
        },
        'gradient-ring': {
          '0%': { backgroundPosition: '0% 0%' },
          '100%': { backgroundPosition: '400% 0%' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'matrix-particles': {
          '0%': { transform: 'translateY(0) translateX(0)' },
          '100%': { transform: 'translateY(-100vh) translateX(10vw)' },
        },
      },
      fontSize: {
        'display': 'clamp(2.4rem, 4vw, 4rem)',
      },
      lineHeight: {
        'display': '1.1',
        'body': '1.6',
      },
      backdropBlur: {
        'glass': '8px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('tailwindcss-animate'),
  ],
}