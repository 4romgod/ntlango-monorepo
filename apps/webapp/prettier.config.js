const styleguide = require('@vercel/style-guide/prettier');

module.exports = {
  ...styleguide,
  plugins: [...styleguide.plugins],
  printWidth: 120,
  trailingComma: 'all',
  arrowParens: 'always',
  semi: true,
};
