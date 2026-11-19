// C1: the specification (do not edit). Run: npm test -- src/c1.test.tsx
import { render, screen, userEvent } from '@testing-library/react-native';

import { CleanupRow } from './CleanupRow';

it('C1: the title is a heading', async () => {
  await render(<CleanupRow title="Tide Pool Morning Cleanup" spotsLeft={5} onJoin={jest.fn()} />);
  expect(screen.getByRole('header', { name: 'Tide Pool Morning Cleanup' })).toBeOnTheScreen();
});

it('C1: Join is a button whose name starts with its words, and one press joins once', async () => {
  const onJoin = jest.fn();
  const user = userEvent.setup();
  await render(<CleanupRow title="Tide Pool Morning Cleanup" spotsLeft={5} onJoin={onJoin} />);
  const join = screen.getByRole('button', { name: 'Join Tide Pool Morning Cleanup' });
  expect(join).toHaveTextContent('Join');
  await user.press(join);
  expect(onJoin).toHaveBeenCalledTimes(1);
});

it('C1: the wave is decoration', async () => {
  await render(<CleanupRow title="Tide Pool Morning Cleanup" spotsLeft={5} onJoin={jest.fn()} />);
  expect(screen.queryByText('🌊')).toBeNull();
  expect(screen.getByText('🌊', { includeHiddenElements: true })).toBeOnTheScreen();
});

it('C1: a full cleanup says so, and its Join button is switched off', async () => {
  const onJoin = jest.fn();
  const user = userEvent.setup();
  await render(<CleanupRow title="Weekend Cove Cleanup" spotsLeft={0} onJoin={onJoin} />);
  expect(screen.getByText('Full')).toBeOnTheScreen();
  const join = screen.getByRole('button', { name: 'Join Weekend Cove Cleanup' });
  expect(join).toBeDisabled();
  await user.press(join);
  expect(onJoin).not.toHaveBeenCalled();
});
