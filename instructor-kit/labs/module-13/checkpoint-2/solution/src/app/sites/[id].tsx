import { useLocalSearchParams } from 'expo-router';

import { SiteDetails } from '../../SiteDetails';

// The screen for one site: the file is app/sites/[id].tsx, so /sites/driftwood-cove opens it with id
// 'driftwood-cove' (the same screen a deep link opens)
export default function SiteRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <SiteDetails id={id} />;
}
