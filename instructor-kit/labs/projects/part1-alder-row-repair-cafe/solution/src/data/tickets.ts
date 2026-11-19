import type { Ticket } from '../types';

// Today's repair queue at Alder Row Repair Café (the coordinator's sign-in sheet, typed in)
export const tickets: Ticket[] = [
  { id: 't01', number: 1, item: 'Table lamp', category: 'electronics', owner: 'Mara', status: 'fixed', fixer: 'Ade', problem: 'Flickers when the switch is touched.' },
  { id: 't02', number: 2, item: 'Toaster', category: 'electronics', owner: 'Wen', status: 'in-repair', fixer: 'Ade', problem: 'Only one side gets hot.' },
  { id: 't03', number: 3, item: 'Denim jacket', category: 'textiles', owner: 'Luis', status: 'waiting', problem: 'A torn pocket and a missing button.' },
  { id: 't04', number: 4, item: "Child's bike", category: 'bikes', owner: 'Priya', status: 'in-repair', fixer: 'Gus', problem: 'The chain slips on the big gear.' },
  { id: 't05', number: 5, item: 'Kitchen chair', category: 'furniture', owner: 'Tom', status: 'waiting', problem: 'One leg wobbles.' },
  { id: 't06', number: 6, item: 'Radio', category: 'electronics', owner: 'Ines', status: 'not-fixable', fixer: 'Ade', problem: 'A burnt circuit board, and no spare part to be found.' },
  { id: 't07', number: 7, item: 'Wool sweater', category: 'textiles', owner: 'Hana', status: 'fixed', fixer: 'Bea', problem: 'A hole in the left elbow.' },
  { id: 't08', number: 8, item: 'Road bike', category: 'bikes', owner: 'Sam', status: 'waiting', problem: 'The rear brake rubs the wheel.' },
  { id: 't09', number: 9, item: 'Bookshelf', category: 'furniture', owner: 'Ola', status: 'fixed', fixer: 'Gus', problem: 'A loose back panel.' },
  { id: 't10', number: 10, item: 'Headphones', category: 'electronics', owner: 'Kit', status: 'waiting', problem: 'No sound on the right side.' },
  { id: 't11', number: 11, item: 'Backpack', category: 'textiles', owner: 'Dev', status: 'in-repair', fixer: 'Bea', problem: 'A broken zipper.' },
  { id: 't12', number: 12, item: 'Desk fan', category: 'electronics', owner: 'Ruth', status: 'waiting', problem: 'Makes a grinding noise.' },
];
