'use client';

import { ReactNode } from 'react';

import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import { menuGroup } from '@/constants';
import { cn } from '@/lib/utils';
import { TransitionWrapper } from '@/providers/TransitionProvider';

interface Props {
  children: ReactNode;
}

export default function Layout({ children }: Props) {
  return (
    <div className={cn('flex flex-col', 'min-h-screen')}>
      <Header menuGroup={menuGroup} />
      <main className={cn('flex-1', 'min-h-[1800px]', 'page-transition-wrapper')}>
        <TransitionWrapper className="h-full">{children}</TransitionWrapper>
      </main>
      <Footer />
    </div>
  );
}
