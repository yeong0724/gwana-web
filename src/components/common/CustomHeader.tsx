'use client';

import { useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { ChevronLeft, Home } from 'lucide-react';

import useNativeRouter from '@/hooks/useNativeRouter';

const CustomHeader = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { backward } = useNativeRouter();

  const title = useMemo(() => {
    if (pathname.startsWith('/cart')) return '장바구니';
    if (pathname.startsWith('/payment')) return '주문/결제';
    if (pathname.startsWith('/login')) return '로그인';
    return '';
  }, [pathname]);

  const goBack = () => {
    // if (pathname.startsWith('/cart')) {
    //   router.push('/');
    // } else {
    //   backward();
    // }

    backward();
  };

  return (
    <header
      className="relative h-[70px] flex items-center justify-center p-4 border-b border-gray-200 w-full flex-shrink-0 bg-white"
      style={{ viewTransitionName: 'header' }}
    >
      <h1 className="text-[18px] sm:text-[19px] md:text-[20px] lg:text-[22px] font-semibold text-gray-900">
        {title}
      </h1>
      <button
        className="absolute left-4 p-2 hover:bg-gray-100 rounded-md transition-colors"
        onClick={goBack}
      >
        <ChevronLeft size={20} className="text-gray-700 sm:w-6 sm:h-6" />
      </button>
      <button
        className="absolute right-3 sm:right-4 p-2 hover:bg-gray-100 rounded-md transition-colors"
        onClick={() => router.push('/')}
      >
        <Home size={20} className="text-gray-700 sm:w-6 sm:h-6" />
      </button>
    </header>
  );
};

export default CustomHeader;
