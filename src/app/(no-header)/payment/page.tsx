import { Viewport } from 'next';

import { CustomHeader } from '@/components/common';
import PaymentContainer from '@/components/features/payment/PaymentContainer';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

type PageProps = {
  searchParams: Promise<{ sessionId?: string }>;
};

const Page = async ({ searchParams }: PageProps) => {
  const { sessionId = '' } = await searchParams;

  return (
    <div className="h-screen bg-gray-50 flex flex-col relative overflow-hidden">
      <CustomHeader title="주문/결제" />
      <PaymentContainer sessionId={sessionId} />
    </div>
  );
};

export default Page;
