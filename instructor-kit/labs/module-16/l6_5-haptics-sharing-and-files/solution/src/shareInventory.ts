// Share the inventory as a CSV file through the phone's share sheet (expo-sharing). The web preview
// has no files for the app to write: there the caller shows the rows as text instead.
import { Directory, File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Platform } from 'react-native';

import { inventoryCsv } from './inventoryCsv';
import type { GearItem } from './types';

/**
 * Write the inventory file and open the share sheet with it. Resolves once the sheet has closed:
 * 'done' (whether or not an app was picked: the phone does not say), or 'unavailable' where files
 * cannot be shared (always in the web preview).
 */
export async function shareInventory(items: GearItem[], os: string = Platform.OS): Promise<'done' | 'unavailable'> {
  // The platform first: a browser may have a share sheet, but never files for this app to write
  if (os === 'web' || !(await Sharing.isAvailableAsync())) {
    return 'unavailable';
  }
  // Made here, not at the top of the file: on the web, Paths.cache throws as soon as it is read
  const folder = new Directory(Paths.cache, 'exports');
  if (folder.exists) {
    folder.delete(); // the previous export: one at a time
  }
  folder.create();
  const file = new File(folder, 'gear-inventory.csv');
  file.create();
  await file.write(inventoryCsv(items));
  await Sharing.shareAsync(file.uri, {
    mimeType: 'text/csv', // Android: which apps to offer
    UTI: 'public.comma-separated-values-text', // iPhone: the same type, in Apple's words
    dialogTitle: 'Share the gear inventory',
  });
  return 'done';
}
