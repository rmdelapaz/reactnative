// A tool lent from the crew's gear shed (practice data for this lab: shoreline-api has no gear loans)
export type GearLoan = {
  id: string; // 'l-201'
  item: string; // 'Litter grabber'
  dueDate: string; // the day it is due back at the shed: 'YYYY-MM-DD', the crew's own time zone
  status: 'out' | 'returned';
};
