/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./*.html",
        "./**/*.html",
        "./js/**/*.js",
      ],
  theme: {
    extend: {
      colors: {
        primary: '#1a2744',
        secondary: '#8b2635',
        accent: '#ffffff',
        dark: '#1a2744',
        light: '#f3f4f6',
        maroon: '#8b2635',
        maroonDark: '#6b1a1a',
        navy: '#1a2744',
        navyLight: '#2a3754',
        gradientStart: '#1a2744',
        gradientEnd: '#8b2635',
      },
      backgroundImage: {
        'gradient-royal': 'linear-gradient(135deg, #1a2744 0%, #8b2635 100%)',
        'gradient-royal-light': 'linear-gradient(135deg, #2a3754 0%, #a63645 100%)',
      },
      animation: {
        'spin': 'spin 1s linear infinite',
      },
    },
  },
  plugins: [],
}
