'use client';

import { useEffect, useRef, useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';

import { cn } from '@/lib/utils';

type Variant = 'default' | 'light' | 'ghost';

type Props = {
  count: number;
  onClick: () => void;
  variant?: Variant;
};

const SPRING = { type: 'spring' as const, stiffness: 420, damping: 30, mass: 0.6 };

const CartButton = ({ count, onClick, variant = 'default' }: Props) => {
  const hasItems = count > 0;
  const displayCount = count > 99 ? '99+' : String(count);
  const prevCount = useRef(count);
  const [bumpKey, setBumpKey] = useState(0);

  useEffect(() => {
    if (count > prevCount.current) setBumpKey((b) => b + 1);
    prevCount.current = count;
  }, [count]);

  const isLight = variant === 'light';
  const isGhost = variant === 'ghost';

  const iconColorClass = isLight
    ? 'text-white drop-shadow-[0_0_2px_rgba(0,0,0,0.5)]'
    : 'text-brand-900';

  const badgeColorClass = isGhost
    ? 'bg-brand-900 shadow-[0_1px_3px_rgba(0,0,0,0.25)]'
    : 'bg-red-500 ring-2 ring-warm-50 shadow-[0_1px_3px_rgba(220,38,38,0.45)]';

  return (
    <motion.button
      onClick={onClick}
      aria-label={hasItems ? `장바구니, ${count}개 담김` : '장바구니'}
      transition={SPRING}
      whileTap={{ scale: 0.92 }}
      className="relative flex items-center justify-center p-1.5 rounded-lg hover:bg-brand-100/40"
    >
      {/* Cart icon with incremental bump */}
      <motion.span
        key={bumpKey}
        animate={bumpKey ? { rotate: [0, -14, 10, -6, 0], scale: [1, 1.15, 1] } : undefined}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="relative flex items-center justify-center"
      >
        <ShoppingCart size={22} strokeWidth={2} className={iconColorClass} />
      </motion.span>

      {/* Red badge — top-right circle with count */}
      <AnimatePresence initial={false}>
        {hasItems && (
          <motion.span
            key="badge"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={SPRING}
            className={cn(
              'absolute -top-0.5',
              displayCount.length >= 2 ? '-right-1.5' : '-right-0.5',
              'flex items-center justify-center',
              'min-w-[16px] h-[16px] px-[4px]',
              'rounded-full',
              'font-mono text-[10px] font-bold tabular-nums leading-none text-white',
              badgeColorClass
            )}
            aria-hidden
          >
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={displayCount}
                initial={{ y: 6, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -6, opacity: 0 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="inline-block"
              >
                {displayCount}
              </motion.span>
            </AnimatePresence>
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

export default CartButton;
