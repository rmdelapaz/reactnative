// The gear inventory as a spreadsheet file (CSV): a row of column names, then one row per kind of gear
import type { GearItem } from './types';

const columns = ['Item', 'Shed', 'Count', 'Last checked', 'Note'];

// One cell. Numbers as they are, a missing value as an empty cell, text in quotes with every quote
// doubled (a comma, a quote or a line break stays inside its cell). Text that starts like a formula
// (= + - @, a tab, a carriage return) gets a ' in front: a spreadsheet would otherwise run it.
function cell(value: string | number | null): string {
  // TODO 1: quotes inside the text, formulas, a missing value
  return typeof value === 'string' ? `"${value}"` : String(value);
}

/** The inventory as CSV text, ready for a file: UTF-8 with a byte order mark, \r\n after every row */
export function inventoryCsv(items: GearItem[]): string {
  const rows = items.map((item) => [item.name, item.shed, item.count, item.lastChecked, item.note]);
  const lines = [columns, ...rows].map((row) => row.map(cell).join(','));
  // TODO 1: what tells a spreadsheet the text is UTF-8? Which line ending does the standard ask for?
  return lines.join('\n');
}
