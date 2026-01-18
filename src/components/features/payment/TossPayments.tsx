'use client';

import { useLoginStore } from '@/stores';
import { loadTossPayments, TossPaymentsWidgets } from '@tosspayments/tosspayments-sdk';
import { useEffect } from 'react';

type TossPaymentsProps = {
  widgets: TossPaymentsWidgets | null;
  setWidgets: (widgets: TossPaymentsWidgets) => void;
  setReady: (ready: boolean) => void;
};

export default function TossPayments({ widgets, setWidgets, setReady }: TossPaymentsProps) {
  const { loginInfo } = useLoginStore();
  const { customerKey } = loginInfo.user;

  useEffect(() => {
    if (!customerKey) return;

    (async () => {
      try {
        const clientKey = process.env.NEXT_PUBLIC_TOSS_PAYMENTS_CLIENT_KEY || '';
        const tossPayments = await loadTossPayments(clientKey);

        const widgets = tossPayments.widgets({
          customerKey, // 백엔드에서 받은 customerKey 사용
        });

        setWidgets(widgets);
      } catch (error) {
        console.error('Error fetching payment widget:', error);
      }
    })();
  }, [customerKey]);

  useEffect(() => {
    (async () => {
      if (widgets == null) return;

      await widgets.setAmount({
        currency: 'KRW',
        value: 50000,
      });

      await widgets.renderPaymentMethods({
        selector: '#payment-method',
        variantKey: 'DEFAULT',
      });

      await widgets.renderAgreement({
        selector: '#agreement',
        variantKey: 'AGREEMENT',
      });

      setReady(true);
    })();
  }, [widgets]);

  return (
    <>
      <div className="h-5" />
      <div className="box_section">
        {/* 결제 UI */}
        <div id="payment-method" />
        {/* 이용약관 UI */}
        <div id="agreement" />
      </div>
    </>
  );
}
