'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { isEmpty } from 'lodash-es';
import { FieldPath, FieldValues, useController, useFormContext } from 'react-hook-form';

type OptionType = {
  value: string;
  label: string;
};

const ControllerSelect = <T extends FieldValues>({
  name,
  placeholder = '',
  options,
  className = '',
  required = false,
}: {
  name: FieldPath<T>;
  placeholder?: string;
  options: OptionType[];
  className?: string;
  required?: boolean;
}) => {
  const { setValue, control, clearErrors } = useFormContext<T>();

  const {
    field,
    fieldState: { error },
  } = useController({
    control,
    name,
  });

  const handleValueChange = (value: string) => {
    setValue(name, value as T[FieldPath<T>], {
      shouldDirty: false,
      shouldValidate: required,
    });
  };

  const handleOpenChange = (open: boolean) => {
    if (open && !isEmpty(error)) {
      clearErrors(name);
    }
  };

  return (
    <div>
      <Select value={field.value} onValueChange={handleValueChange} onOpenChange={handleOpenChange}>
        <SelectTrigger className={`!h-auto ${className} ${error?.message ? 'border-red-500' : ''}`}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error?.message && (
        <div className="text-red-500 pt-1 pl-2 text-[12px] sm:text-[8px]">{error.message}</div>
      )}
    </div>
  );
};

export default ControllerSelect;
