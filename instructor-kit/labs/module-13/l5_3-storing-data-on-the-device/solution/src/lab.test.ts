// Tests (do not edit): npm test
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SQLite from 'expo-sqlite';

import { changePrefs, defaultPrefs, loadPrefs, prefsKey } from './state/prefs';
import { addNote, closeNotes, notesFor } from './storage/notes';

// A new phone for every test: no saved preferences, no notes.db
beforeEach(() => AsyncStorage.clear());
afterEach(async () => {
  await closeNotes();
  await SQLite.deleteDatabaseAsync('notes.db');
});

test('Task 1: nothing saved yet gives the defaults', async () => {
  expect(await loadPrefs()).toEqual(defaultPrefs);
});

test('Task 1: a change is saved and comes back', async () => {
  await changePrefs({ unit: 'lb' });
  expect(await loadPrefs()).toEqual({ unit: 'lb', tipsSeen: false });
});

test('Task 1: a unit this version does not know falls back to kg', async () => {
  await AsyncStorage.setItem(prefsKey, JSON.stringify({ unit: 'stone', tipsSeen: true }));
  expect(await loadPrefs()).toEqual({ unit: 'kg', tipsSeen: true });
});

test('Task 1: text that is not JSON gives the defaults, with a warning', async () => {
  const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
  await AsyncStorage.setItem(prefsKey, '{not json');
  expect(await loadPrefs()).toEqual(defaultPrefs);
  expect(warn).toHaveBeenCalled();
  warn.mockRestore();
});

test("Task 2: a note with an apostrophe is saved as written", async () => {
  const note = { siteId: 'driftwood-cove', text: "Theo's bags are by the stairs", tide: 'low', writtenAt: 1000 } as const;
  await addNote(note);
  expect(await notesFor('driftwood-cove')).toEqual([note]);
});

test("Task 2: one site's notes, the newest first", async () => {
  await addNote({ siteId: 'driftwood-cove', text: 'Rope at the tide line', tide: 'low', writtenAt: 1000 });
  await addNote({ siteId: 'north-jetty', text: 'Glass by the steps', tide: 'high', writtenAt: 2000 });
  await addNote({ siteId: 'driftwood-cove', text: 'Two nets by the rocks', tide: 'high', writtenAt: 3000 });
  const texts = (await notesFor('driftwood-cove')).map((note) => note.text);
  expect(texts).toEqual(['Two nets by the rocks', 'Rope at the tide line']);
});

test('Task 3: a new phone gets version 2 of notes.db', async () => {
  await notesFor('driftwood-cove');
  const db = await SQLite.openDatabaseAsync('notes.db');
  expect(await db.getFirstAsync('PRAGMA user_version')).toEqual({ user_version: 2 });
});

test('Task 3: a phone with version 1 keeps its notes and gets the tide column', async () => {
  // What version 1 of the app left on this phone: the table without tide, and one note
  const db = await SQLite.openDatabaseAsync('notes.db');
  await db.execAsync(`
    CREATE TABLE site_notes (site_id TEXT NOT NULL, text TEXT NOT NULL, written_at INTEGER NOT NULL);
    INSERT INTO site_notes VALUES ('north-jetty', 'Glass by the steps', 500);
    PRAGMA user_version = 1;
  `);
  await addNote({ siteId: 'north-jetty', text: 'Clear today', tide: 'high', writtenAt: 2000 });
  expect(await notesFor('north-jetty')).toEqual([
    { siteId: 'north-jetty', text: 'Clear today', tide: 'high', writtenAt: 2000 },
    { siteId: 'north-jetty', text: 'Glass by the steps', tide: 'unknown', writtenAt: 500 },
  ]);
});
