// The logbook as a file (new): a spreadsheet file (CSV) the volunteer can send to the crew's
// coordinator, keep in a Files app, or open in a spreadsheet. Written to the app's cache, then
// handed to the phone's share sheet.
import { Directory, File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Platform } from 'react-native';

import type { LogbookEntry } from '@/storage/logbook';
import { toDateString } from '@/utils/format';

const columns = ['Cleanup', 'Date', 'Pieces', 'Bags', 'Weight (kg)', 'Note'];

// One cell. Numbers as they are; text in quotes with every quote doubled, so a comma, a quote or a
// line break in a note stays inside its cell. Text that starts like a formula (= + - @) gets a '
// in front: a spreadsheet would otherwise run it as one.
function cell(value: string | number): string {
  if (typeof value === 'number') {
    return String(value);
  }
  const text = /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
  return `"${text.replaceAll('"', '""')}"`;
}

/** The logbook as CSV text: a row of column names, then one row per log */
export function logbookCsv(entries: LogbookEntry[]): string {
  const rows = entries.map((entry) => [
    entry.eventTitle,
    entry.eventDate,
    entry.pieces,
    entry.bags,
    entry.weightKg,
    entry.note,
  ]);
  const lines = [columns, ...rows].map((row) => row.map(cell).join(','));
  // A byte order mark (\uFEFF) first tells spreadsheet apps the text is UTF-8: without it,
  // "Café" may open as "CafÃ©"
  return `\uFEFF${lines.join('\r\n')}\r\n`;
}

/** Write the logbook to a new file, named with today's date: shoreline-logbook-YYYY-MM-DD.csv */
export async function writeLogbookFile(entries: LogbookEntry[]): Promise<File> {
  // Files made only to be shared go in the cache: the phone may empty it, and that is fine.
  // Made here, not at the top of the file: on the web, Paths.cache throws as soon as it is read.
  const folder = new Directory(Paths.cache, 'exports');
  // One export at a time: the last one is deleted now, not right after sharing it, because the
  // app it went to may still be reading it
  if (folder.exists) {
    folder.delete();
  }
  folder.create();
  const file = new File(folder, `shoreline-logbook-${toDateString(new Date())}.csv`);
  file.create();
  await file.write(logbookCsv(entries));
  return file;
}

/**
 * Write the logbook file and open the share sheet with it. Resolves once the sheet has closed:
 * 'done' (whether or not the volunteer picked an app: the phone does not say), or 'unavailable'
 * where files cannot be shared (always in the web preview).
 */
export async function shareLogbook(entries: LogbookEntry[]): Promise<'done' | 'unavailable'> {
  // The web has no files for the app to write, and expo-sharing shares web addresses there
  if (Platform.OS === 'web' || !(await Sharing.isAvailableAsync())) {
    return 'unavailable';
  }
  const file = await writeLogbookFile(entries);
  await Sharing.shareAsync(file.uri, {
    mimeType: 'text/csv', // Android: which apps to offer; iPhone: the file's type
    UTI: 'public.comma-separated-values-text', // the same type, in Apple's words
    dialogTitle: 'Share your logbook', // the title of Android's share sheet
  });
  return 'done';
}
