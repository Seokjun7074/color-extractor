module.exports = {
  content: ['./src/components/**/*.tsx', './src/app/**/*.tsx'],
  theme: {
    extend: {
      colors: {
        black: '#000',
        success: '#0E9F6E',
        error: '#F05252',
      },
      spacing: {
        128: '32rem',
      },
      fontFamily: {
        sans: ['Geist Sans', 'sans-serif'],
      },
    },
  },
};
