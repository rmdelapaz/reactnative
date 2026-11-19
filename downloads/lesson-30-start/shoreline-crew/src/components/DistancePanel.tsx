import { useQuery } from '@tanstack/react-query';
import * as Location from 'expo-location';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import type { Site } from '@/api/types';
import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { ErrorView } from '@/components/ErrorView';
import { LoadingView } from '@/components/LoadingView';
import { PermissionGate } from '@/components/PermissionGate';
import { usePermission } from '@/hooks/usePermission';
import { spacing } from '@/theme/spacing';
import { distanceKm, formatDistance } from '@/utils/distance';

type DistancePanelProps = {
  site: Site;
};

// "How far is it?" on a cleanup's screen. Nothing asks for the location until the volunteer
// presses Show my distance: that press is the moment the question makes sense.
export function DistancePanel({ site }: DistancePanelProps) {
  const [wanted, setWanted] = useState(false);
  return (
    <View style={styles.panel}>
      <AppText variant="heading" accessibilityRole="header">
        How far is it?
      </AppText>
      {wanted ? (
        <DistanceFromHere site={site} onNotNow={() => setWanted(false)} />
      ) : (
        <>
          <AppText variant="muted">See how far you are from {site.name}, in a straight line.</AppText>
          <Button label="Show my distance" onPress={() => setWanted(true)} />
        </>
      )}
    </View>
  );
}

// Mounted only after the press: the permission Hook reads the answer here, and asks nobody
function DistanceFromHere({ site, onNotNow }: { site: Site; onNotNow: () => void }) {
  const location = usePermission(Location.useForegroundPermissions());
  return (
    <PermissionGate
      permission={location}
      what="your location"
      why={`Shoreline Crew uses your location once, on this phone, to work out how far you are from ${site.name}. It is not sent anywhere.`}
      onNotNow={onNotNow}
    >
      <Distance site={site} />
    </PermissionGate>
  );
}

// Only rendered after a yes: read where the phone is, once, and compare
function Distance({ site }: { site: Site }) {
  const here = useQuery({
    queryKey: ['position'],
    queryFn: () => Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced }),
    networkMode: 'always', // the phone finds itself without the internet
    staleTime: 60_000, // a minute-old position is good enough for "how far"
    retry: false,
  });

  if (here.isPending) {
    return <LoadingView label="Finding where you are…" />;
  }
  if (here.isError) {
    return (
      <ErrorView
        message="Could not find where you are. Check that location is turned on for your phone, then try again."
        onRetry={() => here.refetch()}
      />
    );
  }
  const km = distanceKm(here.data.coords, site);
  return (
    <AppText accessibilityLiveRegion="polite">
      You are {formatDistance(km)} from {site.name}.
    </AppText>
  );
}

const styles = StyleSheet.create({
  panel: {
    gap: spacing.sm,
  },
});
