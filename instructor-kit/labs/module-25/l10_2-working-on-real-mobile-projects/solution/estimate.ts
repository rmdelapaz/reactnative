// Task 1: an estimate is a range from a task breakdown (Lesson 10.2, "Estimating Mobile Work").
// The work phones add, as a union with a Record of reminders: a checklist TypeScript keeps complete.
export type WorkKind =
  | 'happy path'
  | 'server'
  | 'permissions'
  | 'offline'
  | 'two platforms'
  | 'tests'
  | 'privacy and stores'
  | 'shipping';

export const reminders: Record<WorkKind, string> = {
  'happy path': 'The screens, the buttons and the code that does the job',
  server: 'Does the API already do it? Who adds the endpoint, and when?',
  permissions: 'The question at the right moment, and a way forward after no',
  offline: 'Does it work without a signal, or say clearly that it cannot?',
  'two platforms': 'An Android phone and an iPhone, small and large text, light and dark',
  tests: 'The new rule in Jest, the changed screen in a screen test',
  'privacy and stores': 'New data: the inventory and both stores’ privacy answers change',
  shipping: 'A new native package or setting needs a build; JavaScript alone can be an update',
};

export interface Part {
  kind: WorkKind;
  what: string;
  /** Hours if everything goes right, the likely hours, and the realistic bad case */
  optimistic: number;
  likely: number;
  pessimistic: number;
}

export interface Range {
  optimistic: number;
  likely: number;
  pessimistic: number;
  /** (optimistic + 4 x likely + pessimistic) / 6 */
  threePoint: number;
}

/** The three-point (PERT) estimate of one part */
export function threePoint(part: Pick<Part, 'optimistic' | 'likely' | 'pessimistic'>): number {
  return (part.optimistic + 4 * part.likely + part.pessimistic) / 6;
}

/** The sums of every part's three numbers, and the three-point estimate of the sums */
export function total(parts: readonly Part[]): Range {
  const sum = (key: 'optimistic' | 'likely' | 'pessimistic') =>
    parts.reduce((hours, part) => hours + part[key], 0);
  const range = { optimistic: sum('optimistic'), likely: sum('likely'), pessimistic: sum('pessimistic') };
  return { ...range, threePoint: threePoint(range) };
}

function isWorkKind(value: string): value is WorkKind {
  return Object.hasOwn(reminders, value);
}

/** The kinds of work the breakdown has no part for yet, in the checklist's order */
export function forgotten(parts: readonly Part[]): WorkKind[] {
  return Object.keys(reminders)
    .filter(isWorkKind)
    .filter((kind) => !parts.some((part) => part.kind === kind));
}

/** What you tell the client: a range, and what it depends on */
export function sayRange(parts: readonly Part[], dependsOn: readonly string[]): string {
  const range = total(parts);
  const sentence = `About ${Math.round(range.threePoint)} hours, between ${range.optimistic} and ${range.pessimistic}`;
  return dependsOn.length === 0 ? `${sentence}.` : `${sentence}, once ${dependsOn.join(' and ')}.`;
}
