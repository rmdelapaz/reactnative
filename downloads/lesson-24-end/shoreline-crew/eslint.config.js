// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    // dist: export output; src/api/types.ts: a copy of the API's contract, never edited
    ignores: ['dist/*', 'src/api/types.ts'],
  },
]);
