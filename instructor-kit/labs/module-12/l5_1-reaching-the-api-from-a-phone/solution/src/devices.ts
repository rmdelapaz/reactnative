// Task 2: Lesson 5.1's address table as code. Which address reaches shoreline-api from each kind of
// device, and how the API must be started for it.
export type Device = 'web-preview' | 'ios-simulator' | 'android-emulator' | 'phone';

export interface Directions {
  address: string;
  startApi: 'node server.ts' | 'node server.ts --host';
}

/** The directions for `device`; `lan` is your computer's network address, such as 192.168.1.42 */
export function directionsFor(device: Device, lan: string): Directions {
  switch (device) {
    case 'web-preview':
    case 'ios-simulator':
      // Both share your computer's network: localhost is your computer
      return { address: 'http://localhost:4000', startApi: 'node server.ts' };
    case 'android-emulator':
      // The emulator's built-in name for the computer it runs on
      return { address: 'http://10.0.2.2:4000', startApi: 'node server.ts' };
    case 'phone':
      // A second device on the Wi-Fi: your computer's address, and an API that listens on it
      return { address: `http://${lan}:4000`, startApi: 'node server.ts --host' };
  }
}

/** What is wrong with `lan` as a phone's way to your computer, or null when it can work */
export function lanProblem(lan: string): string | null {
  if (lan === '') {
    return "No address yet: read it under Metro's QR code (exp://ADDRESS:8081).";
  }
  if (lan === 'localhost' || lan.startsWith('127.')) {
    return `${lan} is the phone itself on a phone: use your computer's network address.`;
  }
  if (lan.startsWith('172.')) {
    return `${lan} looks like WSL's private address: a phone cannot reach it (Lesson 5.1, Windows and WSL).`;
  }
  return null;
}
