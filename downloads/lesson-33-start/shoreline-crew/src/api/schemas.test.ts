import { debrisLogSchema, toNewLog, type DebrisLogValues } from '@/api/schemas';
import type { DebrisCategory } from '@/api/types';
import { debrisCategories } from '@/utils/debris';

// The form as it opens: every box empty except the ones a test fills in
function formValues(changes: Partial<DebrisLogValues> = {}): DebrisLogValues {
  const counts = Object.fromEntries(debrisCategories.map((category) => [category, '0']));
  return {
    counts: counts as Record<DebrisCategory, string>,
    bags: '1',
    weightKg: '2.5',
    note: '',
    ...changes,
  };
}

// The first message for one field, or undefined when that field is fine
function messageFor(values: DebrisLogValues, field: string) {
  const result = debrisLogSchema.safeParse(values);
  return result.error?.issues.find((issue) => issue.path.join('.') === field)?.message;
}

describe('debrisLogSchema', () => {
  it('turns typed text into numbers and lists only the debris that was found', () => {
    const values = formValues();
    values.counts['plastic-bottles'] = ' 12 ';
    values.counts.glass = '3';
    expect(debrisLogSchema.parse(values)).toEqual({
      bags: 1,
      weightKg: 2.5,
      note: '',
      items: [
        { category: 'plastic-bottles', count: 12 },
        { category: 'glass', count: 3 },
      ],
    });
  });

  it('reads a decimal comma as a point', () => {
    expect(debrisLogSchema.parse(formValues({ weightKg: '2,5' })).weightKg).toBe(2.5);
  });

  it("answers with the API's own messages", () => {
    expect(messageFor(formValues({ bags: '' }), 'bags')).toBe(
      'Bags must be a whole number from 0 to 500.',
    );
    expect(messageFor(formValues({ weightKg: 'lots' }), 'weightKg')).toBe(
      'Weight must be a number of kilograms from 0 to 5000.',
    );
    const values = formValues();
    values.counts.foam = '1.5';
    expect(messageFor(values, 'counts.foam')).toBe('Count must be a whole number from 0 to 100000.');
  });
});

describe('toNewLog', () => {
  it('adds the id and the time made on the phone', () => {
    const data = debrisLogSchema.parse(formValues());
    const log = toNewLog(data, 'log-0001', new Date('2026-07-04T17:30:00Z'));
    expect(log).toMatchObject({ clientId: 'log-0001', recordedAt: '2026-07-04T17:30:00.000Z' });
  });
});
