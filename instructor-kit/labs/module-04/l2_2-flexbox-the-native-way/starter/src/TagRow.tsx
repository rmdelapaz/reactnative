import { StyleSheet, Text, View } from 'react-native';

import type { Site } from './types';

// Task 3a: the tags for a beach, plain TypeScript:
//   the terrain with a capital letter ('Sand', 'Rocky', 'Mixed', 'Marsh'), then 'Step-free access' when the beach
//   is accessible, then 'Free parking' when the parking line contains the word 'free' (any case).
export function siteTags(site: Site): string[] {
  throw new Error(`TODO 3: the tags for ${site.name}`);
}

// Task 3b: the tags as a row of small pills that wraps onto a second line when it runs out of room.
// As shipped each pill is a bar as wide as the panel, one under the other.
export function TagRow({ tags }: { tags: string[] }) {
  return (
    <View testID="tag-row" style={styles.tags}>
      {tags.map((tag) => (
        <View key={tag} style={styles.tag}>
          <Text style={styles.tagText}>{tag}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  tags: {
    gap: 8,
  },
  tag: {
    paddingVertical: 2,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: '#bfe3df',
  },
  tagText: {
    color: '#1f2a37',
  },
});
