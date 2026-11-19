// Tests (do not edit): npm test
// Reanimated draws on the phone's UI thread, which Jest does not have: its authors ship a stand-in that renders
// Animated views as plain views and keeps the props you gave them (the jest.mock below). So these tests check
// what your code ASKS for (which animation, where); watching it move is for the web preview and your phone.
import { render, screen, userEvent, isHiddenFromAccessibility } from '@testing-library/react-native';
import { FadeIn, FadeOutLeft, LinearTransition } from 'react-native-reanimated';

import { reduceMotionFrom } from './motion';
import { SavedMark } from './SavedMark';
import { TagList } from './TagList';

// Jest moves this line above the imports by itself: every import of Reanimated gets the stand-in
jest.mock('react-native-reanimated', () => jest.requireActual('react-native-reanimated/mock'));

const Reanimated = jest.requireMock('react-native-reanimated');

test('Task 1: the phone asks for less motion: less motion, whatever the switch says', () => {
  expect(reduceMotionFrom(true, false)).toBe(true);
  expect(reduceMotionFrom(true, true)).toBe(true);
});

test('Task 1: the phone does not: the app switch decides', () => {
  expect(reduceMotionFrom(false, true)).toBe(true);
  expect(reduceMotionFrom(false, false)).toBe(false);
});

test('Task 2: full motion: the mark draws itself once', async () => {
  await render(<SavedMark reduceMotion={false} />);
  const animation = screen.getByTestId('saved-animation', { includeHiddenElements: true });
  expect(animation.props.loop).toBe(false);
});

test('Task 2: less motion: a still mark, and no animation at all', async () => {
  await render(<SavedMark reduceMotion />);
  expect(screen.queryByTestId('saved-animation', { includeHiddenElements: true })).toBeNull();
  expect(screen.getByText('✓', { includeHiddenElements: true })).toBeOnTheScreen();
});

test('Task 2: screen readers skip the mark (the heading says it in words)', async () => {
  await render(<SavedMark reduceMotion />);
  expect(screen.queryByText('✓')).toBeNull();
  expect(isHiddenFromAccessibility(screen.getByText('✓', { includeHiddenElements: true }))).toBe(true);
});

test('Task 3: every tag arrives, leaves to the left and glides into place', async () => {
  await render(<TagList tags={['Glass', 'Rope']} onRemove={() => {}} />);
  for (const tag of ['Glass', 'Rope']) {
    const view = screen.getByTestId(`tag-${tag}`);
    expect(view.props.entering).toBe(FadeIn);
    expect(view.props.exiting).toBe(FadeOutLeft);
    expect(view.props.layout).toBe(LinearTransition);
  }
});

test('Task 3: the box around the tags has no layout transition of its own', async () => {
  await render(<TagList tags={['Glass', 'Rope']} onRemove={() => {}} />);
  expect(screen.getByTestId('tag-box').props.layout).toBeUndefined();
});

test('Task 3: the first render is not news (skipEntering)', async () => {
  const config = jest.spyOn(Reanimated, 'LayoutAnimationConfig');
  await render(<TagList tags={['Glass']} onRemove={() => {}} />);
  expect(config).toHaveBeenCalled();
  expect(config.mock.calls[0][0]).toMatchObject({ skipEntering: true });
});

test('Task 3: pressing Remove asks for that tag', async () => {
  const removed: string[] = [];
  await render(<TagList tags={['Glass', 'Rope']} onRemove={(tag) => removed.push(tag)} />);
  await userEvent.setup().press(screen.getByRole('button', { name: 'Remove Rope' }));
  expect(removed).toEqual(['Rope']);
});
