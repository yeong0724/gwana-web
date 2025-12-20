'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { RouterWrapperContext } from '@/contexts/RouterWrapperContext';

function RouterWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
  const [shouldAnimate, setShouldAnimate] = useState(false);

  // 라우터 메소드 래핑
  const wrappedPush = (url: string) => {
    setDirection('forward');
    setShouldAnimate(true);
    router.push(url);
  };

  const wrappedBack = () => {
    setDirection('backward');
    setShouldAnimate(true);
    router.back();
  };

  // 애니메이션 완료 후 플래그 리셋용
  const resetAnimation = () => {
    setShouldAnimate(false);
  };

  return (
    <RouterWrapperContext.Provider
      value={{ direction, setDirection, wrappedPush, wrappedBack, shouldAnimate, resetAnimation }}
    >
      {children}
    </RouterWrapperContext.Provider>
  );
}

export default RouterWrapper;
