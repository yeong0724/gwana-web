'use client';

import { ReactNode, useCallback, useRef, useState } from 'react';

import { Check, Eye, EyeOff, MapPin } from 'lucide-react';
import { Address } from 'react-daum-postcode';
import { FieldErrors, FormProvider } from 'react-hook-form';

import { ControllerInput } from '@/components/common/form';
import { SearchPostcodeModal, SearchPostcodeSheet } from '@/components/common/modal';
import useIsMobile from '@/hooks/useIsMobile';
import useSignupForm from '@/hooks/useSignupForm';
import { SignupForm } from '@/types';

import type { IdentityData } from './SignupContainer';

type Props = {
  identityData: IdentityData;
  onComplete: () => void;
  header: ReactNode;
};

const StepInfo = ({ identityData, onComplete, header }: Props) => {
  const { isMobile } = useIsMobile();
  const { form, setValue, handleSubmit, clearErrors, errors, watch } = useSignupForm();

  const [addressOpen, setAddressOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const setInputRef = (name: string) => (el: HTMLInputElement | null) => {
    inputRefs.current[name] = el;
  };

  const allValues = watch();
  const allFieldsFilled =
    allValues.email &&
    allValues.password &&
    allValues.passwordConfirm &&
    allValues.zonecode &&
    allValues.roadAddress &&
    allValues.detailAddress;

  const handleAddressOpen = () => {
    setAddressOpen(true);
  };

  // 뒤로가기(popstate)로 닫히는 경우 → history.back() 불필요
  // X버튼/오버레이/주소선택으로 닫히는 경우 → history.back() 필요
  const handleAddressClose = useCallback((open: boolean) => {
    if (!open) {
      setAddressOpen(false);
    }
  }, []);

  const handleAddressComplete = (addressData: Address) => {
    setValue('zonecode', addressData.zonecode);
    setValue('roadAddress', addressData.roadAddress);
    clearErrors(['zonecode', 'roadAddress']);
    handleAddressClose(false);
  };

  const onSubmit = (values: SignupForm) => {
    const { email, password, zonecode, roadAddress, detailAddress } = values;

    const payload = {
      email,
      password,
      username: identityData.name,
      phone: identityData.phone,
      zonecode,
      roadAddress,
      detailAddress,
    };

    console.log('signup payload:', payload);
    onComplete();
  };

  const onError = (errors: FieldErrors<SignupForm>) => {
    const focusOrder: (keyof SignupForm)[] = [
      'email',
      'password',
      'passwordConfirm',
      'zonecode',
      'roadAddress',
      'detailAddress',
    ];

    for (const fieldName of focusOrder) {
      if (errors[fieldName] && inputRefs.current[fieldName]) {
        inputRefs.current[fieldName]?.focus();
        break;
      }
    }
  };

  const inputBaseClass =
    'w-full px-4 py-2.5 border-1 border-brand-300/80 text-brand-700 text-[15px] bg-white transition-colors focus:border-brand-500';

  return (
    <>
      <FormProvider {...form}>
        <form onSubmit={handleSubmit(onSubmit, onError)} className="flex flex-col flex-1 min-h-0">
          <div className="flex-1 min-h-0 overflow-y-auto">
            {header}
            <div className="px-5 pb-6 space-y-5 max-w-[500px] w-full mx-auto">
              {/* 본인인증 완료 정보 */}
              <div className="rounded-lg bg-brand-50 border border-brand-200/40 px-4 py-3.5">
                <p className="text-[12px] text-tea-600 font-medium mb-2">본인인증 완료</p>
                <div className="flex items-center gap-4">
                  <div>
                    <span className="text-[12px] text-warm-400 block">이름</span>
                    <span className="text-[14px] font-semibold text-brand-800">
                      {identityData.name}
                    </span>
                  </div>
                  <div className="w-px h-8 bg-brand-200/50" />
                  <div>
                    <span className="text-[12px] text-warm-400 block">휴대폰</span>
                    <span className="text-[14px] font-semibold text-brand-800">
                      {identityData.phone.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3')}
                    </span>
                  </div>
                </div>
              </div>

              {/* 이메일 */}
              <fieldset className="space-y-2">
                <label className="block px-[2px] text-brand-800 font-medium text-[14px]">
                  이메일
                  <span className="text-red-400 ml-0.5">*</span>
                </label>
                <ControllerInput
                  type="email"
                  name="email"
                  placeholder="example@email.com"
                  className={inputBaseClass}
                  inputRef={setInputRef('email')}
                />
              </fieldset>

              {/* 비밀번호 */}
              <fieldset className="space-y-2">
                <label className="block px-[2px] text-brand-800 font-medium text-[14px]">
                  비밀번호
                  <span className="text-red-400 ml-0.5">*</span>
                </label>
                <div className="relative flex items-start">
                  <ControllerInput
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="영문, 숫자, 특수문자 포함 8자 이상"
                    className={`${inputBaseClass} pr-11`}
                    wrapperClassName="flex-1"
                    inputRef={setInputRef('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-[13px] text-warm-400 hover:text-warm-600 transition-colors cursor-pointer"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="size-[18px]" />
                    ) : (
                      <Eye className="size-[18px]" />
                    )}
                  </button>
                </div>
                <PasswordStrengthHint password={allValues.password} />
              </fieldset>

              {/* 비밀번호 확인 */}
              <fieldset className="space-y-2">
                <label className="block px-[2px] text-brand-800 font-medium text-[14px]">
                  비밀번호 확인
                  <span className="text-red-400 ml-0.5">*</span>
                </label>
                <div className="relative flex items-start">
                  <ControllerInput
                    type={showPasswordConfirm ? 'text' : 'password'}
                    name="passwordConfirm"
                    placeholder="비밀번호를 다시 입력해주세요"
                    className={`${inputBaseClass} pr-11`}
                    wrapperClassName="flex-1"
                    inputRef={setInputRef('passwordConfirm')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswordConfirm((prev) => !prev)}
                    className="absolute right-3 top-[13px] text-warm-400 hover:text-warm-600 transition-colors cursor-pointer"
                    tabIndex={-1}
                  >
                    {showPasswordConfirm ? (
                      <EyeOff className="size-[18px]" />
                    ) : (
                      <Eye className="size-[18px]" />
                    )}
                  </button>
                </div>
                {allValues.passwordConfirm &&
                  allValues.password === allValues.passwordConfirm &&
                  !errors.passwordConfirm && (
                    <p className="flex items-center gap-1 text-tea-600 text-[12px] lg:text-[14px] pl-1">
                      <Check className="size-3" />
                      비밀번호가 일치합니다
                    </p>
                  )}
              </fieldset>

              {/* 구분선 */}
              <div className="h-px bg-brand-200/40" />

              {/* 우편번호 */}
              <fieldset className="space-y-2">
                <label className="block px-[2px] text-brand-800 font-medium text-[14px]">
                  주소
                  <span className="text-red-400 ml-0.5">*</span>
                </label>
                <div className="flex items-start gap-2">
                  <ControllerInput
                    type="tel"
                    name="zonecode"
                    placeholder="우편번호"
                    className={inputBaseClass}
                    wrapperClassName="flex-1"
                    readOnly
                    inputRef={setInputRef('zonecode')}
                  />
                  <button
                    type="button"
                    onClick={handleAddressOpen}
                    className="flex items-center gap-1.5 px-4 py-2.5 bg-brand-800 text-white rounded-lg text-[13px] font-medium hover:bg-brand-900 active:scale-[0.98] transition-all whitespace-nowrap cursor-pointer shadow-sm shrink-0"
                  >
                    <MapPin className="size-3.5" />
                    <span>검색</span>
                  </button>
                </div>
              </fieldset>

              {/* 도로명 주소 */}
              <fieldset className="space-y-2">
                <ControllerInput
                  type="text"
                  name="roadAddress"
                  placeholder="도로명 주소"
                  className={inputBaseClass}
                  readOnly
                  inputRef={setInputRef('roadAddress')}
                />
              </fieldset>

              {/* 상세주소 */}
              <fieldset className="space-y-2">
                <ControllerInput
                  type="alphanumericWithSymbols"
                  name="detailAddress"
                  placeholder="상세주소를 입력해주세요 (동/호수)"
                  maxLength={30}
                  className={inputBaseClass}
                  inputRef={setInputRef('detailAddress')}
                />
              </fieldset>
            </div>
          </div>

          {/* 하단 버튼 */}
          <div className="flex-shrink-0 bg-white p-4 border-t border-brand-200/60  flex justify-center">
            <button
              type="button"
              onClick={handleSubmit(onSubmit, onError)}
              onPointerDown={() => setIsPressed(true)}
              onPointerUp={() => setIsPressed(false)}
              onPointerLeave={() => setIsPressed(false)}
              className={`max-w-[500px] w-full rounded-full py-3.5 flex items-center justify-center gap-2 transition-transform duration-150 text-[15px] font-semibold bg-brand-800 hover:bg-brand-900 text-white cursor-pointer ${
                isPressed ? 'scale-95 brightness-90' : ''
              }`}
            >
              <span>가입하기</span>
            </button>
          </div>
        </form>
      </FormProvider>

      {/* 주소 검색 */}
      {isMobile ? (
        <SearchPostcodeSheet
          addressOpen={addressOpen}
          setAddressOpen={handleAddressClose}
          handleAddressComplete={handleAddressComplete}
        />
      ) : (
        <SearchPostcodeModal
          open={addressOpen}
          onOpenChange={handleAddressClose}
          onComplete={handleAddressComplete}
        />
      )}
    </>
  );
};

export default StepInfo;

/* ─── 비밀번호 강도 힌트 ─── */

function PasswordStrengthHint({ password }: { password: string }) {
  if (!password) return null;

  const rules = [
    { label: '8자 이상', passed: password.length >= 8 },
    { label: '영문 포함', passed: /[A-Za-z]/.test(password) },
    { label: '숫자 포함', passed: /[0-9]/.test(password) },
    { label: '특수문자 포함', passed: /[!@#$%^&*()_+\-=\[\]{}|;':",./<>?~`]/.test(password) },
  ];

  return (
    <div className="flex flex-wrap gap-x-3 gap-y-1 pl-1 pt-0.5">
      {rules.map((rule) => (
        <span
          key={rule.label}
          className={`text-[11px] lg:text-[13px] flex items-center gap-0.5 transition-colors ${
            rule.passed ? 'text-tea-600' : 'text-warm-300'
          }`}
        >
          <Check className="size-2.5" />
          {rule.label}
        </span>
      ))}
    </div>
  );
}
