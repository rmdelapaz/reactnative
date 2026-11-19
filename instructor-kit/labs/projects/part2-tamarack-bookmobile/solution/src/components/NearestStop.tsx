import { useQuery } from '@tanstack/react-query';
import * as Location from 'expo-location';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import type { Stop } from '@/api/types';
import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { ErrorView } from '@/components/ErrorView';
import { LoadingView } from '@/components/LoadingView';
import { PermissionGate } from '@/components/PermissionGate';
import { usePermission } from '@/hooks/usePermission';
import { changeMyStop, useMyStop } from '@/state/myStop';
import { spacing } from '@/theme/spacing';
import { formatDistance } from '@/utils/distance';
import { nearestStop } from '@/utils/nearest';

// TODO R5d (done). "Find my nearest stop" (Lessons 6.1 and 6.3). Nothing asks for the location
// until the patron presses the button: that press is the moment the question makes sense.
export function NearestStop({ stops }: { stops: Stop[] }) {
  const [wanted, setWanted] = useState(false);
  return (
    <View style={styles.panel}>
      <AppText variant="heading" accessibilityRole="header">
        Nearest stop
      </AppText>
      {wanted ? (
        <FromHere stops={stops} onNotNow={() => setWanted(false)} />
      ) : (
        <>
          <AppText variant="muted">Find the stop closest to where you are now.</AppText>
          <Button label="Find my nearest stop" onPress={() => setWanted(true)} />
        </>
      )}
    </View>
  );
}

// Mounted only after the press: the permission Hook reads the answer here, and asks nobody
function FromHere({ stops, onNotNow }: { stops: Stop[]; onNotNow: () => void }) {
  const location = usePermission(Location.useForegroundPermissions());
  return (
    <PermissionGate
      permission={location}
      what="your location"
      why="Bookmobile Stops uses your location once, on this phone, to find the closest stop. It is not sent anywhere."
      onNotNow={onNotNow}
    >
      <Nearest stops={stops} />
    </PermissionGate>
  );
}

// Only rendered after a yes: read where the phone is, once, and compare
function Nearest({ stops }: { stops: Stop[] }) {
  const myStopId = useMyStop();
  const here = useQuery({
    queryKey: ['position'],
    queryFn: () => Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced }),
    networkMode: 'always', // the phone finds itself without the internet
    staleTime: 60_000,
    retry: false,
  });

  if (here.isPending) {
    return <LoadingView label="Finding where you are…" />;
  }
  if (here.isError) {
    return (
      <ErrorView
        message="Could not find where you are. Check that location is turned on, then try again."
        onRetry={() => here.refetch()}
      />
    );
  }
  const nearest = nearestStop(stops, here.data.coords);
  if (nearest === null) {
    return <AppText>There are no stops to compare yet.</AppText>;
  }
  return (
    <View style={styles.panel}>
      <AppText accessibilityLiveRegion="polite">
        Your nearest stop is {nearest.stop.name}, {formatDistance(nearest.km)} away.
      </AppText>
      {nearest.stop.id === myStopId ? (
        <AppText variant="muted">This is your stop.</AppText>
      ) : (
        <Button label="Make this my stop" variant="primary" onPress={() => changeMyStop(nearest.stop.id)} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    gap: spacing.sm,
  },
});
