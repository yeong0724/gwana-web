'use client';

import React, { useContext, useEffect } from 'react';
import { usePathname } from 'next/navigation';

import { AnimatePresence, motion } from 'framer-motion';

import { RouterWrapperContext } from '@/contexts/RouterWrapperContext';
import { useIsMobile } from '@/hooks/use-mobile';

interface PageTransitionProps {
  children: React.ReactNode;
}

function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const { direction, isBrowserNavigation } = useContext(RouterWrapperContext);
  const isMobile = useIsMobile();

  const variants = {
    initial: {
      x: direction === 'forward' ? '100vw' : '-100vw',
    },
    animate: {
      x: 0,
    },
    exit: {
      x: direction === 'forward' ? '-100vw' : '100vw',
    },
  };

  if (!isMobile || isBrowserNavigation) {
    return <>{children}</>;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ type: 'spring', stiffness: 300, damping: 30, duration: 0.3 }}
      >
        {children}
      </motion.div>

      <motion.div
        key="cached-page"
        className="cached-page"
        initial={{ x: 0 }}
        animate={{
          x: direction === 'forward' ? '-100vw' : '100vw',
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        Cached Page Content
      </motion.div>
    </AnimatePresence>
  );
}

export default PageTransition;
