'use client';

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

  // DOM input 내부 참조 (blur 시 값 동기화용)
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

  // 필터링 + 검증 로직 (일반 입력 시 또는 blur 시 호출)
  const applyValue = (rawValue: string, validate = false) => {
    const value = onFilterValue(rawValue as FieldPathValue<T, FieldPath<T>>);

    // 값이 그대로면 setValue 스킵: iOS 천지인 등에서 controlled input의 value prop이
    // 재할당되며 IME/caret이 재계산돼 깜빡이는 현상 완화
    if ((value ?? '') === (field.value ?? '')) {
      return;
    }

    if (callbackFn) {
      callbackFn(null, { name, value });
      return;
    }

    if (!isEmpty(error)) {
      clearErrors(name);
    }

    setValue(name, value, {
      shouldDirty: false,
      shouldValidate: validate,
    });
  };

  const onChangeHandler = (event: ChangeEvent<ReactHookFormEventType<T> & HTMLInputElement>) => {
    // 타이핑 중에는 validate를 돌리지 않음 → 에러 토글로 인한 추가 리렌더/레이아웃 시프트 방지
    applyValue(event.target.value);
  };

  const handleRef = (el: HTMLInputElement | null) => {
    internalInputRef.current = el;
    if (inputRef) inputRef(el);
  };

  const handleBlur = () => {
    setIsFocus(false);

    // blur 시 DOM 실제 값과 RHF state를 동기화하고, required 필드면 이 시점에 검증 수행
    if (internalInputRef.current) {
      const domValue = internalInputRef.current.value;
      if (domValue !== (field.value ?? '')) {
        applyValue(domValue, required);
      } else if (required) {
        // 값은 같아도 blur 시점에 required 필드 검증은 돌려서 에러 피드백은 유지
        setValue(name, field.value, { shouldDirty: false, shouldValidate: true });
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
