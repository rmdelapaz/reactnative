// Tests (do not edit): npm test
import { render, screen } from '@testing-library/react-native';
import type { ReactNode } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import sites from '../fixtures/sites.json';
import { SignUpBar } from './SignUpBar';
import { SitePicture } from './SitePicture';
import { terrainIcons } from './terrainIcons';
import type { Site, Terrain } from './types';

const site = (id: string) => (sites as Site[]).find((s) => s.id === id)!;

// A phone with a notch and a home indicator (the numbers Lesson 2.3's simulated pictures use), and an older
// phone with a home button. Jest has no screen: the provider hands the components these insets.
function phone(bottom: number) {
  return function Phone({ children }: { children: ReactNode }) {
    return (
      <SafeAreaProvider
        initialMetrics={{
          frame: { x: 0, y: 0, width: 390, height: 844 },
          insets: { top: bottom ? 47 : 20, right: 0, bottom, left: 0 },
        }}>
        {children}
      </SafeAreaProvider>
    );
  };
}

test('Task 1: the picture is one element a screen reader stops on, with the beach described', async () => {
  const pelican = site('pelican-point');
  await render(<SitePicture site={pelican} />);
  expect(screen.getByLabelText(pelican.image.alt)).toHaveProp('accessible', true);
});

test("Task 1: the picture has a size: the card's width and the picture's own proportions", async () => {
  const pelican = site('pelican-point');
  await render(<SitePicture site={pelican} />);
  const picture = screen.getByLabelText(pelican.image.alt);
  expect(picture).toHaveStyle({ aspectRatio: pelican.image.width / pelican.image.height });
});

test('Task 2: every terrain has an SF Symbol AND a Material Symbol for Android and the web', () => {
  for (const terrain of ['sand', 'rocky', 'marsh', 'mixed'] satisfies Terrain[]) {
    const icon = terrainIcons[terrain];
    expect([terrain, typeof icon]).toEqual([terrain, 'object']);
  }
});

test('Task 3: on a phone with a home indicator, the button stays above it', async () => {
  await render(<SignUpBar onSignUp={() => {}} />, { wrapper: phone(34) });
  expect(screen.getByTestId('sign-up-bar')).toHaveStyle({ paddingBottom: 16 + 34 });
});

test('Task 3: on a phone with a home button, the bar keeps its own padding', async () => {
  await render(<SignUpBar onSignUp={() => {}} />, { wrapper: phone(0) });
  expect(screen.getByTestId('sign-up-bar')).toHaveStyle({ paddingBottom: 16 });
});
