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
        primary: '#2E90E6',
        secondary: '#C9A227',
        accent: '#F4E4BC',
        dark: '#1b3a5b',
        light: '#f3f7fb',
        gold: '#C9A227',
        goldDark: '#A8811B',
        blue: '#2E90E6',
        blueLight: '#5AA9E6',
        navy: '#1b3a5b',
        navyLight: '#2a5a86',
        gradientStart: '#2E90E6',
        gradientEnd: '#C9A227',
      },
      backgroundImage: {
        'gradient-royal': 'linear-gradient(135deg, #2E90E6 0%, #C9A227 100%)',
        'gradient-royal-light': 'linear-gradient(135deg, #5AA9E6 0%, #E0C044 100%)',
      },
      animation: {
        'spin': 'spin 1s linear infinite',
      },
    },
  },
  plugins: [],
}
