'use client';

import { useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { ChevronLeft, Home } from 'lucide-react';

import useNativeRouter from '@/hooks/useNativeRouter';

type Props = {
  viewTransitionName?: string;
};
const SubHeader = ({ viewTransitionName = 'header' }: Props) => {
  const pathname = usePathname();
  const router = useRouter();
  const { backward } = useNativeRouter();

  const title = useMemo(() => {
    switch (true) {
      case pathname === '/cart':
        return 'SHOP';
      case pathname === '/payment':
        return '주문/결제';
      case pathname === '/login':
        return '로그인';
      case pathname === '/mypage':
        return '마이페이지';
      case pathname.startsWith('/mypage/inquiry'):
        return '1:1 문의하기';
      case pathname === '/mypage/myinfo':
        return '개인 정보 수정';
      case pathname === '/mypage/review':
        return '리뷰 작성';
      default:
        return '';
    }
  }, [pathname]);

  const goBack = () => {
    backward();
  };

  const goHome = () => {
    router.push('/');
  };

  return (
    <header
      className="relative h-[48px] flex items-center justify-center p-4 border-b border-brand-200/60 w-full flex-shrink-0 bg-warm-50"
      style={{ viewTransitionName }}
    >
      <h1 className="text-[16px] sm:text-[19px] md:text-[20px] lg:text-[22px] font-semibold text-brand-900 tracking-wide">
        {title}
      </h1>
      <button
        className="absolute left-4 p-2 hover:bg-brand-100 rounded-lg transition-colors duration-200"
        onClick={goBack}
        aria-label="뒤로가기"
      >
        <ChevronLeft size={20} className="text-brand-700 sm:w-6 sm:h-6" />
      </button>
      <button
        className="absolute right-3 sm:right-4 p-2 hover:bg-brand-100 rounded-lg transition-colors duration-200"
        onClick={goHome}
        aria-label="홈으로 이동"
      >
        <Home size={20} className="text-brand-700 sm:w-6 sm:h-6" />
      </button>
    </header>
  );
};

export default SubHeader;
