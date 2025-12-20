import { Dispatch, RefObject, SetStateAction } from 'react';

import { FlowType } from '@/types/enum';

type TransitionsContextType = {
  flowType: RefObject<FlowType | null>;
  className: string;
  setClassName: Dispatch<SetStateAction<string>>;
  animationDuration: number; // Duration of the animation, in miliseconds
};

export type { TransitionsContextType };
