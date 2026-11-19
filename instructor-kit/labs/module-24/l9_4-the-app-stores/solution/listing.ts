// Store-listing limits, as Lesson 9.4's "The Store Listing" quotes App Store Connect and the Google Play Console.
// Check the consoles before a real release: the stores change their limits.
export type Listing = {
  name: string; // both stores: up to 30 characters (App Store Connect: at least 2)
  subtitle: string; // App Store Connect: up to 30 characters
  promotionalText: string; // App Store Connect: up to 170 characters
  keywords: string; // App Store Connect: up to 100 BYTES, comma-separated
  shortDescription: string; // Google Play: up to 80 characters
  description: string; // both stores: up to 4,000 characters
};

const characters = (text: string) => [...text].length;

// App Store Connect counts keywords in bytes (UTF-8), not characters: an é is two bytes
export function utf8Bytes(text: string): number {
  return new TextEncoder().encode(text).length;
}

function over(field: string, count: number, limit: number, unit: string, store: string): string[] {
  return count > limit ? [`${field}: ${count} ${unit} (${store} allows ${limit})`] : [];
}

export function listingProblems(listing: Listing): string[] {
  const name = characters(listing.name);
  return [
    ...(name < 2 ? [`name: ${name} character (App Store Connect needs at least 2)`] : []),
    ...over('name', name, 30, 'characters', 'both stores'),
    ...over('subtitle', characters(listing.subtitle), 30, 'characters', 'App Store Connect'),
    ...over('promotionalText', characters(listing.promotionalText), 170, 'characters', 'App Store Connect'),
    ...over('keywords', utf8Bytes(listing.keywords), 100, 'bytes', 'App Store Connect'),
    ...over('shortDescription', characters(listing.shortDescription), 80, 'characters', 'Google Play'),
    ...over('description', characters(listing.description), 4000, 'characters', 'both stores'),
  ];
}
