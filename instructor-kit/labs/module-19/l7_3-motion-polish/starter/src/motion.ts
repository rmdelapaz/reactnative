// Task 1: should motion step aside? Two sources: the phone's own Reduce Motion setting (read with
// AccessibilityInfo) and a "Calm photos" switch in this app's settings (off until the volunteer asks).
// The rule from Lesson 7.3: the app's switch only ADDS. It can ask for less motion, never turn motion back
// on against the phone.
export function reduceMotionFrom(phoneReduces: boolean, appSwitch: boolean): boolean {
  // TODO 1: this lets the switch overrule the phone (the "three-way choice" the lesson rejects)
  return appSwitch;
}
