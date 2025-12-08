'use client';

import React, { useContext } from 'react';
import { usePathname } from 'next/navigation';

import { AnimatePresence, motion } from 'framer-motion';

import FrozenRouter from '@/components/common/FrozenRouter';
import { RouterWrapperContext } from '@/contexts/RouterWrapperContext';
import { useIsMobile } from '@/hooks/use-mobile';

interface PageTransitionProps {
  children: React.ReactNode;
}

function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const { direction, shouldAnimate, resetAnimation } = useContext(RouterWrapperContext);
  const isMobile = useIsMobile();

  const shouldApplyAnimation = isMobile && shouldAnimate;

  const variants = {
    initial: shouldApplyAnimation ? { x: direction === 'forward' ? '100%' : '-100%' } : { x: 0 },
    animate: { x: 0 },
    exit: shouldApplyAnimation ? { x: direction === 'forward' ? '-100%' : '100%' } : { x: 0 },
  };

  return (
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.div
        key={pathname}
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.4 }}
        onAnimationComplete={resetAnimation}
        className="w-full"
      >
        <FrozenRouter>{children}</FrozenRouter>
      </motion.div>
    </AnimatePresence>
  );
}

export default PageTransition;
