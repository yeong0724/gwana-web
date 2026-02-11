import { useEffect, useState } from 'react';

import { Breakpoint } from '@/types';

type Props = {
  breakpoint?: Breakpoint;
};

const useIsMobile = ({ breakpoint = Breakpoint.SM }: Props = {}) => {
  const getBreakpointValue = (breakpoint: Breakpoint): number => {
    switch (breakpoint) {
      case Breakpoint.SM:
        return 640;
      case Breakpoint.MD:
        return 768;
      case Breakpoint.LG:
        return 1024;
      case Breakpoint.XL:
        return 1280;
      default:
        return 1024;
    }
  };

  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const breakpointWidth = getBreakpointValue(breakpoint);
    const mediaQuery = window.matchMedia(`(max-width: ${breakpointWidth - 1}px)`);

    setIsMobile(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mediaQuery.addEventListener('change', handler);

    return () => mediaQuery.removeEventListener('change', handler);
  }, [breakpoint]);

  return { isMobile };
};

export default useIsMobile;
