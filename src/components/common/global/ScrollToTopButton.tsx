'use client';

import { useEffect, useState } from 'react';

import { ArrowUp } from 'lucide-react';

import { cn } from '@/lib/utils';
import { useScrollTopStore } from '@/stores';

const SHOW_THRESHOLD = 200;
const BASE_BOTTOM = 24;

const ScrollToTopButton = () => {
  const [visible, setVisible] = useState(false);
  const { bottomOffset, hidden } = useScrollTopStore();

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > SHOW_THRESHOLD);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const show = visible && !hidden;

  return (
    <button
      type="button"
      aria-label="맨 위로 이동"
      onClick={handleClick}
      style={{ bottom: BASE_BOTTOM + bottomOffset }}
      className={cn(
        'fixed right-6 z-[65]',
        'flex h-11 w-11 items-center justify-center',
        'rounded-full border border-neutral-200 bg-white/90 backdrop-blur',
        'shadow-[0_2px_8px_rgba(0,0,0,0.06)]',
        'transition-all duration-300 ease-out',
        'hover:bg-white hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)]',
        show
          ? 'pointer-events-auto translate-y-0 opacity-100'
          : 'pointer-events-none translate-y-2 opacity-0'
      )}
    >
      <ArrowUp className="h-5 w-5 text-neutral-800" strokeWidth={1.75} />
    </button>
  );
};

export default ScrollToTopButton;
