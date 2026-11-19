// Task 2: Lesson 5.1's address table as code. Which address reaches shoreline-api from each kind of
// device, and how the API must be started for it.
export type Device = 'web-preview' | 'ios-simulator' | 'android-emulator' | 'phone';

export interface Directions {
  address: string;
  startApi: 'node server.ts' | 'node server.ts --host';
}

/** The directions for `device`; `lan` is your computer's network address, such as 192.168.1.42 */
export function directionsFor(device: Device, lan: string): Directions {
  // TODO 2: one answer per row of the lesson's table (only a phone needs your computer's address)
  return { address: `http://${lan}:4000`, startApi: 'node server.ts' };
}

/** What is wrong with `lan` as a phone's way to your computer, or null when it can work */
export function lanProblem(lan: string): string | null {
  // TODO 2: localhost and 127.x mean "this device"; 172.x is WSL's private address; '' means not found
  return lan === '' ? 'TODO 2' : null;
}
