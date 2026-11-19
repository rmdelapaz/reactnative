import { useState } from 'react';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import type { LogbookEntry } from '@/storage/logbook';
import { logbookCsv, shareLogbook } from '@/storage/logbookExport';

type ShareLogbookProps = {
  entries: LogbookEntry[];
};

type ShareStep =
  | { step: 'ready' }
  | { step: 'working' }
  | { step: 'no-sheet'; csv: string }
  | { step: 'failed' };

// Share the logbook as a spreadsheet file (new). Where files cannot be shared, the volunteer
// still gets the same rows, as text to copy.
export function ShareLogbook({ entries }: ShareLogbookProps) {
  const [state, setState] = useState<ShareStep>({ step: 'ready' });

  async function share() {
    setState({ step: 'working' });
    try {
      const result = await shareLogbook(entries);
      setState(
        result === 'done' ? { step: 'ready' } : { step: 'no-sheet', csv: logbookCsv(entries) },
      );
    } catch (error) {
      console.warn('Could not share the logbook', error);
      setState({ step: 'failed' });
    }
  }

  return (
    <>
      <AppText>
        Share your logbook as a spreadsheet file, one row per log: with your crew coordinator, or
        with yourself.
      </AppText>
      <Button
        label={state.step === 'working' ? 'Preparing the file…' : 'Share my logbook'}
        disabled={state.step === 'working'}
        onPress={share}
      />
      {state.step === 'no-sheet' && (
        <>
          <AppText accessibilityLiveRegion="polite">
            Files cannot be shared here (the web preview never can). On your phone, this button
            opens the share sheet with the file. These are its rows, ready to copy:
          </AppText>
          {/* The same text as the file, without the mark at its start that only spreadsheets need */}
          <AppText variant="muted" selectable>
            {state.csv.replace('\uFEFF', '').trim()}
          </AppText>
        </>
      )}
      {state.step === 'failed' && (
        <AppText variant="error" accessibilityRole="alert">
          Could not share your logbook. Try again in a moment.
        </AppText>
      )}
    </>
  );
}
