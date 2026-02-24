import { cn } from '@/lib/utils';
import { Breakpoint } from '@/types';

type Props = {
  mobileComponent: React.ReactNode;
  webComponent: React.ReactNode;
  breakpoint?: Breakpoint;
};

const ResponsiveFrame = ({ mobileComponent, webComponent, breakpoint = Breakpoint.MD }: Props) => {
  return (
    <>
      {/* Mobile View */}
      <div className={cn('contents', `${breakpoint}:hidden`)}>{mobileComponent}</div>

      {/* Web View */}
      <div className={cn('contents', 'hidden', `${breakpoint}:block`)}>{webComponent}</div>
    </>
  );
};
export default ResponsiveFrame;
