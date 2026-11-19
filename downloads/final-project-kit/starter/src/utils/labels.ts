import type { ItemStatus } from '@/api/types';

// Words for each value of a union, as a Record: add a value to the union and every table that
// forgot it is a type error (Lesson 2.4 of the web course). Arrays of values would stay silent.
export const itemStatusLabels: Record<ItemStatus, string> = {
  open: 'Open',
  done: 'Done',
};

/** A value from outside the code (an API answer, the address) is one of the union's values */
export function isItemStatus(value: unknown): value is ItemStatus {
  return typeof value === 'string' && Object.hasOwn(itemStatusLabels, value);
}
