'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import React from 'react';

type FailContainerProps = {
  code?: string;
  message?: string;
};

const FailContainer = ({ code, message }: FailContainerProps) => {
  const router = useRouter();

  return (
    <div className="flex bg-gradient-to-b from-red-50/30 via-white to-white flex-col items-center justify-between px-6 w-full max-w-[500px] mx-auto min-h-screen overflow-hidden border-x border-gray-100">
      {/* 상단 여백 */}
      <div className="flex-1 flex flex-col items-center justify-center max-w-md w-full">
        {/* <div className="relative mb-8">
          <div className="absolute inset-0 animate-pulse">
            <div className="w-32 h-32 rounded-full bg-red-100/50 blur-2xl" />
          </div>
          <div className="relative">
            <XCircle
              className="w-24 h-24 text-red-500 animate-[bounce_1s_ease-in-out_3]"
              strokeWidth={1.5}
            />
          </div>
        </div> */}

        {/* 메시지 영역 */}
        <div className="text-center space-y-4 mb-2">
          <h1 className="text-[26px] sm:text-[28px] md:text-[32px] font-bold text-gray-900 tracking-tight">
            결제에 실패했습니다
          </h1>

          {message && (
            <p className="text-[15px] sm:text-[16px] md:text-[17px] text-gray-600 leading-relaxed px-4 break-keep">
              {message}
            </p>
          )}

          {code && (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full border border-gray-200">
              <span className="text-[12px] sm:text-[13px] text-gray-500 font-medium">
                오류 코드
              </span>
              <span className="text-[12px] sm:text-[13px] text-gray-700 font-mono">{code}</span>
            </div>
          )}
        </div>

        {/* 안내 메시지 */}
        {code !== 'PAY_PROCESS_CANCELED' && (
          <div className="mt-8 px-6 py-4 bg-amber-50/50 border border-amber-200/50 rounded-2xl">
            <p className="text-[13px] sm:text-[14px] text-gray-700 leading-relaxed text-center break-keep">
              결제 중 문제가 발생했습니다.
              <br />
              잠시 후 다시 시도해주세요.
            </p>
          </div>
        )}
      </div>

      {/* 하단 버튼 영역 */}
      <div className="w-full max-w-md pb-8 pt-6 space-y-3">
        <Button
          onClick={() => router.push('/')}
          className="w-full h-14 text-[16px] sm:text-[17px] font-bold rounded-xl bg-black hover:bg-gray-800 text-white shadow-lg shadow-black/10 transition-all duration-200 hover:shadow-xl hover:shadow-black/20"
        >
          홈으로
        </Button>
        <Button
          onClick={() => router.push('/cart')}
          variant="outline"
          className="w-full h-14 text-[16px] sm:text-[17px] font-bold rounded-xl border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-700 transition-all duration-200"
        >
          장바구니로
        </Button>
      </div>
    </div>
  );
};

export default FailContainer;
