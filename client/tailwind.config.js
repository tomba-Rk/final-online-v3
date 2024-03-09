module.exports = {
    mode: 'jit',
    purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
    darkMode: false, // or 'media' or 'class'
    theme: {
      extend: {
        colors: {
          'custom-green': '#1FD882',
          'custom-purple': '#8949F5',
          gold: {
            500: '#ffd700', // Example gold color HEX code.
          },
        },
      },
    },
    variants: {
      extend: {},
    },
    plugins: [],
  };