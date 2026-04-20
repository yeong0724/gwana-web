'use client';

import { useState } from 'react';

import { FormProvider } from 'react-hook-form';

import useSignupForm from '@/hooks/useSignupForm';

import SignupStepper from './SignupStepper';
import StepAgreement from './StepAgreement';
import StepComplete from './StepComplete';
import StepInfo from './StepInfo';

const STEPS = [
  { label: '약관 동의', desc: '약관에 동의해주세요.' },
  { label: '정보 입력', desc: '회원 정보를 입력해주세요.' },
  { label: '가입 완료', desc: '회원가입이 완료되었습니다.' },
] as const;

const SignupContainer = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const { form } = useSignupForm();

  const handleAgreementNext = () => setCurrentStep(1);
  const handleInfoComplete = () => setCurrentStep(2);

  const header = (
    <div className="px-5 py-5 max-w-[500px] w-full mx-auto">
      <SignupStepper steps={STEPS} currentStep={currentStep} />
    </div>
  );

  return (
    <FormProvider {...form}>
      <div className="bg-warm-50 flex flex-col flex-1 min-h-0 overflow-hidden">
        <div className="flex flex-col flex-1 min-h-0 w-full">
          {currentStep === 0 && (
            <>
              {header}
              <StepAgreement onComplete={handleAgreementNext} />
            </>
          )}
          {currentStep === 1 && <StepInfo onComplete={handleInfoComplete} header={header} />}
          {currentStep === 2 && (
            <>
              {header}
              <StepComplete />
            </>
          )}
        </div>
      </div>
    </FormProvider>
  );
};

export default SignupContainer;
