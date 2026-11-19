// Pick up a gear kit at the supply van with the code on its tag. The server decides; the screen
// shows the kit as the server says it is.
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Controller, useForm } from 'react-hook-form';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { describeError, getKit, pickUpKit } from './kitApi';
import { type PickupValues, pickupSchema } from './schemas';

export function PickupForm({ kitId }: { kitId: string }) {
  const kit = useQuery({ queryKey: ['kits', kitId], queryFn: () => getKit(kitId) });
  const pickUp = useMutation({
    mutationFn: (code: string) => pickUpKit(kitId, code),
  });
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(pickupSchema), defaultValues: { code: '' } });

  async function submit({ code }: PickupValues) {
    try {
      await pickUp.mutateAsync(String(code));
    } catch (error) {
      // TODO (Task 3): where does the server's message for the code belong?
      setError('root.server', { message: describeError(error) });
    }
  }

  if (kit.data === undefined) {
    return <Text>{kit.isError ? describeError(kit.error) : 'Loading the kit…'}</Text>;
  }
  if (kit.data.status === 'picked-up') {
    return <Text accessibilityRole="header">{kit.data.label}: picked up. Have a good cleanup!</Text>;
  }
  return (
    <View style={styles.form}>
      <Text accessibilityRole="header">{kit.data.label}</Text>
      <Text>Type the 4-digit code on the tag.</Text>
      <Controller
        control={control}
        name="code"
        render={({ field: { onBlur, onChange, value } }) => (
          <TextInput
            accessibilityLabel="Code on the tag"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            inputMode="numeric"
            maxLength={4}
            style={styles.input}
          />
        )}
      />
      {errors.code !== undefined && <Text accessibilityRole="alert">{errors.code.message}</Text>}
      {errors.root?.server !== undefined && (
        <Text accessibilityRole="alert">{errors.root.server.message}</Text>
      )}
      <Pressable
        accessibilityRole="button"
        disabled={isSubmitting}
        onPress={() => void handleSubmit(submit)()}
        style={styles.button}
      >
        <Text>{isSubmitting ? 'Picking up…' : 'Pick up'}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  form: { gap: 12 },
  input: { borderWidth: 1, borderRadius: 8, padding: 12, fontSize: 18 },
  button: { alignItems: 'center', padding: 12, borderRadius: 8, backgroundColor: '#d9ecea' },
});
