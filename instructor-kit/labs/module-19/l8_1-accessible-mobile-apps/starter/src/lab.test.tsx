// Tests (do not edit): npm test
// React Native Testing Library finds elements the way a screen reader meets them: by role and by name, and it
// skips what is hidden from screen readers unless a query asks for hidden elements too.
import { act, render, screen, userEvent } from '@testing-library/react-native';
import { AccessibilityInfo, Dimensions } from 'react-native';

import { PackingItem } from './PackingItem';
import { SyncStatus } from './SyncStatus';
import { TideTiles } from './TideTiles';

beforeEach(() => jest.clearAllMocks()); // each test counts its own announcements

test('Task 1: one stop: a checkbox called Gloves, with its state', async () => {
  await render(<PackingItem label="Gloves" packed onToggle={() => {}} />);
  expect(screen.getAllByRole('checkbox', { name: 'Gloves' })).toHaveLength(1);
  expect(screen.getByRole('checkbox', { name: 'Gloves' })).toBeChecked();
  expect(screen.queryByRole('button')).toBeNull();
  expect(screen.queryByText('☑')).toBeNull(); // the picture of the state is not read
});

test('Task 1: the whole row is a finger-sized target', async () => {
  const toggles: boolean[] = [];
  await render(<PackingItem label="Gloves" packed={false} onToggle={(packed) => toggles.push(packed)} />);
  expect(screen.getByRole('checkbox', { name: 'Gloves' })).toHaveStyle({ minHeight: 48 });
  await userEvent.setup().press(screen.getByText('Gloves'));
  expect(toggles).toEqual([true]);
});

test('Task 2: VoiceOver hears a new message, queued', async () => {
  const announce = jest.spyOn(AccessibilityInfo, 'announceForAccessibilityWithOptions');
  const view = await render(<SyncStatus message="Uploading 2 photos…" />);
  await view.rerender(<SyncStatus message="2 photos uploaded" />);
  expect(announce.mock.calls).toEqual([
    ['Uploading 2 photos…', { queue: true }],
    ['2 photos uploaded', { queue: true }],
  ]);
});

test('Task 2: the same words are not said twice, and nothing is said for no words', async () => {
  const announce = jest.spyOn(AccessibilityInfo, 'announceForAccessibilityWithOptions');
  const view = await render(<SyncStatus message="" />);
  await view.rerender(<SyncStatus message="2 photos uploaded" />);
  await view.rerender(<SyncStatus message="2 photos uploaded" />);
  expect(announce).toHaveBeenCalledTimes(1);
});

test('Task 3: every text grows with the phone setting', async () => {
  await render(<TideTiles low="6:40" high="12:55" />);
  for (const text of ['6:40', 'Low tide', '12:55', 'High tide']) {
    expect(screen.getByText(text).props.allowFontScaling).not.toBe(false);
  }
});

test('Task 3: side by side at the normal size, stacked at large text', async () => {
  await render(<TideTiles low="6:40" high="12:55" />);
  expect(screen.getByTestId('tides')).toHaveStyle({ flexDirection: 'row' });
  const large = { width: 390, height: 844, scale: 3, fontScale: 2 };
  await act(async () => Dimensions.set({ window: large, screen: large }));
  expect(screen.getByTestId('tides')).toHaveStyle({ flexDirection: 'column' });
});
