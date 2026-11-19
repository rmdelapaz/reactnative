// Tests (do not edit): npm test. Jest has no share sheet, so the tests stand in for Share.share.
import { render, screen, userEvent } from '@testing-library/react-native';
import { Share } from 'react-native';

import e08 from '../fixtures/event-e08.json';
import { ShareButton } from './ShareButton';
import type { CleanupEvent } from './types';

// Jest is neither a build nor Expo Go: this stands in for createURL as a build of the app answers it
jest.mock('expo-linking', () => ({
  createURL: (path: string) => `shorelinecrew://${path.replace(/^\//, '')}`,
}));
const event: CleanupEvent = e08; // a real answer of GET /api/events/e08

afterEach(() => jest.restoreAllMocks());

test('Task 2: the link travels inside the message (Android shares only title and message)', async () => {
  const user = userEvent.setup();
  const share = jest.spyOn(Share, 'share').mockResolvedValue({ action: Share.sharedAction, activityType: undefined });
  await render(<ShareButton event={event} />);
  await user.press(screen.getByRole('button', { name: 'Share this cleanup' }));
  expect(share).toHaveBeenCalledTimes(1);
  const content = share.mock.calls[0][0];
  expect(content.title).toBe('Weekend Cove Cleanup');
  expect(content.message).toBe(
    [
      'Join me at Weekend Cove Cleanup (Driftwood Cove)!',
      'Meet at Top of the Cove Lane stairs, 09:00.',
      'shorelinecrew://cleanups/e08',
    ].join('\n'),
  );
  expect(screen.queryByText(/Copy this link instead/)).toBeNull();
});

test('Task 2: no share sheet here: the link to copy appears, and can be selected', async () => {
  const user = userEvent.setup();
  // what react-native-web does in a desktop browser without navigator.share (Lesson 4.4 measured it)
  jest.spyOn(Share, 'share').mockRejectedValue(new Error('Share is not supported in this browser'));
  await render(<ShareButton event={event} />);
  await user.press(screen.getByRole('button', { name: 'Share this cleanup' }));
  const fallback = await screen.findByText(
    'Sharing is not available here. Copy this link instead: shorelinecrew://cleanups/e08',
  );
  expect(fallback.props.selectable).toBe(true);
});
