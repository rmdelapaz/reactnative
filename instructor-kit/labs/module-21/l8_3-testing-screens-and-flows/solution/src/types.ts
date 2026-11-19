// The shapes of the API answers this lab uses (the fields it reads; the API sends more)
export type Site = {
  id: string;
  name: string;
  town: string;
  accessible: boolean;
};

export type Cleanup = {
  id: string;
  title: string;
  siteId: string;
  meetingPoint: string;
  capacity: number;
  spotsTaken: number;
};
