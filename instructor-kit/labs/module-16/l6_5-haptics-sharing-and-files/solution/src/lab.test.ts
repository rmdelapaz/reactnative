// Tests (do not edit): npm test
import * as Haptics from 'expo-haptics';
import * as Sharing from 'expo-sharing';

import { buzz } from './buzz';
import { inventoryCsv } from './inventoryCsv';
import { shareInventory } from './shareInventory';
import type { GearItem } from './types';

// The tests stand in for the phone: they record what the code ASKED for (a buzz, a file, the share
// sheet). Only a phone shows what it feels and looks like.
jest.mock('expo-haptics', () => ({
  ...jest.requireActual('expo-haptics'),
  notificationAsync: jest.fn(async () => undefined),
  performAndroidHapticsAsync: jest.fn(async () => undefined),
  impactAsync: jest.fn(async () => undefined),
  selectionAsync: jest.fn(async () => undefined),
}));
jest.mock('expo-sharing', () => ({
  isAvailableAsync: jest.fn(async () => true),
  shareAsync: jest.fn(async () => undefined),
}));
// A stand-in file system: files in memory, and a count of every time Paths.cache is read
jest.mock('expo-file-system', () => {
  const fake = { cacheReads: 0, files: new Map<string, string>() };
  class Directory {
    uri: string;
    constructor(parent: { uri: string }, name: string) {
      this.uri = `${parent.uri}/${name}`;
    }
    get exists() {
      return [...fake.files.keys()].some((uri) => uri.startsWith(`${this.uri}/`));
    }
    delete() {
      for (const uri of [...fake.files.keys()]) {
        if (uri.startsWith(`${this.uri}/`)) fake.files.delete(uri);
      }
    }
    create() {}
  }
  class File {
    uri: string;
    constructor(parent: { uri: string }, name: string) {
      this.uri = `${parent.uri}/${name}`;
    }
    create() {
      fake.files.set(this.uri, '');
    }
    async write(text: string) {
      fake.files.set(this.uri, text);
    }
  }
  const Paths = {
    get cache() {
      fake.cacheReads += 1;
      return { uri: 'file:///cache' };
    },
  };
  return { __fake: fake, Directory, File, Paths };
});
const fake = (jest.requireMock('expo-file-system') as { __fake: { cacheReads: number; files: Map<string, string> } }).__fake;
const readsAtImport = fake.cacheReads;

const items: GearItem[] = [
  { name: 'Litter grabber', shed: 'North shed', count: 14, lastChecked: '2026-11-02', note: 'Two with loose grips' },
  { name: 'Sand sieve', shed: 'Cove shed', count: 6, lastChecked: null, note: 'Never counted' },
  {
    name: 'Bucket',
    shed: 'North shed',
    count: 9,
    lastChecked: '2026-11-02',
    note: 'Two "borrowed", one cracked,\nask Ines',
  },
  { name: 'Work gloves', shed: 'Cove shed', count: 30, lastChecked: '2026-10-28', note: '=SUM(C2:C4)' },
];

// A CSV reader that follows the standard (RFC 4180), as a spreadsheet does: rows of cells
function readCsv(text: string): string[][] {
  const rows: string[][] = [[]];
  let cellText = '';
  let quoted = false;
  for (let k = 0; k < text.length; k += 1) {
    const ch = text[k];
    if (quoted) {
      if (ch === '"' && text[k + 1] === '"') {
        cellText += '"';
        k += 1;
      } else if (ch === '"') {
        quoted = false;
      } else {
        cellText += ch;
      }
    } else if (ch === '"') {
      quoted = true;
    } else if (ch === ',') {
      rows[rows.length - 1].push(cellText);
      cellText = '';
    } else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && text[k + 1] === '\n') k += 1;
      rows[rows.length - 1].push(cellText);
      cellText = '';
      rows.push([]);
    } else {
      cellText += ch;
    }
  }
  return rows.filter((row) => row.length > 0);
}

beforeEach(() => {
  jest.clearAllMocks();
  fake.files.clear();
});

test('Task 1: a byte order mark first, and \\r\\n after every row', () => {
  const csv = inventoryCsv(items);
  expect(csv.codePointAt(0)).toBe(0xfeff);
  expect(csv.endsWith('\r\n')).toBe(true);
  expect(csv.split('\r\n')).toHaveLength(6); // 5 rows, then nothing after the last \r\n
});

test('Task 1: a note with a comma, quotes and a line break stays in one cell', () => {
  const rows = readCsv(inventoryCsv(items).replace('\uFEFF', ''));
  expect(rows.map((row) => row.length)).toEqual([5, 5, 5, 5, 5]);
  expect(rows[3][4]).toBe('Two "borrowed", one cracked,\nask Ines');
});

test('Task 1: counts stay numbers, and a missing date is an empty cell', () => {
  const lines = inventoryCsv(items).replace('\uFEFF', '').split('\r\n');
  expect(lines[2]).toBe('"Sand sieve","Cove shed",6,,"Never counted"');
});

test('Task 1: text that starts like a formula is shown as text', () => {
  const lines = inventoryCsv(items).split('\r\n');
  expect(lines[4]).toBe(`"Work gloves","Cove shed",30,"2026-10-28","'=SUM(C2:C4)"`);
});

test('Task 2: switched off, nothing plays', () => {
  buzz('success', false, 'ios');
  buzz('error', false, 'android');
  for (const fn of [Haptics.notificationAsync, Haptics.performAndroidHapticsAsync, Haptics.impactAsync]) {
    expect(fn).not.toHaveBeenCalled();
  }
});

test('Task 2: an iPhone feels Success and Error', () => {
  buzz('success', true, 'ios');
  buzz('error', true, 'ios');
  expect(jest.mocked(Haptics.notificationAsync).mock.calls).toEqual([['success'], ['error']]);
  expect(Haptics.impactAsync).not.toHaveBeenCalled();
});

test("Task 2: Android plays its own Confirm and Reject", () => {
  buzz('success', true, 'android');
  buzz('error', true, 'android');
  expect(jest.mocked(Haptics.performAndroidHapticsAsync).mock.calls).toEqual([['confirm'], ['reject']]);
  expect(Haptics.notificationAsync).not.toHaveBeenCalled();
});

test('Task 2: a buzz that cannot play is never an error', () => {
  const failed = Promise.reject(new Error('No Taptic Engine'));
  failed.catch(() => {}); // (the test's own safety net)
  const handled = jest.spyOn(failed, 'catch');
  jest.mocked(Haptics.notificationAsync).mockReturnValueOnce(failed);
  expect(() => buzz('success', true, 'ios')).not.toThrow();
  expect(handled).toHaveBeenCalled();
});

test('Task 3: importing the module reads no folder (the web preview imports it too)', () => {
  expect(readsAtImport).toBe(0);
});

test('Task 3: the web preview never writes a file, even where the browser can share', async () => {
  await expect(shareInventory(items, 'web')).resolves.toBe('unavailable');
  expect(fake.files.size).toBe(0);
  expect(Sharing.shareAsync).not.toHaveBeenCalled();
});

test('Task 3: on a phone, one file in cache/exports, shared as a CSV', async () => {
  await expect(shareInventory(items, 'android')).resolves.toBe('done');
  expect([...fake.files.keys()]).toEqual(['file:///cache/exports/gear-inventory.csv']);
  expect(fake.files.get('file:///cache/exports/gear-inventory.csv')).toBe(inventoryCsv(items));
  expect(Sharing.shareAsync).toHaveBeenCalledWith(
    'file:///cache/exports/gear-inventory.csv',
    expect.objectContaining({ mimeType: 'text/csv', UTI: 'public.comma-separated-values-text' }),
  );
});

test('Task 3: the previous export is deleted before the next one is written', async () => {
  fake.files.set('file:///cache/exports/gear-inventory-old.csv', 'yesterday');
  await shareInventory(items, 'ios');
  expect([...fake.files.keys()]).toEqual(['file:///cache/exports/gear-inventory.csv']);
});
