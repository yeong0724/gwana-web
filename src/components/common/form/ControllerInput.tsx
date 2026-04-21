'use client';

// import { ChangeEvent, CompositionEvent, useRef, useState } from 'react';
import { ChangeEvent, useRef, useState } from 'react';

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

  // IME(한글 등) 조합 상태 추적
  // const isComposingRef = useRef<boolean>(false);
  // DOM input 내부 참조 (blur 시 조합 미완료 값 강제 동기화용)
  const internalInputRef = useRef<HTMLInputElement | null>(null);

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
    // const nativeEvent = event.nativeEvent as InputEvent;

    // 조합 중에는 state 업데이트를 전혀 하지 않음
    // iOS Safari는 controlled input의 value가 조합 중 바뀌면 조합이 취소/삭제됨
    // compositionend 시점에 DOM의 최종 값으로 동기화함
    // if (isComposingRef.current || nativeEvent.isComposing) {
    //   return;
    // }

    applyValue(event.target.value);
  };

  // const handleCompositionStart = () => {
  //   isComposingRef.current = true;
  // };

  // const handleCompositionEnd = (event: CompositionEvent<HTMLInputElement>) => {
  //   isComposingRef.current = false;
  //   applyValue((event.target as HTMLInputElement).value);
  // };

  const handleRef = (el: HTMLInputElement | null) => {
    internalInputRef.current = el;
    if (inputRef) inputRef(el);
  };

  const handleBlur = () => {
    setIsFocus(false);

    // 안전망: compositionend가 누락되거나 조합이 끝나지 않은 상태로 포커스가 빠지는 경우
    // DOM의 실제 값과 RHF state가 어긋나 있으면 강제로 동기화
    if (internalInputRef.current) {
      const domValue = internalInputRef.current.value;
      if (domValue !== (field.value ?? '')) {
        // isComposingRef.current = false;
        applyValue(domValue);
      }
    }
  };

  return (
    <div className={wrapperClassName}>
      <Input
        ref={handleRef}
        name={name}
        placeholder={isFocus ? '' : placeholder}
        value={field.value ?? ''}
        onChange={onChangeHandler}
        // onCompositionStart={handleCompositionStart}
        // onCompositionEnd={handleCompositionEnd}
        className={`${className} outline-none ${error?.message ? '!border-red-500 focus:!border-red-500' : ''} ${disabled ? 'bg-gray-100 text-gray-700 cursor-not-allowed' : ''}`}
        readOnly={readOnly}
        disabled={disabled}
        type={type === 'email' ? 'text' : type}
        maxLength={maxLength}
        onFocus={() => setIsFocus(true)}
        onBlur={handleBlur}
        autoComplete="off"
      />
      {!disableErrorMessage && error?.message && (
        <div className="text-red-500 pt-1 pl-2 text-[12px] sm:text-[14px]">{error.message}</div>
      )}
    </div>
  );
};

export default ControllerInput;
