// The Jest environment (Lesson 8.2). Expo SDK 58 swaps the global fetch for Expo's own
// (expo/fetch), which only works inside the app on a phone: under Jest it answers nothing.
// This keeps Node's fetch under another name; jest.setup.ts puts it back for the tests.
const { TestEnvironment } = require('jest-expo/src/preset/nativeEnvironment');

module.exports = class AppEnvironment extends TestEnvironment {
  constructor(config, context) {
    super(config, context);
    this.global.__nodeFetch = this.global.fetch;
  }
};
