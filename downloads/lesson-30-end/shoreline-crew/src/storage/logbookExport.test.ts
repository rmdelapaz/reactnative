import type { LogbookEntry } from '@/storage/logbook';
import { logbookCsv } from '@/storage/logbookExport';

function makeEntry(changes: Partial<LogbookEntry> = {}): LogbookEntry {
  return {
    clientId: 'log-0001',
    eventTitle: 'Tide Pool Morning Cleanup',
    eventDate: '2026-07-04',
    pieces: 42,
    bags: 1,
    weightKg: 2.5,
    note: '',
    ...changes,
  };
}

describe('logbookCsv', () => {
  it('starts with a byte order mark and ends every row with CRLF', () => {
    const csv = logbookCsv([makeEntry()]);
    expect(csv.startsWith('\uFEFF')).toBe(true);
    expect(csv.split('\r\n')).toEqual([
      '\uFEFF"Cleanup","Date","Pieces","Bags","Weight (kg)","Note"',
      '"Tide Pool Morning Cleanup","2026-07-04",42,1,2.5,""',
      '',
    ]);
  });

  it('keeps commas, quotes and line breaks inside one cell', () => {
    const csv = logbookCsv([makeEntry({ note: 'Nets, "lots"\nof them' })]);
    expect(csv).toContain('"Nets, ""lots""\nof them"');
  });

  it('stops a note from running as a spreadsheet formula', () => {
    const csv = logbookCsv([makeEntry({ note: '=SUM(A1:A9)' })]);
    expect(csv).toContain(`"'=SUM(A1:A9)"`);
  });
});
