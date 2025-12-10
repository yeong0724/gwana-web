import { ChangeEvent, useMemo } from 'react';

import { isEmpty } from 'lodash-es';
import {
  FieldPath,
  FieldPathValue,
  FieldValues,
  useController,
  useFormContext,
} from 'react-hook-form';

import { getRegexpByType } from '@/lib/utils';
import type { FormatEnum, HandleChange, ReactHookFormEventType } from '@/types/type';

const ControllerInput = <T extends FieldValues>({
  required = false,
  name,
  className = '',
  wrapperClassName = '',
  placeholder = '',
  type = '',
  callbackFn = null,
  readOnly = false,
  disabled = false,
}: {
  required?: boolean;
  name: FieldPath<T>;
  className?: string;
  wrapperClassName?: string;
  placeholder?: string;
  type?: FormatEnum;
  readOnly?: boolean;
  disabled?: boolean;
  callbackFn?: HandleChange<HTMLInputElement, FieldPathValue<T, FieldPath<T>>> | null;
}) => {
  const { setValue, control, clearErrors } = useFormContext<T>();

  const REG_EXP = useMemo(() => getRegexpByType(type), [type]);

  const {
    field,
    fieldState: { error },
  } = useController({
    control,
    name,
  });

  const onFilterValue = (event: ChangeEvent<ReactHookFormEventType<T>>) => {
    const { value } = event.target;
    return REG_EXP ? value.replace(REG_EXP, '') : value;
  };

  const onChangeHandler = (event: ChangeEvent<ReactHookFormEventType<T> & HTMLInputElement>) => {
    const value = onFilterValue(event);

    if (callbackFn) {
      callbackFn(null, { name, value });
      return;
    }

    setValue(name, value, {
      shouldDirty: false,
      shouldValidate: required, // required가 false면 검증하지 않음
    });
  };

  const handleFocus = () => {
    if (!isEmpty(error)) {
      clearErrors(name);
    }
  };

  return (
    <div className={wrapperClassName}>
      <input
        name={name}
        placeholder={placeholder}
        value={field.value}
        onChange={onChangeHandler}
        onFocus={handleFocus}
        className={`${className} ${error?.message ? 'border-red-500' : ''}`}
        readOnly={readOnly}
        disabled={disabled}
      />
      {error?.message && (
        <div className="text-red-500 pt-1 pl-2 text-[12px] sm:text-[8px]">{error.message}</div>
      )}
    </div>
  );
};

export default ControllerInput;
