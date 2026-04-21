'use client';

import { ChangeEvent, CompositionEvent, useRef, useState } from 'react';

import { isEmpty } from 'lodash-es';
import {
  FieldPath,
  FieldPathValue,
  FieldValues,
  useController,
  useFormContext,
} from 'react-hook-form';

import { Input } from '@/components/ui/input';
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
  const [isFocus, setIsFocus] = useState<boolean>(false);

  // IME(한글 등) 조합 상태 추적 - state 대신 ref 사용 (onChange보다 먼저 읽혀야 하므로)
  const isComposingRef = useRef<boolean>(false);

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

  // 필터링 + 검증 로직 (조합 완료 후 또는 일반 입력 시 호출)
  const applyValue = (rawValue: string) => {
    const value = onFilterValue(rawValue as FieldPathValue<T, FieldPath<T>>);

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

  const onChangeHandler = (event: ChangeEvent<ReactHookFormEventType<T> & HTMLInputElement>) => {
    const inputValue = event.target.value;

    // 조합 중(IME composing)에는 필터링/검증 없이 raw 값만 반영
    // iOS Safari에서 조합 중 value가 바뀌면 입력이 씹히는 문제 방지
    if (isComposingRef.current) {
      setValue(name, inputValue as FieldPathValue<T, FieldPath<T>>, {
        shouldDirty: false,
        shouldValidate: false,
      });
      return;
    }

    applyValue(inputValue);
  };

  const handleCompositionStart = () => {
    isComposingRef.current = true;
  };

  const handleCompositionEnd = (event: CompositionEvent<HTMLInputElement>) => {
    isComposingRef.current = false;
    // 조합이 완성된 시점에 최종 값으로 필터링/검증 수행
    applyValue((event.target as HTMLInputElement).value);
  };

  return (
    <div className={wrapperClassName}>
      <Input
        ref={inputRef}
        name={name}
        placeholder={isFocus ? '' : placeholder}
        value={field.value}
        onChange={onChangeHandler}
        onCompositionStart={handleCompositionStart}
        onCompositionEnd={handleCompositionEnd}
        className={`${className} outline-none ${error?.message ? '!border-red-500 focus:!border-red-500' : ''} ${disabled ? 'bg-gray-100 text-gray-700 cursor-not-allowed' : ''}`}
        readOnly={readOnly}
        disabled={disabled}
        type={type === 'email' ? 'text' : type}
        maxLength={maxLength}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        autoComplete="off"
      />
      {!disableErrorMessage && error?.message && (
        <div className="text-red-500 pt-1 pl-2 text-[12px] sm:text-[14px]">{error.message}</div>
      )}
    </div>
  );
};

export default ControllerInput;
