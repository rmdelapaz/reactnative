// Something a volunteer found on the beach and handed to the crew leader: a phone, keys, a ring
// (practice data for this lab: shoreline-api has no lost and found; MSW answers in the tests)
export type FoundItem = {
  clientId: string; // made on the phone when the item is written down: the same on every try
  siteId: string;
  what: string;
  foundAt: string; // ISO time
};

/** A photo of the item: the file on this phone, its kind, and its id on the server once uploaded */
export type ItemPhoto = {
  uri: string;
  type: string; // 'image/jpeg', 'image/png' or 'image/webp': what the API takes
  photoId: string | null; // null until the upload worked
};
