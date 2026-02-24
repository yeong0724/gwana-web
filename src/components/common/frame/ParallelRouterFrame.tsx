import SubHeader from '@/components/layout/Header/SubHeader';

type Props = {
  children: React.ReactNode;
};

const ParallelRouterFrame = ({ children }: Props) => {
  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col">
      {/* Parallel Modal Header */}
      <SubHeader viewTransitionName="" />
      {/* Parallel Modal Content */}
      <div className="flex-1 overflow-hidden">{children}</div>
    </div>
  );
};

export default ParallelRouterFrame;
