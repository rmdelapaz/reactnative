import type { Stop } from '@/api/types';
import { AppText } from '@/components/AppText';

// TODO R5d. "Find my nearest stop" (Lessons 6.1 and 6.3; Shoreline Crew's DistancePanel is the model).
// - A heading "Nearest stop", "Find the stop closest to where you are now." and a "Find my nearest
//   stop" button. Nothing asks for the location before that press.
// - After the press: usePermission(Location.useForegroundPermissions()) inside a <PermissionGate> with
//   what="your location" and why="Bookmobile Stops uses your location once, on this phone, to find the
//   closest stop. It is not sent anywhere." and a Not now that goes back to the button.
// - After a yes: Location.getCurrentPositionAsync once (a useQuery with networkMode 'always'), then
//   "Your nearest stop is <name>, <formatDistance(km)> away." (nearestStop, TODO R5c) and
//   "Make this my stop" (or "This is your stop." when it already is).
export function NearestStop({ stops }: { stops: Stop[] }) {
  return <AppText>TODO R5d: Find my nearest stop ({stops.length} stops to compare)</AppText>;
}
