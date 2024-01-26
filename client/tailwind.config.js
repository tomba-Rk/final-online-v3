module.exports = {
    mode: 'jit',
    purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
    darkMode: false, // or 'media' or 'class'
    theme: {
      extend: {
        colors: {
          'custom-green': '#1FD882',
          'custom-purple': '#8949F5',
        },
      },
    },
    variants: {
      extend: {},
    },
    plugins: [],
  };