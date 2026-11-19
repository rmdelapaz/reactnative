import type { BadgeTone } from '../theme/colors';
import type { Category, Ticket, TicketStatus } from '../types';

// TODO B: the words and the rules. Each function says what it must do; the tests in src/project.test.tsx are
// the café's acceptance criteria. Make the three tables Record<...> once TODO A has made the unions.
export const categoryLabels = {} as Record<Category, string>;

export const statusLabels = {} as Record<TicketStatus, string>;

export const statusTones = {} as Record<TicketStatus, BadgeTone>;

// The tables in the order they stand in the hall: electronics, textiles, bikes, furniture
export const categories: readonly Category[] = [];

// Finished = it went home today, repaired ("fixed") or not ("not-fixable")
export function isFinished(status: TicketStatus): boolean {
  throw new Error(`TODO B: is ${status} finished?`);
}

// The item or the owner's name contains the search, ignoring case and spaces around it
export function matchesSearch(ticket: Ticket, query: string): boolean {
  throw new Error(`TODO B: does ${ticket.item} match "${query}"?`);
}

// The tickets the screen shows: worked out on every render, never stored
export function filterTickets(tickets: Ticket[], query: string, hideFinished: boolean): Ticket[] {
  throw new Error(`TODO B: filter ${tickets.length} tickets (${query}, ${hideFinished})`);
}

// "12 tickets" when all show, "3 of 12 tickets" while filtering
export function countLabel(shown: number, total: number): string {
  throw new Error(`TODO B: the count for ${shown} of ${total}`);
}

// One table and its tickets: the shape SectionList wants
export type TableSection = { title: string; data: Ticket[] };

// The tickets under their tables, in hall order, leaving out tables with nothing on them
export function groupByCategory(tickets: Ticket[]): TableSection[] {
  throw new Error(`TODO B: group ${tickets.length} tickets by table`);
}
