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
  const isTransparent = isLight || isGhost;
  const showPill = hasItems && !isTransparent;

  const iconColorClass = isLight
    ? 'text-white drop-shadow-[0_0_2px_rgba(0,0,0,0.5)]'
    : 'text-brand-900';

  const countColorClass = isLight
    ? 'text-white drop-shadow-[0_0_2px_rgba(0,0,0,0.5)]'
    : 'text-brand-900';

  const dividerClass = isLight ? 'bg-white/50' : 'bg-brand-800/25';

  return (
    <motion.button
      layout
      onClick={onClick}
      aria-label={hasItems ? `장바구니, ${count}개 담김` : '장바구니'}
      transition={SPRING}
      whileTap={{ scale: 0.94 }}
      className={cn(
        'relative flex items-center rounded-full overflow-hidden',
        'transition-colors duration-300',
        hasItems ? 'pl-1.5 pr-2 py-1 gap-1.5' : 'p-1.5',
        showPill
          ? 'bg-warm-50/95 backdrop-blur-sm border border-warm-200/70 shadow-[0_6px_18px_-10px_rgba(120,82,48,0.35)]'
          : isLight
            ? 'hover:bg-white/10'
            : 'hover:bg-brand-100/40'
      )}
    >
      {/* Cart icon with incremental bump + ambient pulse dot */}
      <motion.span
        key={bumpKey}
        animate={bumpKey ? { rotate: [0, -14, 10, -6, 0], scale: [1, 1.15, 1] } : undefined}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="relative flex items-center justify-center"
      >
        <ShoppingCart size={18} strokeWidth={2} className={iconColorClass} />
        {hasItems && (
          <motion.span
            className="absolute -top-[2px] -right-[2px] w-[5px] h-[5px] rounded-full bg-tea-500"
            animate={{ scale: [1, 1.6, 1], opacity: [1, 0.35, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}
      </motion.span>

      {/* Morphing count segment — expands from width 0, flips on change */}
      <AnimatePresence initial={false}>
        {hasItems && (
          <motion.span
            key="count-segment"
            layout
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 'auto', opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={SPRING}
            className="flex items-center overflow-hidden"
          >
            <span className={cn('h-2.5 w-px mr-1.5', dividerClass)} aria-hidden />
            <span
              className={cn(
                'relative inline-flex items-center font-mono text-[10px] font-semibold tabular-nums tracking-tight',
                countColorClass
              )}
            >
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={displayCount}
                  initial={{ y: 8, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -8, opacity: 0 }}
                  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                  className="inline-block"
                >
                  {displayCount}
                </motion.span>
              </AnimatePresence>
            </span>
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

export default CartButton;
