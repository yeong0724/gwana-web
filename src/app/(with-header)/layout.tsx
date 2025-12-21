'use client';

import { ReactNode } from 'react';

import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import { menuGroup } from '@/constants';
import { cn } from '@/lib/utils';

interface Props {
  children: ReactNode;
}

export default function Layout({ children }: Props) {
  return (
    <div className={cn('flex flex-col', 'min-h-screen')}>
      <Header menuGroup={menuGroup} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
