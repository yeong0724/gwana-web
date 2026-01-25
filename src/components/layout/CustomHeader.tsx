'use client';

import useNativeRouter from '@/hooks/useNativeRouter';
import { ChevronLeft, Home } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useMemo } from 'react';

const CustomHeader = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { backward } = useNativeRouter();

  const title = useMemo(() => {
    switch (pathname) {
      case '/cart':
        return 'SHOP';
      case '/payment':
        return '주문/결제';
      case '/login':
        return '로그인';
      case '/mypage':
        return '마이페이지';
      case '/mypage/inquiry':
      case '/mypage/inquiry/write':
        return '1:1 문의하기';
      case '/mypage/myinfo':
        return '개인 정보 수정';
      default:
        return '';
    }
  }, [pathname]);

  const goBack = () => {
    // if (pathname.startsWith('/cart')) {
    //   router.back();
    // } else {
    //   backward();
    // }

    backward();
  };

  return (
    <header
      className="relative h-[48px] flex items-center justify-center p-4 border-b border-gray-200 w-full flex-shrink-0 bg-white"
      style={{ viewTransitionName: 'header' }}
    >
      <h1 className="text-[16px] sm:text-[19px] md:text-[20px] lg:text-[22px] font-semibold text-gray-900 tracking-widest">
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
