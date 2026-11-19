// One kind of gear in the crew's sheds (practice data for this lab)
export type GearItem = {
  name: string; // 'Litter grabber'
  shed: string; // 'North shed'
  count: number;
  lastChecked: string | null; // 'YYYY-MM-DD', or null: never counted
  note: string; // typed on a phone keyboard: anything at all
};
