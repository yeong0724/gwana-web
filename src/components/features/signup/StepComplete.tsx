'use client';

import { useRouter } from 'next/navigation';

import { CircleCheck } from 'lucide-react';

const StepComplete = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col flex-1 px-5">
      {/* 완료 안내 */}
      <div className="flex-1 flex flex-col items-center justify-center py-12">
        <div className="w-16 h-16 rounded-full bg-tea-100 flex items-center justify-center mb-5">
          <CircleCheck className="size-8 text-tea-600" strokeWidth={1.5} />
        </div>
        <h2 className="text-heading-3 font-bold text-brand-800 mb-2">
          가입이 완료되었습니다
        </h2>
        <p className="text-body-sm text-warm-500 text-center leading-relaxed">
          관아수제차의 회원이 되신 것을 환영합니다.
          <br />
          지금 바로 다양한 수제차를 만나보세요.
        </p>
      </div>

      {/* 하단 버튼 */}
      <div className="flex-shrink-0 pb-6 space-y-2.5">
        <button
          type="button"
          onClick={() => router.push('/')}
          className="w-full rounded-full py-3.5 bg-brand-800 hover:bg-brand-900 text-white text-[15px] font-semibold flex items-center justify-center active:scale-[0.98] transition-all cursor-pointer"
        >
          쇼핑하러 가기
        </button>
        <button
          type="button"
          onClick={() => router.push('/login')}
          className="w-full rounded-full py-3.5 bg-white border border-brand-300/80 text-brand-800 text-[15px] font-semibold flex items-center justify-center hover:bg-brand-50 active:scale-[0.98] transition-all cursor-pointer"
        >
          로그인
        </button>
      </div>
    </div>
  );
};

export default StepComplete;
