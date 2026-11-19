import { act, renderHook } from '@testing-library/react-native';
import { Dimensions } from 'react-native';

import { useLargeText } from '@/hooks/useLargeText';

// What the phone tells the app when the person changes the text size in Settings
function changeTextSize(fontScale: number) {
  const window = { ...Dimensions.get('window'), fontScale };
  Dimensions.set({ window, screen: window });
}

it('is false at the normal text size', async () => {
  const { result } = await renderHook(() => useLargeText());
  expect(result.current).toBe(false);
});

it('follows the text size while the app is open, from one and a half times', async () => {
  const { result } = await renderHook(() => useLargeText());
  await act(() => changeTextSize(1.35)); // the largest standard size on an iPhone
  expect(result.current).toBe(false);
  await act(() => changeTextSize(2)); // the largest size on many Android phones
  expect(result.current).toBe(true);
});
