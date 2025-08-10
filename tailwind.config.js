/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'quantum-dark': '#141720',
        'quantum-dark-secondary': '#1F1F2B',
        'quantum-purple': '#D3C1EE',
        'quantum-purple-deep': '#513485',
        'quantum-gray-light': '#DDDDDF',
        'quantum-gray-medium': '#BBBBC0',
        'quantum-gray-dark': '#AFAFB5',
        'quantum-ai-bg': '#383738',
        'quantum-ai-text': '#848484',
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      }
    }
  },
  plugins: [],
};
