import { StyleSheet, View } from 'react-native';

import type { Site } from '@/api/types';
import { AppText } from '@/components/AppText';
import { Icon } from '@/components/Icon';
import { createThemedStyles } from '@/hooks/useTheme';
import { radius, spacing } from '@/theme/spacing';

type SiteMapProps = {
  site: Site;
  meetingPoint: string;
};

// The web preview's SiteMap. react-native-maps draws the phone's own map views, which a browser
// does not have (importing it here stops the web build), so the same place goes in words instead.
export function SiteMap({ site, meetingPoint }: SiteMapProps) {
  const themed = useStyles();
  return (
    <View style={[styles.box, themed.box]}>
      <Icon name="place" size={32} />
      <AppText style={styles.center}>
        Meet at {meetingPoint}, {site.name}.
      </AppText>
      <AppText variant="muted" style={styles.center}>
        The map shows in the app on a phone. In the web preview, Open in Maps shows the place in a
        new browser tab.
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    height: 220, // the same space the map takes on a phone
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.picture,
    borderWidth: 1,
  },
  center: {
    textAlign: 'center',
  },
});

const useStyles = createThemedStyles(({ colors }) =>
  StyleSheet.create({
    box: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
    },
  }),
);
