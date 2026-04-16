'use client';

import { useState } from 'react';

import SignupStepper from './SignupStepper';
import StepIdentity from './StepIdentity';
import StepInfo from './StepInfo';
import StepComplete from './StepComplete';

export type IdentityData = {
  name: string;
  phone: string;
};

const STEPS = [
  { label: '본인인증', desc: '본인인증을 진행해주세요.' },
  { label: '정보입력', desc: '회원 정보를 입력해주세요.' },
  { label: '가입완료', desc: '회원가입이 완료되었습니다.' },
] as const;

const SignupContainer = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [identityData, setIdentityData] = useState<IdentityData | null>(null);

  const handleIdentityComplete = (data: IdentityData) => {
    setIdentityData(data);
    setCurrentStep(1);
  };

  const handleInfoComplete = () => {
    setCurrentStep(2);
  };

  return (
    <div className="bg-warm-50 flex flex-col flex-1 min-h-0 overflow-hidden h-full">
      {/* 헤더 */}
      <div className="px-5 pt-8 pb-2 max-w-[500px] w-full mx-auto">
        <p className="text-caption font-medium tracking-wide text-tea-600 mb-1">Sign Up</p>
        <h1 className="text-heading-2 font-bold tracking-heading text-brand-800">회원가입</h1>
      </div>

      {/* 스텝 인디케이터 */}
      <div className="px-5 py-5 max-w-[500px] w-full mx-auto">
        <SignupStepper steps={STEPS} currentStep={currentStep} />
      </div>

      {/* 스텝 컨텐츠 */}
      <div className="flex flex-col flex-1 min-h-0 max-w-[500px] w-full mx-auto">
        {currentStep === 0 && <StepIdentity onComplete={handleIdentityComplete} />}
        {currentStep === 1 && (
          <StepInfo identityData={identityData!} onComplete={handleInfoComplete} />
        )}
        {currentStep === 2 && <StepComplete />}
      </div>
    </div>
  );
};

export default SignupContainer;
