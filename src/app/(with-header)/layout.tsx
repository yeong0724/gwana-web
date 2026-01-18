'use client';

import MainLayout from '@/components/layout/MainLayout';
import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export default function Layout({ children }: Props) {
  return <MainLayout>{children}</MainLayout>;
}
