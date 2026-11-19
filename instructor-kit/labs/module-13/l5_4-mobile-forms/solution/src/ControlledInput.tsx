import type { ComponentProps } from 'react';
import { type Control, type FieldPath, type FieldValues, useController } from 'react-hook-form';
import { StyleSheet, Text, TextInput, View } from 'react-native';

// TextInput's props, minus the ones React Hook Form provides. T is what the fields hold; Out is what the form
// gives back after the schema's checks (numbers instead of text).
type ControlledInputProps<T extends FieldValues, Out> = Omit<
  ComponentProps<typeof TextInput>,
  'value' | 'onChangeText' | 'onBlur' | 'ref'
> & {
  control: Control<T, unknown, Out>;
  name: FieldPath<T>;
  label: string;
};

// A labeled text field that belongs to a React Hook Form form. A phone has no HTML input for register() to
// find, so useController hands over the value, the change and blur handlers, the field's message and a ref:
// with it, setFocus('volunteers') and "focus the first field with a problem" work.
export function ControlledInput<T extends FieldValues, Out = T>({
  control,
  name,
  label,
  ...input
}: ControlledInputProps<T, Out>) {
  // Taken apart at once: the lint rules treat an object with a ref inside as a ref
  const {
    field: { ref, value, onChange, onBlur },
    fieldState: { error },
  } = useController({ control, name });
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        {...input}
        ref={ref}
        accessibilityLabel={label}
        value={value}
        onChangeText={onChange}
        onBlur={onBlur}
        style={styles.input}
      />
      {error?.message !== undefined && <Text style={styles.error}>{error.message}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  field: { gap: 4 },
  label: { fontWeight: '600', color: '#2a1257' },
  input: { minHeight: 48, paddingHorizontal: 12, borderWidth: 1, borderRadius: 8, borderColor: '#6b5a8e', fontSize: 16 },
  error: { color: '#b3261e' },
});
