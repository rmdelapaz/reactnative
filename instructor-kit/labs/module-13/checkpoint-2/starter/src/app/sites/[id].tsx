import { useLocalSearchParams } from 'expo-router';

import { SiteDetails } from '../../SiteDetails';

// The screen for one site: the file is app/sites/[id].tsx, so /sites/driftwood-cove opens it.
// TODO 1a: the screen never finds its site. Which name does this file give the part of the address?
export default function SiteRoute() {
  const { siteId } = useLocalSearchParams<{ siteId: string }>();
  return <SiteDetails id={siteId} />;
}
