import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  FadeIn,
  FadeOutLeft,
  LayoutAnimationConfig,
  LinearTransition,
} from 'react-native-reanimated';

type TagListProps = { tags: string[]; onRemove: (tag: string) => void };

// Task 3: the tags on a beach photo ("Glass", "Rope", ...). A removed tag should slide out to the left as it
// fades, the tags after it glide into the gap, a new tag fade in, and the tags that are there when the
// list first appears simply be there.
export function TagList({ tags, onRemove }: TagListProps) {
  return (
    // What is there when the list first appears is not news: only later arrivals fade in
    <LayoutAnimationConfig skipEntering>
      {/* No layout on the box: it only gets shorter, and a transition here fights the tags' own */}
      <View testID="tag-box" style={styles.box}>
        {tags.map((tag) => (
          <Animated.View
            key={tag}
            testID={`tag-${tag}`}
            entering={FadeIn}
            exiting={FadeOutLeft}
            layout={LinearTransition}
            style={styles.tag}
          >
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Remove ${tag}`}
              onPress={() => onRemove(tag)}
              style={styles.press}
            >
              <Text>{tag}</Text>
            </Pressable>
          </Animated.View>
        ))}
      </View>
    </LayoutAnimationConfig>
  );
}

const styles = StyleSheet.create({
  box: { gap: 8 },
  tag: { borderRadius: 8, backgroundColor: '#bfe3df' },
  press: { minHeight: 48, justifyContent: 'center', paddingHorizontal: 16 },
});
