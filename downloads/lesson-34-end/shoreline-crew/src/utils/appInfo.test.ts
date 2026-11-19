import { appVersionLine } from './appInfo';

// What app.config.ts gives a preview build (Lesson 9.1): Jest has no build of its own to read
jest.mock('expo-constants', () => ({
  __esModule: true,
  default: { expoConfig: { name: 'Shoreline Preview', slug: 'shoreline-crew', version: '1.0.0' } },
}));

it('names the variant and the version of this build', () => {
  expect(appVersionLine()).toBe('Shoreline Preview, version 1.0.0');
});
