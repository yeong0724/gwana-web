'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';

import { CustomHeader } from '@/components/common';
import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import { menuGroup } from '@/constants';
import { cn, noMainHeaderPage } from '@/lib/utils';

interface Props {
  children: ReactNode;
}

const MainLayout = ({ children }: Props) => {
  const pathname = usePathname();
  const isNoMainHeaderPage = noMainHeaderPage(pathname);

  return isNoMainHeaderPage ? (
    <div className="h-dvh bg-gray-50 flex flex-col relative overflow-hidden">
      <CustomHeader />
      {children}
    </div>
  ) : (
    <div className={cn('flex flex-col', 'h-dvh')}>
      <Header menuGroup={menuGroup} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export default MainLayout;
