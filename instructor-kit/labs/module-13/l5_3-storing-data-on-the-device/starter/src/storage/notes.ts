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

// TODO 3: version 1 of the app made site_notes without the tide column; version 2 (this one) added it. This
// works on a new phone, and fails on every phone that already has version 1 of notes.db, because IF NOT EXISTS
// sees a table and skips it. Give the file a version number (PRAGMA user_version) and one step per version,
// in one transaction; notes written before version 2 get the tide 'unknown'.
async function migrate(db: SQLite.SQLiteDatabase) {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS site_notes (
      site_id TEXT NOT NULL,
      text TEXT NOT NULL,
      written_at INTEGER NOT NULL,
      tide TEXT NOT NULL DEFAULT 'unknown'
    );
  `);
}

// TODO 2: a note like "Theo's bags are by the stairs" breaks this SQL. Pass every value as a ? instead.
export async function addNote(note: SiteNote): Promise<void> {
  const db = await database();
  await db.execAsync(
    `INSERT INTO site_notes (site_id, text, tide, written_at)
     VALUES ('${note.siteId}', '${note.text}', '${note.tide}', ${note.writtenAt})`,
  );
}

// TODO 2: one site's notes, the newest first (and the site's id as a ? too)
export async function notesFor(siteId: string): Promise<SiteNote[]> {
  const db = await database();
  return db.getAllAsync<SiteNote>(
    `SELECT site_id AS siteId, text, tide, written_at AS writtenAt
       FROM site_notes
      WHERE site_id = '${siteId}'`,
  );
}
