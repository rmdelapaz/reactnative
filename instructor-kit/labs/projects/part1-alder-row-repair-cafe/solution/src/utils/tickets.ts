import type { BadgeTone } from '../theme/colors';
import type { Category, Ticket, TicketStatus } from '../types';

// The words the screen shows: one entry per member of each union (tsc lists a missing one)
export const categoryLabels: Record<Category, string> = {
  electronics: 'Electronics',
  textiles: 'Clothing and bags',
  bikes: 'Bikes',
  furniture: 'Furniture',
};

export const statusLabels: Record<TicketStatus, string> = {
  waiting: 'Waiting',
  'in-repair': 'In repair',
  fixed: 'Fixed',
  'not-fixable': "Can't be fixed",
};

export const statusTones: Record<TicketStatus, BadgeTone> = {
  waiting: 'neutral',
  'in-repair': 'info',
  fixed: 'success',
  'not-fixable': 'danger',
};

// The tables in the order they stand in the hall
export const categories: readonly Category[] = ['electronics', 'textiles', 'bikes', 'furniture'];

// Finished = it went home today, repaired or not
export function isFinished(status: TicketStatus): boolean {
  return status === 'fixed' || status === 'not-fixable';
}

// The item or the owner's name contains the search, ignoring case and spaces around it
export function matchesSearch(ticket: Ticket, query: string): boolean {
  const q = query.trim().toLowerCase();
  return q === '' || ticket.item.toLowerCase().includes(q) || ticket.owner.toLowerCase().includes(q);
}

// The tickets the screen shows: worked out on every render, never stored
export function filterTickets(tickets: Ticket[], query: string, hideFinished: boolean): Ticket[] {
  return tickets.filter((ticket) => matchesSearch(ticket, query) && !(hideFinished && isFinished(ticket.status)));
}

// "12 tickets" when all show, "3 of 12 tickets" while filtering
export function countLabel(shown: number, total: number): string {
  return shown === total ? `${total} tickets` : `${shown} of ${total} tickets`;
}

// One table and its tickets: the shape SectionList wants
export type TableSection = { title: string; data: Ticket[] };

// The tickets under their tables, in hall order, leaving out tables with nothing on them
export function groupByCategory(tickets: Ticket[]): TableSection[] {
  return categories
    .map((category) => ({ title: categoryLabels[category], data: tickets.filter((t) => t.category === category) }))
    .filter((section) => section.data.length > 0);
}
