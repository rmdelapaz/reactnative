// The logbook: the debris logs this phone knows were sent, in a SQLite database (new). SQLite, not
// AsyncStorage: these are many records with the same fields, and the app asks questions across
// all of them (newest first, totals). Lesson 5.5 adds each log the phone sends itself.
import * as SQLite from 'expo-sqlite';

import type { CleanupEvent, CleanupLog } from '@/api/types';

/** A log the API has, with the cleanup it belongs to */
export type SentLog = { log: CleanupLog; event: CleanupEvent };

/** One row of the logbook, as the Logbook screen shows it */
export type LogbookEntry = {
  clientId: string;
  eventTitle: string;
  eventDate: string;
  pieces: number;
  bags: number;
  weightKg: number;
  note: string;
};

export type LogbookTotals = { logs: number; pieces: number; bags: number; weightKg: number };

export type Logbook = { entries: LogbookEntry[]; totals: LogbookTotals };

// The version of the tables below. A later change to them gets a new number and a new step
const schemaVersion = 1;

let opening: Promise<SQLite.SQLiteDatabase> | null = null;

// One connection for the whole app, opened and brought up to date the first time it is needed
function database(): Promise<SQLite.SQLiteDatabase> {
  opening ??= openLogbook().catch((error: unknown) => {
    opening = null; // try again next time instead of keeping the failure
    throw error;
  });
  return opening;
}

async function openLogbook() {
  const db = await SQLite.openDatabaseAsync('logbook.db');
  await migrate(db);
  return db;
}

// SQLite keeps a number in every database file, user_version (0 in a new one): which version
// of the tables this file has. Each step brings an older file one version further.
async function migrate(db: SQLite.SQLiteDatabase) {
  const row = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
  const version = row?.user_version ?? 0;
  if (version >= schemaVersion) {
    return;
  }
  // All or nothing: if a step fails, the file keeps its old tables and its old number
  await db.withTransactionAsync(async () => {
    if (version < 1) {
      await db.execAsync(`
        CREATE TABLE sent_logs (
          volunteer_id TEXT NOT NULL,
          client_id TEXT NOT NULL,
          event_id TEXT NOT NULL,
          event_title TEXT NOT NULL,
          event_date TEXT NOT NULL,
          pieces INTEGER NOT NULL,
          bags INTEGER NOT NULL,
          weight_kg REAL NOT NULL,
          note TEXT NOT NULL,
          recorded_at TEXT NOT NULL,
          PRIMARY KEY (volunteer_id, client_id)
        );
      `);
    }
    // A PRAGMA takes no ? values; schemaVersion is our own number, never user input
    await db.execAsync(`PRAGMA user_version = ${schemaVersion}`);
  });
}

/** Save logs the API has. One the logbook already has (same person, same clientId) is replaced. */
export async function saveSentLogs(sent: SentLog[]): Promise<void> {
  const db = await database();
  await db.withTransactionAsync(async () => {
    for (const { log, event } of sent) {
      const pieces = log.items.reduce((sum, item) => sum + item.count, 0);
      // Every ? is filled in by SQLite with the value in the same place: never build SQL from data
      await db.runAsync(
        `INSERT OR REPLACE INTO sent_logs
           (volunteer_id, client_id, event_id, event_title, event_date,
            pieces, bags, weight_kg, note, recorded_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        log.volunteerId,
        log.clientId,
        event.id,
        event.title,
        event.date,
        pieces,
        log.bags,
        log.weightKg,
        log.note,
        log.recordedAt,
      );
    }
  });
}

/** One volunteer's logbook: the newest log first, and the totals over all of them */
export async function readLogbook(volunteerId: string): Promise<Logbook> {
  const db = await database();
  const entries = await db.getAllAsync<LogbookEntry>(
    `SELECT client_id AS clientId, event_title AS eventTitle, event_date AS eventDate,
            pieces, bags, weight_kg AS weightKg, note
       FROM sent_logs
      WHERE volunteer_id = ?
      ORDER BY recorded_at DESC`,
    volunteerId,
  );
  const totals = await db.getFirstAsync<LogbookTotals>(
    `SELECT COUNT(*) AS logs, COALESCE(SUM(pieces), 0) AS pieces,
            COALESCE(SUM(bags), 0) AS bags, COALESCE(SUM(weight_kg), 0) AS weightKg
       FROM sent_logs
      WHERE volunteer_id = ?`,
    volunteerId,
  );
  return { entries, totals: totals ?? { logs: 0, pieces: 0, bags: 0, weightKg: 0 } };
}
