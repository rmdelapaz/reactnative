// A hazard a volunteer reports at a beach (practice data for this lab: shoreline-api has no
// hazard reports; MSW answers POST /api/sites/:siteId/hazards in the tests)
export type HazardKind = 'glass' | 'animal' | 'current';

export type HazardReport = {
  clientId: string; // made on the phone when the report is written: the same on every try
  siteId: string;
  kind: HazardKind;
  note: string;
  seenAt: string; // ISO time
};
