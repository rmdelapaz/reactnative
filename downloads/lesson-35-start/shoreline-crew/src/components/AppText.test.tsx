import { render, screen } from '@testing-library/react-native';
import { AccessibilityInfo, Platform } from 'react-native';

import { AppText } from '@/components/AppText';

// React Native's Jest setup already replaced AccessibilityInfo with stand-ins that only record
// their calls: jest.mocked() reads VoiceOver's "say this now" with its mock types
const announce = jest.mocked(AccessibilityInfo.announceForAccessibilityWithOptions);
afterEach(() => {
  announce.mockClear(); // forget what the last test said
  jest.restoreAllMocks(); // and undo jest.replaceProperty
});

it('asks VoiceOver to say a live text when it appears and when its words change', async () => {
  const { rerender } = await render(<AppText accessibilityLiveRegion="polite">Sending…</AppText>);
  expect(announce).toHaveBeenCalledWith('Sending…', { queue: true });

  await rerender(<AppText accessibilityLiveRegion="polite">Log sent. Thank you!</AppText>);
  expect(announce).toHaveBeenLastCalledWith('Log sent. Thank you!', { queue: true });
  expect(announce).toHaveBeenCalledTimes(2);
});

it('keeps quiet about text that is not live', async () => {
  await render(<AppText>Upcoming cleanups</AppText>);
  expect(screen.getByText('Upcoming cleanups')).toBeOnTheScreen();
  expect(announce).not.toHaveBeenCalled();
});

it('leaves it to the live region on Android', async () => {
  jest.replaceProperty(Platform, 'OS', 'android');
  await render(<AppText accessibilityLiveRegion="polite">Sending…</AppText>);
  expect(announce).not.toHaveBeenCalled();
});
