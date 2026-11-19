// C2 (model answer): the tests for swipeOutcome(), named as sentences. Each one would fail if the
// rule changed: the edge at exactly 40 %, the direction of a fling, the direction of a swipe.
import { swipeOutcome } from './swipe';

const WIDTH = 350; // a row on a 390-point phone, minus the screen's padding

it.each([
  ['a slow swipe 40 % of the way, exactly', -140, 0, 'remove'],
  ['a slow swipe that is not far enough', -139, 0, 'rest'],
  ['a short swipe flung to the left fast', -30, -800, 'remove'],
  ['a short swipe that slows down', -30, -799, 'rest'],
  ['a long swipe to the right', 300, 0, 'rest'],
  ['a fling to the right', 30, 1200, 'rest'],
] as const)('C2: %s: %s', (_case, translationX, velocityX, expected) => {
  expect(swipeOutcome({ translationX, velocityX }, WIDTH)).toBe(expected);
});

it('C2: measures the 40 % against the row it is given', () => {
  expect(swipeOutcome({ translationX: -100, velocityX: 0 }, 200)).toBe('remove');
  expect(swipeOutcome({ translationX: -100, velocityX: 0 }, 400)).toBe('rest');
});
