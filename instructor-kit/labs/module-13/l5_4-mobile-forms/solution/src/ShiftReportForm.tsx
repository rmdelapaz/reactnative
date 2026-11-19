import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ControlledInput } from './ControlledInput';
import { type ShiftReport, shiftReportSchema, type ShiftReportValues } from './schema';

const emptyReport: ShiftReportValues = { leader: '', volunteers: '', hours: '' };

type ShiftReportFormProps = {
  onSend: (report: ShiftReport) => void;
};

// The crew leader's shift report: who led, how many volunteers came, how many hours the crew worked.
export function ShiftReportForm({ onSend }: ShiftReportFormProps) {
  const { control, handleSubmit, setFocus } = useForm({
    resolver: zodResolver(shiftReportSchema),
    defaultValues: emptyReport,
    mode: 'onTouched',
  });

  // Check, then send. Called with no arguments: handleSubmit expects a web form event, and a phone's press and
  // return key send different events
  const send = handleSubmit(onSend);

  return (
    <View style={styles.form}>
      <ControlledInput
        control={control}
        name="leader"
        label="Crew leader"
        autoCapitalize="words"
        autoComplete="name"
        enterKeyHint="next" // the return key says Next...
        submitBehavior="submit" // ...keeps the keyboard up...
        onSubmitEditing={() => setFocus('volunteers')} // ...and moves on
      />
      <ControlledInput
        control={control}
        name="volunteers"
        label="Volunteers"
        inputMode="numeric" // the number pad (on iPhone it has no return key: the button below sends)
        enterKeyHint="next"
        submitBehavior="submit"
        onSubmitEditing={() => setFocus('hours')}
      />
      <ControlledInput
        control={control}
        name="hours"
        label="Hours"
        inputMode="decimal" // digits and a decimal point, or a comma
        placeholder="For example 2.5"
        enterKeyHint="go" // the last field: the return key sends
        onSubmitEditing={() => send()}
      />
      <Pressable accessibilityRole="button" onPress={() => send()} style={styles.button}>
        <Text style={styles.buttonText}>Send report</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  form: { gap: 16, padding: 16 },
  button: { minHeight: 48, justifyContent: 'center', alignItems: 'center', borderRadius: 8, backgroundColor: '#6534c4' },
  buttonText: { color: '#ffffff', fontWeight: 'bold' },
});
