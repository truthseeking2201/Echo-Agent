/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Core colors as defined in the UI revamp spec
        bg: { 
          900: '#050507', // Canvas - primary
          800: '#0D0F12'  // Canvas - alt
        },
        surface: 'rgba(255,255,255,0.06)', // Surface / Panel with backdrop-filter
        primary: '#00E5EE', // Action / Brand
        'accent-pink': '#FF6D9C', // Accent A 
        'accent-orange': '#FB7E16', // Accent B
        'accent': '#FF6D9C', // Legacy accent color for compatibility
        // Enhanced AI color palette
        ai: {
          blue: '#0090FF',
          purple: '#A855F7',
          pink: '#FF6D9C',
          orange: '#FB7E16',
          cyan: '#00E5EE'
        },
        // States with +10% saturation to pop over dark canvas
        success: '#22E570',
        warning: '#FADC15',
        error: '#F87878',
      },
      backgroundImage: {
        // Gradient AI as defined in the UI revamp spec
        'gradient-ai': 'linear-gradient(90deg,#00E5EE,#A855F7,#FF6D9C,#FB7E16)',
        'ai-vibrant': 'linear-gradient(90deg,#00E5EE,#A855F7,#FF6D9C)',
        'ai-shimmer': 'linear-gradient(90deg,transparent,rgba(255,255,255,0.08),transparent)',
        // Particle effects
        'matrix-sparkle': 'radial-gradient(circle at center, rgba(0,229,238,0.15) 0%, rgba(0,0,0,0) 70%)',
      },
      boxShadow: {
        soft: '0 2px 4px 6px rgba(0,0,0,.24)', // shadow-soft
        neon: '0 0 12px var(--tw-gradient-stops)', // shadow-neon
        'neon-accent': '0 0 12px var(--c-accent-pink)',
        glass: '0 8px 32px rgba(0, 0, 0, 0.2)',
        'card-hover': '0 8px 32px rgba(0, 0, 0, 0.3)',
        'ai-glow': '0 0 20px rgba(0, 229, 238, 0.4)',
      },
      fontFamily: {
        // Typography as defined in the UI revamp spec
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"DM Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      borderRadius: {
        'card': '16px',
        'button': '12px',
      },
      // Motion & Interaction tokens from the UI revamp spec
      transitionDuration: {
        'fast': '0.14s', // t-fast from spec
        'medium': '0.32s', // t-medium from spec
        'route': '0.45s', // t-route from spec
      },
      transitionTimingFunction: {
        'standard': 'cubic-bezier(0.4, 0, 0.2, 1)', // curve-standard
        'spring': 'cubic-bezier(0.43, 0.13, 0.23, 0.96)', // curve-spring
      },
      // Layout & Composition - 8pt base grid with breakpoints as defined in the spec
      gridTemplateColumns: {
        'overview': '1fr',
        'signals': 'repeat(auto-fit, minmax(300px, 1fr))',
        'desktop-nav': '64px 1fr',
        // Bento layout breakpoints
        'bento-lg': 'repeat(12, 1fr)', // ≥ 1536px
        'bento-md': 'repeat(8, 1fr)',  // 768-1535px
        'bento-sm': 'repeat(4, 1fr)',  // ≤ 767px
      },
      spacing: {
        'grid-gap': '24px', // Base grid gap for large screens
        'grid-gap-md': '16px', // Medium screens
        'grid-gap-sm': '12px', // Small screens
      },
      animation: {
        'ai-shimmer': 'shimmer 1.5s ease-in-out infinite', // ai-shimmer animation
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'gradient-ring': 'gradient-ring 3s linear infinite',
        'gradient-flow': 'gradient-flow 3s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'matrix-particles': 'matrix-particles 15s linear infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 0 rgba(0, 229, 238, 0)' },
          '50%': { boxShadow: '0 0 15px rgba(0, 229, 238, 0.5)' },
        },
        'gradient-ring': {
          '0%': { backgroundPosition: '0% 0%' },
          '100%': { backgroundPosition: '400% 0%' },
        },
        'gradient-flow': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
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
        // Typography from UI revamp spec
        'display': ['48px', '56px'], // Display - 48/56
        'heading': ['32px', '40px'], // Heading - 32/40
        'subhead': ['24px', '32px'], // Sub-head - 24/32
        'body': ['16px', '24px'],    // Body - 16/24
        'caption': ['14px', '20px'],  // Caption - 14/20
        'code': ['14px', '20px'],     // Code/Data - 14/20
      },
      letterSpacing: {
        'display': '-0.01em', // -1% on headings
      },
      backdropBlur: {
        'glass': '8px', // As defined in the UI revamp spec
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('tailwindcss-animate'),
  ],
}