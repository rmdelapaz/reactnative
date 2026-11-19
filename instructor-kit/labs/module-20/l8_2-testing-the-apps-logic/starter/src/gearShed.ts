import { create } from 'zustand';

// The crew's gear shed: grabbers, buckets and sieves lent out on a cleanup day. Like the app's log queue,
// the store lives in a module, so it keeps its state from one test to the next.
export type Loan = { itemId: string; volunteerId: string };

type GearShed = {
  loans: Loan[];
  /** Lend an item; false when it is already out (one borrower per item) */
  borrow(itemId: string, volunteerId: string): boolean;
  giveBack(itemId: string): void;
};

export const useGearShed = create<GearShed>()((set, get) => ({
  loans: [],
  borrow(itemId, volunteerId) {
    if (get().loans.some((loan) => loan.itemId === itemId)) return false;
    set({ loans: [...get().loans, { itemId, volunteerId }] });
    return true;
  },
  giveBack(itemId) {
    set({ loans: get().loans.filter((loan) => loan.itemId !== itemId) });
  },
}));
