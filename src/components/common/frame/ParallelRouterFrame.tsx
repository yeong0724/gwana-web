'use client';

import { usePathname } from 'next/navigation';

import SubHeader from '@/components/layout/Header/SubHeader';

type Props = {
  children: React.ReactNode;
};

const PARALLEL_ROUTE_PREFIXES = ['/mypage/inquiry'];

const ParallelRouterFrame = ({ children }: Props) => {
  const pathname = usePathname();

  const isParallelRoute = PARALLEL_ROUTE_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix),
  );

  if (!isParallelRoute) return null;

  return (
    <div className="absolute inset-0 z-75 bg-white flex flex-col">
      <SubHeader viewTransitionName="" />
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  );
};

export default ParallelRouterFrame;
