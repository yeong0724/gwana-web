'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { CheckCircle2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { localeFormat } from '@/lib/utils';
import { usePaymentService } from '@/service';
import { useAlertStore } from '@/stores';
import { ResultCode } from '@/types';

type SuccessContainerProps = {
  paymentKey: string;
  orderId: string;
  amount: string;
};

const SuccessContainer = ({ paymentKey, orderId, amount }: SuccessContainerProps) => {
  const router = useRouter();
  const amountNumber = parseInt(amount, 10);
  const { showAlert, showConfirmAlert } = useAlertStore();
  const [isPaymentComplete, setIsPaymentComplete] = useState(false);
  const { useRequestPaymentApproveMutation } = usePaymentService();

  const { mutate: requestPaymentApprove } = useRequestPaymentApproveMutation();

  const requestPaymentApproveHandler = () => {
    requestPaymentApprove(
      { paymentKey, orderId, amount: amountNumber },
      {
        onSuccess: async (data) => {
          if (data.code === ResultCode.SUCCESS) {
            const { status } = data.data;
            if (status === 'DONE') {
              setIsPaymentComplete(true);
            }

          } else {
            await showConfirmAlert({
              title: '에러',
              description: data.message || '',
            });

            if (data.code === 'ALREADY_PROCESSED_PAYMENT') {
              router.push('/')
            }
          }
        },
        onError: () => {
          showAlert({
            title: '에러',
            description: '결제처리 중 오류가 발생하였습니다.',
          });
        },
      }
    );
  };

  useEffect(() => {
    if (paymentKey && orderId && amount) {
      requestPaymentApproveHandler();
    }
  }, [paymentKey, orderId, amount]);

  return (
    <div className="flex bg-gradient-to-b from-green-50/30 via-white to-white flex-col items-center justify-between px-6 w-full max-w-[500px] mx-auto min-h-screen overflow-hidden border-x border-gray-100">
      <>
        {isPaymentComplete ? (<div className="flex-1 flex flex-col items-center justify-center max-w-md w-full">
          <div className="relative mb-8">
            <div className="absolute inset-0 animate-pulse">
              <div className="w-32 h-32 rounded-full bg-green-100/50 blur-2xl" />
            </div>
            <div className="relative">
              <CheckCircle2
                className="w-24 h-24 text-green-500 animate-[bounce_1s_ease-in-out_3]"
                strokeWidth={1.5}
              />
            </div>
          </div>

          <div className="text-center space-y-4 mb-2">
            <h1 className="text-[26px] sm:text-[28px] md:text-[32px] font-bold text-gray-900 tracking-tight">
              결제가 완료되었습니다
            </h1>

            <p className="text-[15px] sm:text-[16px] md:text-[17px] text-gray-600 leading-relaxed px-4 break-keep">
              주문하신 상품을 빠르게 준비하겠습니다
            </p>

            {(orderId || amountNumber > 0) && (
              <div className="mt-6 space-y-3 w-full">
                {amountNumber > 0 && (
                  <div className="flex items-center justify-between px-6 py-3 bg-gray-50 rounded-xl border border-gray-200">
                    <span className="text-[14px] sm:text-[15px] text-gray-600 font-medium">
                      결제 금액
                    </span>
                    <span className="text-[16px] sm:text-[17px] text-gray-900 font-bold">
                      {localeFormat(amountNumber)}원
                    </span>
                  </div>
                )}
                {orderId && (
                  <div className="flex items-center justify-between px-6 py-3 bg-gray-50 rounded-xl border border-gray-200">
                    <span className="text-[14px] sm:text-[15px] text-gray-600 font-medium">
                      주문번호
                    </span>
                    <span className="text-[12px] sm:text-[13px] text-gray-700 font-mono">
                      {orderId}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 안내 메시지 */}
          <div className="mt-8 px-6 py-4 bg-blue-50/50 border border-blue-200/50 rounded-2xl">
            <p className="text-[13px] sm:text-[14px] text-gray-700 leading-relaxed text-center break-keep">
              주문 내역은 마이페이지에서
              <br />
              확인하실 수 있습니다
            </p>
          </div>
        </div>) : (
          <div>결제 처리 중...</div>
        )}



        {/* 하단 버튼 영역 */}
        <div className="w-full max-w-md pb-8 pt-6 space-y-3">
          <Button
            onClick={() => router.push('/')}
            className="w-full h-14 text-[16px] sm:text-[17px] font-bold rounded-xl bg-black hover:bg-gray-800 text-white shadow-lg shadow-black/10 transition-all duration-200 hover:shadow-xl hover:shadow-black/20"
          >
            홈으로
          </Button>
          {isPaymentComplete && (
            <Button
              onClick={() => router.push('/mypage/orders')}
              variant="outline"
              className="w-full h-14 text-[16px] sm:text-[17px] font-bold rounded-xl border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-700 transition-all duration-200"
            >
              주문 내역 보기
            </Button>
          )}
        </div>
      </>
    </div>
  );
};

export default SuccessContainer;
