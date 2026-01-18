import SuccessContainer from '@/components/features/success/SuccessContainer';
import React from 'react';

type PageProps = {
  searchParams: Promise<{
    paymentKey?: string;
    orderId?: string;
    amount?: string;
  }>;
};

const Page = async ({ searchParams }: PageProps) => {
  const { paymentKey = '', orderId = '', amount = '' } = await searchParams;

  return <SuccessContainer paymentKey={paymentKey} orderId={orderId} amount={amount} />;
};

export default Page;
