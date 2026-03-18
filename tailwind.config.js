/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Kiro Design System Colors
        'kiro-bg': '#0a0a0f',
        'kiro-sidebar': '#12121a',
        'kiro-editor': '#0a0a0f',
        'kiro-terminal': '#0a0a0f',
        'kiro-tab': '#1a1a25',
        'kiro-tab-active': '#12121a',
        'kiro-border': '#2a2a3a',
        'kiro-text': '#e4e4ed',
        'kiro-text-dim': '#8888a0',
        'kiro-accent': '#7c5cfc',
        'kiro-success': '#4a9eff',
        'kiro-warning': '#9d85fc',
        'kiro-error': '#f14c4c',
      },
      fontFamily: {
        mono: ['Consolas', 'Monaco', 'Courier New', 'monospace'],
      },
      animation: {
        'cursor-blink': 'blink 1s step-end infinite',
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0 },
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        slideIn: {
          '0%': { transform: 'translateY(-10px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
      },
    },
  },
  plugins: [],
}
