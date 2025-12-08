'use client';

import React, { useContext } from 'react';
import { usePathname } from 'next/navigation';

import { AnimatePresence, motion } from 'framer-motion';

import { RouterWrapperContext } from '@/contexts/RouterWrapperContext';
import { useIsMobile } from '@/hooks/use-mobile';

interface PageTransitionProps {
  children: React.ReactNode;
}

function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const { direction, shouldAnimate, resetAnimation } = useContext(RouterWrapperContext);
  const isMobile = useIsMobile();

  // const variants = {
  //   initial: {
  //     x: direction === 'forward' ? '100vw' : '-100vw',
  //   },
  //   animate: {
  //     x: 0,
  //   },
  //   exit: {
  //     x: direction === 'forward' ? '-100vw' : '100vw',
  //   },
  // };

  const shouldApplyAnimation = isMobile && shouldAnimate;

  const variants = {
    initial: shouldApplyAnimation ? { x: direction === 'forward' ? '100vw' : '-100vw' } : { x: 0 },
    animate: { x: 0 },
    exit: shouldApplyAnimation ? { x: direction === 'forward' ? '-100vw' : '100vw' } : { x: 0 },
  };

  return (
    <AnimatePresence mode="popLayout">
      <motion.div
        key={pathname}
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ type: 'spring', stiffness: 300, damping: 30, duration: 0.3 }}
        onAnimationComplete={resetAnimation}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

export default PageTransition;
