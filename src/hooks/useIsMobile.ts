import { useEffect, useState } from 'react';

enum Breakpoint {
  SM = 'sm',
  MD = 'md',
  LG = 'lg',
  XL = 'xl',
}

type Props = {
  breakpoint?: Breakpoint;
};

const useIsMobile = ({ breakpoint = Breakpoint.LG }: Props = {}) => {
  const [isMobile, setIsMobile] = useState(false);

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
