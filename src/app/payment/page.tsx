import { Viewport } from 'next';

import CustomHeader from '@/components/common/CustomHeader';
import PaymentContainer from '@/components/features/payment/PaymentContainer';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

const Page = () => {
  return (
    <div className="h-screen bg-gray-50 flex flex-col relative overflow-hidden">
      <CustomHeader title="주문/결제" />
      <PaymentContainer />
    </div>
  );
};

export default Page;
