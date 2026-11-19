// Split a list into rows of `size` items: [a, b, c] in rows of 2 is [[a, b], [c]]
export function toRows<T>(items: T[], size: number): T[][] {
  const rows: T[][] = [];
  for (let start = 0; start < items.length; start += size) {
    rows.push(items.slice(start, start + size));
  }
  return rows;
}
