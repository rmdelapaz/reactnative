// Tasks 2 and 3: the crew leader's notes about each beach, in a SQLite database on the phone. SQLite, not
// AsyncStorage: many records with the same fields, read one site at a time, newest first.
import * as SQLite from 'expo-sqlite';

export type Tide = 'low' | 'high' | 'unknown';

export type SiteNote = {
  siteId: string;
  text: string;
  tide: Tide;
  writtenAt: number; // milliseconds, as Date.now() gives them
};

// The version of the tables below. Version 2 added the tide column.
const schemaVersion = 2;

let opening: Promise<SQLite.SQLiteDatabase> | null = null;

// One connection for the whole app, opened and brought up to date the first time it is needed
function database(): Promise<SQLite.SQLiteDatabase> {
  opening ??= openNotes().catch((error: unknown) => {
    opening = null; // try again next time instead of keeping the failure
    throw error;
  });
  return opening;
}

async function openNotes() {
  const db = await SQLite.openDatabaseAsync('notes.db');
  await migrate(db);
  return db;
}

/** Close the connection; the next call opens the file again (the tests use it: a new phone for every test) */
export async function closeNotes(): Promise<void> {
  const db = await opening;
  opening = null;
  await db?.closeAsync();
}

// SQLite keeps a number in every database file, user_version (0 in a new one). Each step brings an older file
// one version further; all of them and the new number succeed or fail together.
async function migrate(db: SQLite.SQLiteDatabase) {
  const row = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
  const version = row?.user_version ?? 0;
  if (version >= schemaVersion) {
    return;
  }
  await db.withTransactionAsync(async () => {
    if (version < 1) {
      await db.execAsync(`
        CREATE TABLE site_notes (
          site_id TEXT NOT NULL,
          text TEXT NOT NULL,
          written_at INTEGER NOT NULL
        );
      `);
    }
    if (version < 2) {
      // The tide when the note was written. Notes from version 1 get 'unknown' (NOT NULL needs a default).
      await db.execAsync("ALTER TABLE site_notes ADD COLUMN tide TEXT NOT NULL DEFAULT 'unknown'");
    }
    // A PRAGMA takes no ? values; schemaVersion is our own number, never user input
    await db.execAsync(`PRAGMA user_version = ${schemaVersion}`);
  });
}

/** Save one note. Every ? is filled in by SQLite with the value in the same place: never build SQL from data. */
export async function addNote(note: SiteNote): Promise<void> {
  const db = await database();
  await db.runAsync(
    'INSERT INTO site_notes (site_id, text, tide, written_at) VALUES (?, ?, ?, ?)',
    note.siteId,
    note.text,
    note.tide,
    note.writtenAt,
  );
}

/** One site's notes, the newest first */
export async function notesFor(siteId: string): Promise<SiteNote[]> {
  const db = await database();
  return db.getAllAsync<SiteNote>(
    `SELECT site_id AS siteId, text, tide, written_at AS writtenAt
       FROM site_notes
      WHERE site_id = ?
      ORDER BY written_at DESC`,
    siteId,
  );
}
