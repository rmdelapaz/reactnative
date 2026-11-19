// Type tests (do not edit): npm run typecheck. Each line below MUST be a type error once TODO A is done.
// While a type is still `string`, tsc says "Unused '@ts-expect-error' directive" (TS2578) for its line.
import type { Category, Ticket, TicketStatus } from './types';

// @ts-expect-error: not one of the four repair tables
export const table: Category = 'garden';

// @ts-expect-error: "fixed" is spelled with a d
export const status: TicketStatus = 'fixd';

// @ts-expect-error: a ticket's number is a number, not a string
export const tag: Ticket['number'] = '7';

// No error here: a waiting ticket has no fixer yet
export const waiting: Ticket = { id: 'x', number: 99, item: 'Mixer', category: 'electronics', owner: 'Jo', status: 'waiting', problem: 'Hums.' };
