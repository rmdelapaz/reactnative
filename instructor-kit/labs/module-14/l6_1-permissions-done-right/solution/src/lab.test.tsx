// Tests (do not edit): npm test
import { focusManager } from '@tanstack/react-query';
import { act, render, screen, userEvent } from '@testing-library/react-native';
import type { PermissionResponse } from 'expo';
import { Text } from 'react-native';

import { AskFirst } from './AskFirst';
import { answers, fakePhone } from './microphone';
import { type Permission, type PermissionStep, permissionStep } from './usePermission';
import { VoiceNotePanel } from './VoiceNotePanel';

// The web preview has no Settings app: expo-linking's openSettings throws there
jest.mock('expo-linking', () => ({
  openSettings: jest.fn(() => Promise.reject(new Error('openSettings is not available on web'))),
}));

beforeEach(() => {
  Object.assign(fakePhone, { current: answers.notAsked, whenAsked: answers.granted, reads: 0, questions: 0 });
});
afterEach(() => focusManager.setFocused(undefined));

const cases: [string, string, PermissionStep, PermissionResponse | null][] = [
  ['still reading', 'ios', 'checking', null],
  ['granted', 'android', 'granted', answers.granted],
  ['never asked', 'ios', 'not-asked', answers.notAsked],
  ['denied, may ask again', 'android', 'denied', answers.denied],
  ['denied, canAskAgain false', 'ios', 'blocked', answers.blocked],
  ['denied in the web preview', 'web', 'blocked', answers.denied],
];
test.each(cases)('Task 1: %s on %s is %s', (_name, os, step, response) => {
  expect(permissionStep(response, os)).toBe(step);
});

const permission = (step: PermissionStep): Permission => ({
  step,
  ask: jest.fn(() => Promise.resolve(answers.granted)),
  check: jest.fn(() => Promise.resolve(answers.granted)),
});
const gate = (p: Permission, onNotNow = jest.fn()) => (
  <AskFirst permission={p} what="your microphone" why="For voice notes." onNotNow={onNotNow}>
    <Text>The feature</Text>
  </AskFirst>
);

test('Task 2: the explanation asks nothing until Continue is pressed', async () => {
  const p = permission('not-asked');
  await render(gate(p));
  expect(screen.getByText('For voice notes.')).toBeOnTheScreen();
  expect(p.ask).not.toHaveBeenCalled();
  expect(screen.queryByText('The feature')).toBeNull();
  await userEvent.setup().press(screen.getByRole('button', { name: 'Continue' }));
  expect(p.ask).toHaveBeenCalledTimes(1);
});

test('Task 2: Not now asks nothing', async () => {
  const p = permission('not-asked');
  const onNotNow = jest.fn();
  await render(gate(p, onNotNow));
  await userEvent.setup().press(screen.getByRole('button', { name: 'Not now' }));
  expect(onNotNow).toHaveBeenCalledTimes(1);
  expect(p.ask).not.toHaveBeenCalled();
});

test('Task 2: blocked: Open Settings, and where there is none, Check again', async () => {
  const p = permission('blocked');
  const user = userEvent.setup();
  await render(gate(p));
  await user.press(screen.getByRole('button', { name: 'Open Settings' }));
  await user.press(screen.getByRole('button', { name: 'Check again' }));
  expect(p.check).toHaveBeenCalledTimes(1);
  expect(p.ask).not.toHaveBeenCalled();
});

test('Task 2: the feature appears only after a yes', async () => {
  await render(gate(permission('granted')));
  expect(screen.getByText('The feature')).toBeOnTheScreen();
});

test('Task 3: nothing is read or asked before the press; then the explanation, then the feature', async () => {
  const user = userEvent.setup();
  await render(<VoiceNotePanel />);
  expect(fakePhone.reads).toBe(0);
  await user.press(screen.getByRole('button', { name: 'Add a voice note' }));
  expect(await screen.findByRole('button', { name: 'Continue' })).toBeOnTheScreen();
  expect(fakePhone.questions).toBe(0);
  await user.press(screen.getByRole('button', { name: 'Continue' }));
  expect(await screen.findByText('Ready: hold Record and talk.')).toBeOnTheScreen();
  expect(fakePhone.questions).toBe(1);
});

test('Task 3: back from Settings, the panel reads the answer again by itself', async () => {
  fakePhone.current = answers.blocked;
  await render(<VoiceNotePanel />);
  await userEvent.setup().press(screen.getByRole('button', { name: 'Add a voice note' }));
  expect(await screen.findByRole('button', { name: 'Open Settings' })).toBeOnTheScreen();
  fakePhone.current = answers.granted; // the volunteer allowed it in Settings...
  await act(async () => {
    focusManager.setFocused(false); // ...while the app was in the background
    focusManager.setFocused(true);
  });
  expect(await screen.findByText('Ready: hold Record and talk.')).toBeOnTheScreen();
  expect(fakePhone.questions).toBe(0);
});
