import { createContext } from 'react';

type Direction = 'forward' | 'backward';

interface RouterWrapperContextType {
  direction: Direction;
  setDirection: (direction: Direction) => void;
  wrappedPush: (url: string) => void;
  wrappedBack: () => void;
  shouldAnimate: boolean;
  resetAnimation: () => void;
}

export const RouterWrapperContext = createContext<RouterWrapperContextType>({
  direction: 'forward',
  setDirection: () => {},
  wrappedPush: () => {},
  wrappedBack: () => {},
  shouldAnimate: false,
  resetAnimation: () => {},
});
