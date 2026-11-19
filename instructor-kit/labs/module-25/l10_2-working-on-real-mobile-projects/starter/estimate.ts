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
  throw new Error(`TODO 1: the three-point estimate of ${JSON.stringify(part)}`);
}

/** The sums of every part's three numbers, and the three-point estimate of the sums */
export function total(parts: readonly Part[]): Range {
  throw new Error(`TODO 1: the total of ${parts.length} parts`);
}

/** The kinds of work the breakdown has no part for yet, in the checklist's order */
export function forgotten(parts: readonly Part[]): WorkKind[] {
  throw new Error(`TODO 1: what is missing from ${parts.length} parts`);
}

/** What you tell the client: a range, and what it depends on */
export function sayRange(parts: readonly Part[], dependsOn: readonly string[]): string {
  throw new Error(`TODO 1: the sentence for ${parts.length} parts and ${dependsOn.length} assumptions`);
}
