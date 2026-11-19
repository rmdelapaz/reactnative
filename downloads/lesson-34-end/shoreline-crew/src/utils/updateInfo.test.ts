import { canCheckForUpdates, type RunningCode, runningCodeLine } from './updateInfo';

// A preview build that has downloaded and started one update
const updated: RunningCode = {
  where: 'build',
  isEnabled: true,
  channel: 'preview',
  updateId: '0f3a9c2e-5b1d-4e8a-9c7f-2d6b8e1a4c90',
  isEmbeddedLaunch: false,
  createdAt: new Date('2030-04-02T17:30:00Z'),
};

it('names the channel and the update a build is running', () => {
  expect(runningCodeLine(updated)).toBe(
    'Updates: on (channel preview). Running update 0f3a9c2e, published 2030-04-02.',
  );
  expect(canCheckForUpdates(updated)).toBe(true);
});

it('says when a build still runs the code it came with', () => {
  const embedded = { ...updated, updateId: null, isEmbeddedLaunch: true, createdAt: null };
  expect(runningCodeLine(embedded)).toBe(
    'Updates: on (channel preview). Running the code this build came with.',
  );
});

it('never offers a check in development, on the web or with updates off', () => {
  for (const code of [
    { ...updated, where: 'development' as const },
    { ...updated, where: 'web' as const },
    { ...updated, isEnabled: false },
  ]) {
    expect(canCheckForUpdates(code)).toBe(false);
  }
  expect(runningCodeLine({ ...updated, isEnabled: false })).toBe(
    'Updates: off. This build runs the code it was built with.',
  );
});
