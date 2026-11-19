import { AppText } from '@/components/AppText';
import { Screen } from '@/components/Screen';

// The logbook: debris logs recorded at cleanups, kept on the phone until they are sent
export default function LogbookScreen() {
  return (
    <Screen scroll edges={['left', 'right']}>
      <AppText variant="heading" accessibilityRole="header">
        Your logbook is empty
      </AppText>
      <AppText>
        At a cleanup, you will record what the crew collected here: counts, bags and weight. The
        logbook keeps every record on your phone, even with no signal, and sends it when you are
        back online.
      </AppText>
    </Screen>
  );
}
