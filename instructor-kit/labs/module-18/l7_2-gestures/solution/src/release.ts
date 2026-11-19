// When the finger lets go of a swipe row: far enough OR fast enough means "ask" (Lesson 7.2's rule).
export const reach = 120; // points to the left
export const flick = -800; // points per second, leftwards

// Called from onDeactivate, on the UI thread, so it must be a worklet: the 'worklet' line marks it (the Babel
// plugin only turns the gesture's own callbacks into worklets, not the functions they call)
export function shouldAsk(offset: number, velocityX: number): boolean {
  'worklet';
  return offset < -reach || velocityX < flick;
}
