import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/Button';
import { createThemedStyles } from '@/hooks/useTheme';
import { radius, spacing } from '@/theme/spacing';

type PhotoStripProps = {
  photos: { uri: string }[];
  onRemove?: (uri: string) => void; // with it, each photo gets a Remove button
};

// A row of small photos (they wrap to the next line on a narrow phone)
export function PhotoStrip({ photos, onRemove }: PhotoStripProps) {
  const themed = useStyles();
  if (photos.length === 0) {
    return null;
  }
  return (
    <View style={styles.strip}>
      {photos.map((photo, index) => (
        <View key={photo.uri} style={styles.item}>
          <Image
            source={{ uri: photo.uri }} // a file on this phone (or a blob: in the web preview)
            style={[styles.photo, themed.photo]}
            contentFit="cover" // fill the square, cropping the edges
            accessibilityLabel={`Debris photo ${index + 1} of ${photos.length}`}
          />
          {onRemove && (
            <Button
              label="Remove"
              accessibilityLabel={`Remove photo ${index + 1}`}
              onPress={() => onRemove(photo.uri)}
            />
          )}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  strip: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  item: {
    gap: spacing.xs,
  },
  photo: {
    width: 96,
    height: 96,
    borderRadius: radius.picture,
  },
});

const useStyles = createThemedStyles(({ colors }) =>
  StyleSheet.create({
    photo: {
      backgroundColor: colors.picture, // shows while the photo loads
    },
  }),
);
