import { Viewport } from 'next';

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

  return <PaymentContainer sessionId={sessionId} />;
};

export default Page;
