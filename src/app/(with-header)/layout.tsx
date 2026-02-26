'use client';

import { ReactNode } from 'react';

import MainLayout from '@/components/layout/MainLayout';

interface Props {
  children: ReactNode;
  modal: ReactNode;
}

export default function Layout({ children, modal }: Props) {
  return (
    <MainLayout>
      {children}
      {modal}
    </MainLayout>
  );
}
