// Tests (do not edit): npm test
import { act, render, screen } from '@testing-library/react-native';
import * as ReactNative from 'react-native';

import sites from '../fixtures/sites.json';
import { SiteGrid } from './SiteGrid';
import { SiteTile } from './SiteTile';
import { contrast } from './theme/contrast';
import { darkColors, lightColors } from './theme/palettes';

const beach = sites[0];
// Text drawn on top of a background, in both palettes: each pair needs 4.5:1
const pairs = [['text', 'surface'], ['textMuted', 'surface'], ['text', 'page'], ['onAccent', 'accent']] as const;

afterEach(() => jest.restoreAllMocks());

test('Task 1: every text pair reads at 4.5:1 or more, by day and by night', () => {
  const failing: string[] = [];
  for (const [scheme, colors] of [['light', lightColors], ['dark', darkColors]] as const) {
    for (const [fg, bg] of pairs) {
      const [a, b] = [(colors as Record<string, string>)[fg], (colors as Record<string, string>)[bg]];
      if (!a || !b) failing.push(`${scheme}: ${!a ? fg : bg} is missing`);
      else if (contrast(a, b) < 4.5) failing.push(`${scheme}: ${fg} on ${bg} is ${contrast(a, b).toFixed(2)}:1`);
    }
  }
  expect(failing).toEqual([]);
});

test('Task 2: by day the tile is white', async () => {
  jest.spyOn(ReactNative, 'useColorScheme').mockReturnValue('light');
  await render(<SiteTile site={beach} />);
  expect(screen.getByTestId('tile')).toHaveStyle({ backgroundColor: lightColors.surface });
});

test('Task 2: at night (the phone in dark mode) the tile uses the night surface', async () => {
  jest.spyOn(ReactNative, 'useColorScheme').mockReturnValue('dark');
  await render(<SiteTile site={beach} />);
  expect(screen.getByTestId('tile')).toHaveStyle({ backgroundColor: darkColors.surface });
  expect(screen.getByText(beach.name)).toHaveStyle({ color: darkColors.text });
});

test('Task 3: a phone (390 wide) gets one column', async () => {
  await render(<SiteGrid sites={sites.slice(0, 4)} />);
  expect(screen.getAllByTestId('row')).toHaveLength(4);
});

test('Task 3: widen the window to 1024 and the tiles go two by two', async () => {
  await render(<SiteGrid sites={sites.slice(0, 4)} />);
  const tablet = { width: 1024, height: 768, scale: 2, fontScale: 1 };
  await act(async () => ReactNative.Dimensions.set({ window: tablet, screen: tablet }));
  expect(screen.getAllByTestId('row')).toHaveLength(2);
});
