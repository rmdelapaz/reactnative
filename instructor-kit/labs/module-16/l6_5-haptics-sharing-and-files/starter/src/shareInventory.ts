// Share the inventory as a CSV file through the phone's share sheet (expo-sharing). The web preview
// has no files for the app to write: there the caller shows the rows as text instead.
import { Directory, File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Platform } from 'react-native';

import { inventoryCsv } from './inventoryCsv';
import type { GearItem } from './types';

// TODO 3: this line runs the moment the module is imported (the web preview imports it too)
const exportsFolder = new Directory(Paths.cache, 'exports');

/**
 * Write the inventory file and open the share sheet with it. Resolves once the sheet has closed:
 * 'done' (whether or not an app was picked: the phone does not say), or 'unavailable' where files
 * cannot be shared (always in the web preview).
 */
export async function shareInventory(items: GearItem[], os: string = Platform.OS): Promise<'done' | 'unavailable'> {
  // TODO 3: is "is there a share sheet?" the same question as "can this app write a file?"
  if (!(await Sharing.isAvailableAsync())) {
    return 'unavailable';
  }
  // TODO 3: one export at a time; and which type is the file, for Android and for an iPhone?
  exportsFolder.create();
  const file = new File(exportsFolder, 'gear-inventory.csv');
  file.create();
  await file.write(inventoryCsv(items));
  await Sharing.shareAsync(file.uri);
  return 'done';
}
