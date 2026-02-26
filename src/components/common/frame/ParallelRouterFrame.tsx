import SubHeader from '@/components/layout/Header/SubHeader';

type Props = {
  children: React.ReactNode;
};

const ParallelRouterFrame = ({ children }: Props) => {
  return (
    <div className="absolute inset-0 z-75 bg-white flex flex-col">
      {/* Parallel Modal Header */}
      <SubHeader viewTransitionName="" />
      {/* Parallel Modal Content */}
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  );
};

export default ParallelRouterFrame;
