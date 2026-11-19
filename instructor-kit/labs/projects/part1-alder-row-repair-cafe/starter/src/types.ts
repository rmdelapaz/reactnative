// TODO A: describe the data in src/data/tickets.ts exactly (Lesson 2.5's colors and Lesson 3.1's sections use
// the same tools: a union of words, a type for one item). Replace each `string` that has a fixed set of words
// with a union, and make the fields match the data: tsc (npm run typecheck) tells you when they do.
export type Category = string;

export type TicketStatus = string;

export type Ticket = {
  id: string;
  item: string;
  category: Category;
  owner: string;
  status: TicketStatus;
  problem: string;
};
