import { Viewport } from 'next';

import PaymentContainer from '@/components/features/payment/PaymentContainer';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

type PageProps = {
  searchParams: Promise<{ orderId?: string }>;
};

const Page = async ({ searchParams }: PageProps) => {
  const { orderId = '' } = await searchParams;

  return <PaymentContainer orderId={orderId} />;
};

export default Page;
