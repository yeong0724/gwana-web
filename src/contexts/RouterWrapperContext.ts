import { createContext } from 'react';

export type TransitionType = 'PUSH' | 'POP' | 'NONE';

interface RouterWrapperContextType {
  transitionType: TransitionType;
  wrappedPush: (url: string) => void;
  wrappedBack: () => void;
  resetTransition: () => void;
}

const RouterWrapperContext = createContext<RouterWrapperContextType>({
  transitionType: 'NONE',
  wrappedPush: () => {},
  wrappedBack: () => {},
  resetTransition: () => {},
});

export default RouterWrapperContext;
