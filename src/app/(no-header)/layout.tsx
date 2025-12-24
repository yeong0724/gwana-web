import { ReactNode } from 'react';

import { CustomHeader } from '@/components/common';

interface Props {
  children: ReactNode;
}

export default function Layout({ children }: Props) {
  return (
    <div className="h-dvh bg-gray-50 flex flex-col relative overflow-hidden">
      <CustomHeader />
      {children}
    </div>
  );
}
