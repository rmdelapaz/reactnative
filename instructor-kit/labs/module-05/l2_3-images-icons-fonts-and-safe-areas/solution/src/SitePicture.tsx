import { Image } from 'expo-image';
import { StyleSheet } from 'react-native';

import type { Site } from './types';

// A picture from a server has no size until it loads: the parent's width and the picture's own proportions
// (sent by the API) give it one now. accessibilityLabel becomes the web preview's alt; alt alone does not.
export function SitePicture({ site }: { site: Site }) {
  return (
    <Image
      source={site.image.url}
      accessible
      accessibilityLabel={site.image.alt}
      style={[styles.picture, { aspectRatio: site.image.width / site.image.height }]}
      contentFit="cover"
      transition={200}
    />
  );
}

const styles = StyleSheet.create({
  picture: { borderRadius: 8, backgroundColor: '#bfe3df' }, // Seafoam fills the frame while the picture loads
});
