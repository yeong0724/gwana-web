'use client';

import { Check } from 'lucide-react';

type Step = {
  readonly label: string;
  readonly desc: string;
};

type Props = {
  steps: readonly Step[];
  currentStep: number;
};

const SignupStepper = ({ steps, currentStep }: Props) => {
  return (
    <div className="flex items-start">
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isActive = index === currentStep;

        return (
          <div key={step.label} className="flex items-start flex-1">
            {/* 스텝 콘텐츠 */}
            <div className="flex flex-col items-center flex-1">
              {/* 원형 + 라인 */}
              <div className="flex items-center w-full">
                {/* 왼쪽 라인 */}
                <div
                  className={`h-[2px] flex-1 ${
                    index === 0
                      ? 'bg-transparent'
                      : index <= currentStep
                        ? 'bg-brand-700'
                        : 'bg-warm-200'
                  }`}
                />

                {/* 원형 인디케이터 */}
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-[12px] font-bold transition-all ${
                    isCompleted
                      ? 'bg-brand-700 text-white'
                      : isActive
                        ? 'bg-brand-700 text-white shadow-[0_0_0_3px_rgba(0,0,0,0.12)]'
                        : 'bg-warm-200 text-warm-400'
                  }`}
                >
                  {isCompleted ? <Check className="size-3.5" strokeWidth={2.5} /> : index + 1}
                </div>

                {/* 오른쪽 라인 */}
                <div
                  className={`h-[2px] flex-1 ${
                    index === steps.length - 1
                      ? 'bg-transparent'
                      : index < currentStep
                        ? 'bg-brand-700'
                        : 'bg-warm-200'
                  }`}
                />
              </div>

              {/* 텍스트 */}
              <div className="mt-2.5 text-center px-1">
                <p
                  className={`text-[13px] font-semibold leading-tight ${
                    isActive || isCompleted ? 'text-brand-800' : 'text-warm-400'
                  }`}
                >
                  {step.label}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SignupStepper;
