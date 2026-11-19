import { Image } from 'expo-image';

import type { Site } from './types';

// Task 1: the beach's picture at the top of a card. As written it is invisible on every platform (an expo-image
// with no size is 0 tall: no error, no warning), and in the web preview it has no alt text either. Give it a size
// from the API's own numbers (the card's width + an aspectRatio) and a description screen readers can read.
export function SitePicture({ site }: { site: Site }) {
  return <Image source={site.image.url} alt={site.image.alt} contentFit="cover" />;
}
