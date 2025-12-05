'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { RouterWrapperContext } from '@/contexts';
import type { TransitionType } from '@/contexts/RouterWrapperContext';

export function RouterWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [transitionType, setTransitionType] = useState<TransitionType>('NONE');

  const wrappedPush = (url: string) => {
    setTransitionType('PUSH');
    router.push(url);
  };

  const wrappedBack = () => {
    setTransitionType('POP');
    router.back();
  };

  const resetTransition = () => {
    setTransitionType('NONE');
  };

  return (
    <RouterWrapperContext.Provider
      value={{ wrappedPush, wrappedBack, transitionType, resetTransition }}
    >
      {children}
    </RouterWrapperContext.Provider>
  );
}
