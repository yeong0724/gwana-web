import { ChangeEvent } from 'react';

import { isEmpty } from 'lodash-es';
import {
  FieldPath,
  FieldPathValue,
  FieldValues,
  useController,
  useFormContext,
} from 'react-hook-form';

import { validateByType } from '@/lib/utils';
import type { FormatEnum, HandleChange, ReactHookFormEventType } from '@/types/type';

const ControllerInput = <T extends FieldValues>({
  required = false,
  name,
  className = '',
  wrapperClassName = '',
  placeholder = '',
  type = 'text',
  callbackFn = null,
  readOnly = false,
  disabled = false,
  disableErrorMessage = false,
  maxLength,
  inputRef,
}: {
  required?: boolean;
  name: FieldPath<T>;
  className?: string;
  wrapperClassName?: string;
  placeholder?: string;
  type?: FormatEnum;
  readOnly?: boolean;
  disabled?: boolean;
  disableErrorMessage?: boolean;
  maxLength?: number;
  callbackFn?: HandleChange<HTMLInputElement, FieldPathValue<T, FieldPath<T>>> | null;
  inputRef?: (el: HTMLInputElement | null) => void;
}) => {
  const { setValue, control, clearErrors } = useFormContext<T>();

  const {
    field,
    fieldState: { error },
  } = useController({
    control,
    name,
  });

  const onFilterValue = (value: FieldPathValue<T, FieldPath<T>>) => {
    if (!value || validateByType(value, type)) {
      return value;
    }

    return field.value;
  };

  const onChangeHandler = (event: ChangeEvent<ReactHookFormEventType<T> & HTMLInputElement>) => {
    const inputValue = event.target.value;

    const value = onFilterValue(inputValue) as FieldPathValue<T, FieldPath<T>>;

    if (callbackFn) {
      callbackFn(null, { name, value });
      return;
    }

    if (!isEmpty(error)) {
      clearErrors(name);
    }

    setValue(name, value, {
      shouldDirty: false,
      shouldValidate: required, // required가 false면 검증하지 않음
    });
  };

  return (
    <div className={wrapperClassName}>
      <input
        ref={inputRef}
        name={name}
        placeholder={placeholder}
        value={field.value}
        onChange={onChangeHandler}
        className={`${className} outline-none ${error?.message ? '!border-red-500 focus:!border-red-500' : ''} ${disabled ? 'bg-gray-100 text-gray-300 cursor-not-allowed' : ''}`}
        readOnly={readOnly}
        disabled={disabled}
        type={type}
        maxLength={maxLength}
      />
      {!disableErrorMessage && error?.message && (
        <div className="text-red-500 pt-1 pl-2 text-[12px] sm:text-[8px]">{error.message}</div>
      )}
    </div>
  );
};

export default ControllerInput;
