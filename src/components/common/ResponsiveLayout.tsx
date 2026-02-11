import { cn } from '@/lib/utils';
import { Breakpoint } from '@/types';

type Props = {
  mobileComponent: React.ReactNode;
  webComponent: React.ReactNode;
  breakpoint?: Breakpoint;
};

const ResponsiveLayout = ({ mobileComponent, webComponent, breakpoint = Breakpoint.MD }: Props) => {
  return (
    <>
      {/* Mobile View */}
      <div className={cn(`${breakpoint}:hidden`)}>{mobileComponent}</div>

      {/* Web View */}
      <div className={cn('hidden', `${breakpoint}:block`)}>{webComponent}</div>
    </>
  );
};
export default ResponsiveLayout;
