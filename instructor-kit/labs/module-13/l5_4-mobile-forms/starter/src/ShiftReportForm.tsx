import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { type ShiftReport, shiftReportSchema, type ShiftReportValues } from './schema';

const emptyReport: ShiftReportValues = { leader: '', volunteers: '', hours: '' };

type ShiftReportFormProps = {
  onSend: (report: ShiftReport) => void;
};

// The crew leader's shift report: who led, how many volunteers came, how many hours the crew worked.
export function ShiftReportForm({ onSend }: ShiftReportFormProps) {
  const { register, handleSubmit } = useForm({
    resolver: zodResolver(shiftReportSchema),
    defaultValues: emptyReport,
    mode: 'onTouched',
  });

  // TODO 1: register() is a web tool: it reads an HTML input, and a phone has none. Use ControlledInput.
  // TODO 3: the return key: Next on Crew leader and Volunteers (moving the focus on), Go on Hours (sending the
  // report); and npm run typecheck rejects the button's onPress.
  return (
    <View style={styles.form}>
      <TextInput accessibilityLabel="Crew leader" autoCapitalize="words" {...register('leader')} />
      <TextInput accessibilityLabel="Volunteers" inputMode="numeric" {...register('volunteers')} />
      <TextInput accessibilityLabel="Hours" inputMode="decimal" {...register('hours')} />
      <Pressable accessibilityRole="button" onPress={handleSubmit(onSend)} style={styles.button}>
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
