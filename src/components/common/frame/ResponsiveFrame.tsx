import { cn } from '@/lib/utils';
import { Breakpoint } from '@/types';

type Props = {
  mobileComponent: React.ReactNode;
  webComponent: React.ReactNode;
  breakpoint?: Breakpoint;
  mobileClassName?: string;
  webClassName?: string;
};

const ResponsiveFrame = ({
  mobileComponent,
  webComponent,
  breakpoint = Breakpoint.MD,
  mobileClassName,
  webClassName,
}: Props) => {
  return (
    <>
      {/* Mobile View */}
      <div className={cn('contents', `${breakpoint}:hidden`, mobileClassName)}>
        {mobileComponent}
      </div>

      {/* Web View */}
      <div className={cn('contents', 'hidden', `${breakpoint}:block`, webClassName)}>
        {webComponent}
      </div>
    </>
  );
};
export default ResponsiveFrame;
