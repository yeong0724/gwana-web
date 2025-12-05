'use client';

import { useContext } from 'react';
import { usePathname } from 'next/navigation';

import { AnimatePresence, motion } from 'framer-motion';

import { RouterWrapperContext } from '@/contexts';
import { useIsMobile } from '@/hooks/use-mobile';

export default function PageTransitionTemplate({ children }: { children: React.ReactNode }) {
  const { transitionType, resetTransition } = useContext(RouterWrapperContext);
  const pathname = usePathname();
  const isMobile = useIsMobile();

  // 모바일이 아니면 애니메이션 없이 렌더링
  if (!isMobile) {
    return <>{children}</>;
  }

  const variants = {
    initial: (type: string) => {
      if (type === 'NONE') return { x: 0, opacity: 1, zIndex: 1 };
      return {
        x: type === 'PUSH' ? '100%' : '0%',
        opacity: 1,
        zIndex: type === 'PUSH' ? 2 : 1,
      };
    },
    animate: {
      x: '0%',
      opacity: 1,
      zIndex: 1,
      filter: 'brightness(1)',
      scale: 1,
    },
    exit: (type: string) => {
      if (type === 'NONE') return { x: 0, opacity: 1, zIndex: 0 };
      return {
        x: type === 'PUSH' ? '0%' : '100%',
        zIndex: type === 'POP' ? 2 : 0,
        filter: type === 'PUSH' ? 'brightness(0.8)' : 'brightness(1)', // 뒤로 밀리는 페이지 어둡게 처리
        scale: type === 'PUSH' ? 0.95 : 1, // 뒤로 밀리는 페이지 살짝 축소
      };
    },
  };

  return (
    <div className="grid grid-cols-1 grid-rows-1 w-full h-[100dvh] overflow-hidden bg-background">
      <AnimatePresence
        initial={false}
        mode="sync"
        onExitComplete={() => {
          resetTransition();
        }}
      >
        <motion.div
          key={pathname}
          custom={transitionType}
          variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{
            type: 'spring',
            stiffness: 260,
            damping: 30,
          }}
          className="col-start-1 row-start-1 w-full h-full overflow-y-auto overflow-x-hidden bg-background scrollbar-hide"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
