import type { ComponentProps } from 'react';
import { type Control, type FieldPath, type FieldValues, useController } from 'react-hook-form';

import { FormField } from '@/components/FormField';

type ControlledFieldProps<T extends FieldValues, Out> = Omit<
  ComponentProps<typeof FormField>,
  'value' | 'onChangeText' | 'onBlur' | 'error' | 'ref'
> & {
  control: Control<T, unknown, Out>;
  name: FieldPath<T>;
};

// A FormField that belongs to a React Hook Form form (Lesson 5.4): useController hands over the
// value, the change and blur handlers, the field's message and a ref
export function ControlledField<T extends FieldValues, Out = T>({ control, name, ...props }: ControlledFieldProps<T, Out>) {
  const {
    field: { ref, value, onChange, onBlur },
    fieldState: { error },
  } = useController({ control, name });
  return <FormField {...props} ref={ref} value={value} onChangeText={onChange} onBlur={onBlur} error={error?.message} />;
}
