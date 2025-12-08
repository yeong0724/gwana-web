'use client';

import React from 'react';
import { usePathname } from 'next/navigation';

import PageTransition from '@/components/common/PageTransition';
import MainContainer from '@/components/features/MainContainer';
import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import { menuGroup } from '@/constants/menu';
import { cn, withHeaderAndFooterPage } from '@/lib/utils';

interface RootPageTransitionProps {
  children: React.ReactNode;
}

export default function RootPageTransition({ children }: RootPageTransitionProps) {
  const pathname = usePathname();
  const isMainGroup = withHeaderAndFooterPage(pathname);

  return (
    <div className={cn('flex flex-col', isMainGroup ? 'min-h-screen' : 'h-full')}>
      {isMainGroup && <Header menuGroup={menuGroup} />}
      <main className={cn('flex-1', isMainGroup ? 'min-h-[1800px]' : '')}>
        <MainContainer>
          <PageTransition>{children}</PageTransition>
        </MainContainer>
      </main>
      {isMainGroup && <Footer />}
    </div>
  );
}
