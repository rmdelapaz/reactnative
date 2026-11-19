// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    // dist: export output; src/mocks: bookmobile-api's code; src/api/types.ts: a copy of the API's contract
    ignores: ['dist/*', 'src/mocks/*', 'src/api/types.ts'],
  },
]);
