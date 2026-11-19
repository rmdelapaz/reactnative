// What the repair café sorts its tickets by: the four repair tables
export type Category = 'electronics' | 'textiles' | 'bikes' | 'furniture';

// Where a ticket is today: waiting for a fixer, on a table, done, or given back unrepaired
export type TicketStatus = 'waiting' | 'in-repair' | 'fixed' | 'not-fixable';

// One item a neighbor brought in
export type Ticket = {
  id: string;
  number: number; // the number on the paper tag tied to the item
  item: string;
  category: Category;
  owner: string; // first name only
  status: TicketStatus;
  fixer?: string; // only once a fixer has picked it up
  problem: string;
};
