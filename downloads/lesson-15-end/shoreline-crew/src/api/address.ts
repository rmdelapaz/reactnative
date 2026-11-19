// Which address reaches shoreline-api depends on where the app runs (new: the HQ only ever ran
// in the browser next to the API). The meeting point is the same; the directions differ.
import type { PlatformOSType } from 'react-native';

/** EXPO_PUBLIC_API_URL is missing or written wrongly: no request can work until it is fixed */
export class AddressError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AddressError';
  }
}

/** The host part of an address, such as "192.168.1.42" in http://192.168.1.42:4000 */
export function hostOf(address: string): string | null {
  const match = /^https?:\/\/(\[[^\]]+\]|[^/:?#]+)/i.exec(address);
  return match === null ? null : match[1].toLowerCase();
}

/** What is wrong with the address in .env.local, or null when it is written correctly */
export function addressProblem(address: string): string | null {
  if (address === '') {
    return 'EXPO_PUBLIC_API_URL is not set: copy .env.example to .env.local, then restart Metro.';
  }
  if (hostOf(address) === null) {
    return `EXPO_PUBLIC_API_URL is "${address}": start it with http://, as in http://192.168.1.42:4000.`;
  }
  if (/\/api\/?$/.test(address)) {
    return `EXPO_PUBLIC_API_URL is "${address}": leave out the /api at the end (the app adds it).`;
  }
  return null;
}

// Names that always mean "this device itself"
const loopbackHosts = ['localhost', '127.0.0.1', '[::1]'];

/**
 * What to try next when a request to `address` got no answer, for the platform the app runs on.
 * The client adds it to "Could not reach the server" (describeError).
 */
export function addressAdvice(address: string, platform: PlatformOSType): string {
  const host = hostOf(address);
  const local = host !== null && loopbackHosts.includes(host);
  if (platform === 'web') {
    // The web preview runs in your computer's browser, next to the API
    if (host === '10.0.2.2') {
      return '10.0.2.2 works only inside the Android emulator: the web preview uses localhost.';
    }
    return local
      ? 'Check that shoreline-api is running, then try again.'
      : 'Check that shoreline-api is running (with --host for this address), then try again.';
  }
  if (local) {
    return platform === 'android'
      ? `On Android, ${host} is the device itself. Put your computer's network address in .env.local (10.0.2.2 on the emulator).`
      : `On a phone, ${host} is the phone itself (only the iOS Simulator shares your computer's). Put your computer's network address in .env.local.`;
  }
  if (host === '10.0.2.2') {
    return platform === 'android'
      ? 'Check that shoreline-api is running, then try again. (10.0.2.2 works on the emulator, not on a phone.)'
      : "10.0.2.2 works only inside the Android emulator. Put your computer's network address in .env.local.";
  }
  return 'Check that shoreline-api is running with --host and that this device is on the same Wi-Fi as your computer, then try again.';
}
