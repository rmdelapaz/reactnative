// The rule behind a swipe-to-remove row (Lesson 7.2): when the finger lets go, does the row
// go, or does it spring back? This file works: C2 is to write its tests.

/** How far, as a share of the row's width, a slow swipe to the left must travel to remove it */
export const REMOVE_SHARE = 0.4;
/** A fling to the left at least this fast (points per second) removes the row from anywhere */
export const FLING_SPEED = 800;

export type SwipeEnd = { translationX: number; velocityX: number };

/** 'remove' when the row travelled at least 40 % of its width to the left, or was flung left fast */
export function swipeOutcome({ translationX, velocityX }: SwipeEnd, rowWidth: number): 'remove' | 'rest' {
  if (translationX <= -REMOVE_SHARE * rowWidth) {
    return 'remove';
  }
  if (velocityX <= -FLING_SPEED) {
    return 'remove';
  }
  return 'rest';
}
