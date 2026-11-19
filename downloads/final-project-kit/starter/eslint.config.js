// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    // dist: export output; coverage: npm test -- --coverage
    ignores: ['dist/*', 'coverage/*'],
  },
]);
