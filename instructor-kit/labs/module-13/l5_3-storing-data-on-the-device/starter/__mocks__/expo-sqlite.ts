// Jest only (do not edit). Jest uses this file instead of the expo-sqlite package, because a test has no phone.
// It gives the same async methods (openDatabaseAsync, execAsync, runAsync, getAllAsync, getFirstAsync,
// withTransactionAsync, deleteDatabaseAsync) on the SQLite engine built into Node 24 (node:sqlite): the same
// SQLite a phone has, so your SQL and SQLite's error messages are real. Databases live in memory.
type Value = string | number | null;
type Row = Record<string, unknown>;
type Statement = {
  all(...values: Value[]): Row[];
  get(...values: Value[]): Row | undefined;
  run(...values: Value[]): { changes: number | bigint; lastInsertRowid: number | bigint };
};
type NodeDatabase = { exec(sql: string): void; prepare(sql: string): Statement; close(): void };

const { DatabaseSync } = jest.requireActual<{ DatabaseSync: new (path: string) => NodeDatabase }>('node:sqlite');

// One database per file name, like the files in an app's folder
const files = new Map<string, NodeDatabase>();

// expo-sqlite takes the values one by one or as one array; true and false are stored as 1 and 0
function bind(values: unknown[]): Value[] {
  const list: unknown[] = values.length === 1 && Array.isArray(values[0]) ? values[0] : values;
  return list.map((value) => (typeof value === 'boolean' ? Number(value) : (value as Value)));
}

export async function openDatabaseAsync(name: string) {
  let file = files.get(name);
  if (file === undefined) {
    file = new DatabaseSync(':memory:');
    files.set(name, file);
  }
  const db = file;
  return {
    async execAsync(sql: string): Promise<void> {
      db.exec(sql);
    },
    async runAsync(sql: string, ...values: unknown[]) {
      const result = db.prepare(sql).run(...bind(values));
      return { changes: Number(result.changes), lastInsertRowId: Number(result.lastInsertRowid) };
    },
    async getAllAsync<T>(sql: string, ...values: unknown[]): Promise<T[]> {
      return db.prepare(sql).all(...bind(values)).map((row) => ({ ...row }) as T);
    },
    async getFirstAsync<T>(sql: string, ...values: unknown[]): Promise<T | null> {
      const row = db.prepare(sql).get(...bind(values));
      return row === undefined ? null : ({ ...row } as T);
    },
    async withTransactionAsync(task: () => Promise<void>): Promise<void> {
      db.exec('BEGIN');
      try {
        await task();
        db.exec('COMMIT');
      } catch (error) {
        db.exec('ROLLBACK');
        throw error;
      }
    },
    async closeAsync(): Promise<void> {},
  };
}

export async function deleteDatabaseAsync(name: string): Promise<void> {
  files.get(name)?.close();
  files.delete(name);
}
