import { StyleSheet, Text, View } from 'react-native';

import type { Site } from './types';

const terrainWords: Record<Site['terrain'], string> = {
  sand: 'Sand',
  rocky: 'Rocky',
  mixed: 'Mixed',
  marsh: 'Marsh',
};

// Plain TypeScript: the same function would work in a web app
export function siteTags(site: Site): string[] {
  const tags = [terrainWords[site.terrain]];
  if (site.accessible) tags.push('Step-free access');
  if (/\bfree\b/i.test(site.parking)) tags.push('Free parking');
  return tags;
}

// Wrapping chips: a row (so the pills keep their own widths), wrapping, with a gap between them
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
    flexDirection: 'row',
    flexWrap: 'wrap',
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
