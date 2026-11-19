import type { ComponentProps } from 'react';
import { type Control, type FieldPath, type FieldValues, useController } from 'react-hook-form';

import { FormField } from '@/components/FormField';

// FormField's props, minus the ones React Hook Form now provides. T is what the fields hold;
// Out is what the form gives back after the schema's checks (numbers instead of text, ...).
type ControlledFieldProps<T extends FieldValues, Out> = Omit<
  ComponentProps<typeof FormField>,
  'value' | 'onChangeText' | 'onBlur' | 'error' | 'ref'
> & {
  control: Control<T, unknown, Out>;
  name: FieldPath<T>;
};

// A FormField that belongs to a React Hook Form form. A phone has no HTML input for register()
// to find, so useController hands over the value, the change and blur handlers, the field's
// message, and a ref: with it, setFocus('password') and "focus the first field with a problem"
// work.
export function ControlledField<T extends FieldValues, Out = T>({
  control,
  name,
  ...props
}: ControlledFieldProps<T, Out>) {
  // Taken apart at once: the lint rules treat an object with a ref inside as a ref
  const {
    field: { ref, value, onChange, onBlur },
    fieldState: { error },
  } = useController({ control, name });
  return (
    <FormField
      {...props}
      ref={ref}
      value={value}
      onChangeText={onChange}
      onBlur={onBlur}
      error={error?.message}
    />
  );
}
