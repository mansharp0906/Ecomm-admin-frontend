module.exports = {
  content: [
    './app/**/*.html',
    './app/components/**/*.js',
    './app/containers/**/*.js',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        josefin: ['Josefin', 'sans-serif'],
        figtree: [
          'Figtree',
          'Segoe UI',
          'Helvetica Neue',
          'Helvetica',
          'Arial',
          'sans-serif',
        ],
      },
      fontSize: {
        10: '10px',
        12: '12px',
        14: '14px',
        15: '15px',
        16: '16px',
        18: '18px',
        20: '20px',
        22: '22px',
        24: '24px',
        26: '26px',
        36: '36px',
        46: '46px',
        76: '76px',
      },
      colors: {
        primary: {
          100: '#081420',
          200: '#192431',
          300: '#6D5AE6',
          400: '#1BCE93',
          500: '#FFFFFF',
          600: '#ffffff14',
          700: '#F9B223',
          800: '#ECECEC',
          900: '#B1B1B5',
          1000: '#70798B',
          1100: '#2B3541',
        },
      },
      borderRadius: {
        20: '20px',
      },
    },
    screens: {
      sm: '	640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '2rem',
        lg: '4rem',
        xl: '5rem',
        '2xl': '6rem',
      },
    },
  },
};
