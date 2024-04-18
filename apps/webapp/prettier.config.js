const styleguide = require('@vercel/style-guide/prettier');

module.exports = {
  ...styleguide,
  printWidth: 120,
  plugins: [...styleguide.plugins, 'prettier-plugin-tailwindcss'],
};
