'use client';

import React, { createContext, useContext, useRef, useState } from 'react';

import { FlowType, TransitionsContextType } from '@/types';

export const TransitionsContext = createContext<TransitionsContextType | null>(null);

/**
 * Context만 제공하는 Provider (애니메이션 wrapper 없음)
 * Header/Footer 등에서도 context 접근 가능
 */
export function TransitionsProvider({ children }: React.PropsWithChildren) {
  const [className, setClassName] = useState('');
  const flowType = useRef<FlowType | null>(null);

  return (
    <TransitionsContext.Provider
      value={{
        className,
        setClassName,
        flowType,
        animationDuration: 300,
      }}
    >
      {children}
    </TransitionsContext.Provider>
  );
}

/**
 * 실제 애니메이션이 적용되는 Wrapper
 * main 영역만 감싸서 사용
 */
export function TransitionWrapper({
  children,
  className: wrapperClassName,
}: React.PropsWithChildren<{ className?: string }>) {
  const context = useContext(TransitionsContext);

  if (!context) {
    throw new Error('TransitionWrapper must be used within TransitionsProvider');
  }

  return <div className={`${context.className} ${wrapperClassName ?? ''}`}>{children}</div>;
}
