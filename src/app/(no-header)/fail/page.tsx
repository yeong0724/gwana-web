import FailContainer from '@/components/features/fail/FailContainer';
import React from 'react';

type PageProps = {
  searchParams: Promise<{ code?: string; message?: string; orderId?: string }>;
};

const Page = async ({ searchParams }: PageProps) => {
  const { code = '', message = '' } = await searchParams;

  return <FailContainer code={code} message={message} />;
};

export default Page;
