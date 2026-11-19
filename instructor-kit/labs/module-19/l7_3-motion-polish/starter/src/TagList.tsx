import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { LinearTransition } from 'react-native-reanimated';

type TagListProps = { tags: string[]; onRemove: (tag: string) => void };

// Task 3: the tags on a beach photo ("Glass", "Rope", ...). A removed tag should slide out to the left as it
// fades, the tags after it glide into the gap, a new tag fade in, and the tags that are there when the
// list first appears simply be there.
export function TagList({ tags, onRemove }: TagListProps) {
  // TODO 3: layout is on the box, which only gets shorter; the tags that move have none, and nothing
  // enters or leaves
  return (
    <Animated.View testID="tag-box" style={styles.box} layout={LinearTransition}>
      {tags.map((tag) => (
        <View key={tag} testID={`tag-${tag}`} style={styles.tag}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Remove ${tag}`}
            onPress={() => onRemove(tag)}
            style={styles.press}
          >
            <Text>{tag}</Text>
          </Pressable>
        </View>
      ))}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  box: { gap: 8 },
  tag: { borderRadius: 8, backgroundColor: '#bfe3df' },
  press: { minHeight: 48, justifyContent: 'center', paddingHorizontal: 16 },
});
