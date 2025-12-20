import { ReactNode } from 'react';

import { TransitionWrapper } from '@/providers/TransitionProvider';

interface Props {
  children: ReactNode;
}

export default function Layout({ children }: Props) {
  return <TransitionWrapper className="h-full">{children}</TransitionWrapper>;
}
