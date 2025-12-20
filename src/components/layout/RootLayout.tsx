'use client';

import React, { ReactNode, useContext, useEffect } from 'react';
import { usePathname } from 'next/navigation';

import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import { menuGroup } from '@/constants';
import { cn, withHeaderAndFooterPage } from '@/lib/utils';
import { TransitionsContext, TransitionWrapper } from '@/providers/TransitionProvider';

interface Props {
  children: ReactNode;
}

export default function RootLayout({ children }: Props) {
  const pathname = usePathname();
  const isMainGroup = withHeaderAndFooterPage(pathname);

  return (
    <TransitionsProvider>
      <div className={cn('flex flex-col', isMainGroup ? 'min-h-screen' : 'h-full')}>
        {isMainGroup && <Header menuGroup={menuGroup} />}
        <main
          className={cn('flex-1', isMainGroup ? 'min-h-[1800px]' : '', 'page-transition-wrapper')}
        >
          <TransitionWrapper className="h-full">{children}</TransitionWrapper>
        </main>
        {isMainGroup && <Footer />}
      </div>
    </TransitionsProvider>
  );
}
