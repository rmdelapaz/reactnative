// Tests (do not edit): npm test
// Reanimated draws on the phone's UI thread, which Jest does not have: its authors ship a stand-in that renders
// Animated views as plain views and keeps the styles you gave them (the jest.mock below). So these tests check
// what your code ASKS for (which style, which animation); watching it move is for the web preview and your phone.
import { isHiddenFromAccessibility, render, screen } from '@testing-library/react-native';
import { StyleSheet } from 'react-native';

import { BagCounter } from './BagCounter';
import { LiveBadge } from './LiveBadge';
import { filledPercent, SuppliesBar } from './SuppliesBar';

// Jest moves this line above the imports by itself: every import of Reanimated gets the stand-in
jest.mock('react-native-reanimated', () => jest.requireActual('react-native-reanimated/mock'));

const Reanimated = jest.requireMock('react-native-reanimated');

afterEach(() => jest.restoreAllMocks());

test('Task 1: 12 of 40 gloves is 30 %, and the fill is that wide', async () => {
  expect(filledPercent(12, 40)).toBe(30);
  await render(<SuppliesBar given={12} stock={40} item="gloves" />);
  expect(StyleSheet.flatten(screen.getByTestId('fill').props.style).width).toBe('30%');
});

test('Task 1: never more than 100 %, never a division by 0', () => {
  expect(filledPercent(50, 40)).toBe(100);
  expect(filledPercent(5, 0)).toBe(0);
  expect(filledPercent(1, 3)).toBe(33);
});

test('Task 1: the fill glides to its new width (a CSS-style transition, 400 ms)', async () => {
  await render(<SuppliesBar given={12} stock={40} item="gloves" />);
  const fill = StyleSheet.flatten(screen.getByTestId('fill').props.style);
  expect(fill.transitionProperty).toBe('width');
  expect(fill.transitionDuration).toBe(400);
});

test('Task 2: with full motion, the dot pulses forever', async () => {
  await render(<LiveBadge />);
  const dot = StyleSheet.flatten(screen.getByTestId('live-dot', { includeHiddenElements: true }).props.style);
  expect(dot.animationName).toBeDefined();
  expect(dot.animationIterationCount).toBe('infinite');
});

test('Task 2: with Reduce Motion on, the dot holds still (CSS-style animations do not check it for you)', async () => {
  jest.spyOn(Reanimated, 'useReducedMotion').mockReturnValue(true);
  await render(<LiveBadge />);
  const dot = StyleSheet.flatten(screen.getByTestId('live-dot', { includeHiddenElements: true }).props.style);
  expect(dot.animationName).toBeUndefined();
});

test('Task 2: screen readers skip the dot and read the words', async () => {
  await render(<LiveBadge />);
  expect(isHiddenFromAccessibility(screen.getByTestId('live-dot', { includeHiddenElements: true }))).toBe(true);
  expect(screen.getByText('Happening now')).toBeOnTheScreen();
});

test('Task 3: a screen reader hears the final number once', async () => {
  await render(<BagCounter bags={7} />);
  expect(screen.getByLabelText('7 bags filled')).toBeOnTheScreen();
});

test('Task 3: the count lands exactly on its target: withTiming, never a spring', async () => {
  const timing = jest.spyOn(Reanimated, 'withTiming');
  const spring = jest.spyOn(Reanimated, 'withSpring');
  await render(<BagCounter bags={7} />);
  expect(timing).toHaveBeenCalledWith(7, expect.objectContaining({ duration: 900 }));
  expect(spring).not.toHaveBeenCalled();
});
