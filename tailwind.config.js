/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./www/index.html', './www/app.js'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Consolas', 'monospace']
      }
    }
  }
};
