'use client';

import { ReactNode, useCallback, useMemo, useRef, useState } from 'react';

import { Check, Eye, EyeOff, MapPin } from 'lucide-react';
import { Address } from 'react-daum-postcode';
import { FieldErrors, useFormContext } from 'react-hook-form';

import { ControllerInput } from '@/components/common/form';
import { SearchPostcodeModal, SearchPostcodeSheet } from '@/components/common/modal';
import useIsMobile from '@/hooks/useIsMobile';
import useAlertStore from '@/stores/useAlertStore';
import { SignupForm } from '@/types';

type Props = {
  onComplete: () => void;
  header: ReactNode;
};

const StepInfo = ({ onComplete, header }: Props) => {
  const { isMobile } = useIsMobile();
  const { showAlert } = useAlertStore();
  const {
    setValue,
    handleSubmit,
    clearErrors,
    watch,
    formState: { errors },
  } = useFormContext<SignupForm>();

  const [addressOpen, setAddressOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [checkedEmail, setCheckedEmail] = useState<string | null>(null);

  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const setInputRef = (name: string) => (el: HTMLInputElement | null) => {
    inputRefs.current[name] = el;
  };

  const [email, password, passwordConfirm] = watch(['email', 'password', 'passwordConfirm']);
  const emailChecked = useMemo(
    () => checkedEmail !== null && checkedEmail === email,
    [checkedEmail, email]
  );

  const handleEmailDupCheck = () => {
    const emailValue = email?.trim() ?? '';

    if (!emailValue) {
      showAlert({ title: '안내', description: '이메일은 필수 입력사항입니다' });
      return;
    }

    // TODO: 서버에 이메일 중복 체크 API 연동
    setCheckedEmail(emailValue);
    showAlert({ title: '안내', description: '사용 가능한 이메일입니다' });
  };

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
    const {
      email,
      password,
      username,
      phone,
      zonecode,
      roadAddress,
      detailAddress,
      agreeTerms,
      agreePrivacy,
      agreeAge14,
      agreeMarketing,
    } = values;

    const payload = {
      email,
      password,
      username,
      phone,
      zonecode,
      roadAddress,
      detailAddress,
      agreeTerms,
      agreePrivacy,
      agreeAge14,
      agreeMarketing,
    };

    console.log('signup payload:', payload);
    onComplete();
  };

  const onError = (errors: FieldErrors<SignupForm>) => {
    const focusOrder: (keyof SignupForm)[] = [
      'email',
      'password',
      'passwordConfirm',
      'username',
      'phone',
      'zonecode',
      'roadAddress',
      'detailAddress',
    ];

    for (const fieldName of focusOrder) {
      if (errors[fieldName] && inputRefs.current[fieldName]) {
        inputRefs.current[fieldName]?.focus();
        return;
      }
    }

    if (!emailChecked) {
      showAlert({ title: '안내', description: '이메일 중복체크를 해주세요' });
    }
  };

  const inputBaseClass =
    'w-full px-4 py-2.5 border-1 border-brand-300/80 text-brand-700 text-[16px] bg-white transition-colors focus:border-brand-500';

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit, onError)} className="flex flex-col flex-1 min-h-0">
        <div className="flex-1 min-h-0 overflow-y-auto">
          {header}
          <div className="px-5 pb-6 space-y-5 max-w-[500px] w-full mx-auto">
            {/* 이메일 */}
            <fieldset className="space-y-2">
              <label className="block px-[2px] text-brand-800 font-medium text-[14px]">
                이메일
                <span className="text-red-400 ml-0.5">*</span>
              </label>
              <div className="flex items-start gap-2">
                <ControllerInput
                  type="email"
                  name="email"
                  placeholder="example@email.com"
                  className={inputBaseClass}
                  wrapperClassName="flex-1"
                  inputRef={setInputRef('email')}
                />
                <button
                  type="button"
                  onClick={handleEmailDupCheck}
                  className="px-4 py-2.5 bg-brand-800 text-white rounded-lg text-[13px] font-medium hover:bg-brand-900 active:scale-[0.98] transition-all whitespace-nowrap cursor-pointer shadow-sm shrink-0"
                >
                  중복 체크
                </button>
              </div>
              {emailChecked && (
                <p className="flex items-center gap-1 text-tea-600 text-[12px] lg:text-[14px] pl-1">
                  <Check className="size-3" />
                  사용 가능한 이메일입니다
                </p>
              )}
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
              <PasswordStrengthHint password={password} />
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
              {passwordConfirm && password === passwordConfirm && !errors.passwordConfirm && (
                <p className="flex items-center gap-1 text-tea-600 text-[12px] lg:text-[14px] pl-1">
                  <Check className="size-3" />
                  비밀번호가 일치합니다
                </p>
              )}
            </fieldset>

            {/* 구분선 */}
            <div className="h-px bg-brand-200/40" />

            {/* 이름 */}
            <fieldset className="space-y-2">
              <label className="block px-[2px] text-brand-800 font-medium text-[14px]">
                이름
                <span className="text-red-400 ml-0.5">*</span>
              </label>
              <ControllerInput
                type="text"
                name="username"
                placeholder="이름을 입력해주세요"
                maxLength={20}
                className={inputBaseClass}
                inputRef={setInputRef('username')}
              />
            </fieldset>

            {/* 휴대폰 번호 */}
            <fieldset className="space-y-2">
              <label className="block px-[2px] text-brand-800 font-medium text-[14px]">
                휴대폰 번호
                <span className="text-red-400 ml-0.5">*</span>
              </label>
              <ControllerInput
                type="tel"
                name="phone"
                placeholder="숫자만 입력 (예: 01012345678)"
                maxLength={11}
                className={inputBaseClass}
                inputRef={setInputRef('phone')}
              />
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
