'use client';

import SubHeader from '@/components/layout/Header/SubHeader';

import InquiryDetailContainer from './InquiryDetailContainer';

type Props = {
  inquiryId: string;
};

const InquiryDetailParallelContainer = ({ inquiryId }: Props) => {
  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col">
      {/* Parallel Modal Header */}
      <SubHeader viewTransitionName="" />
      {/* Parallel Modal Content */}
      <div className="flex-1 overflow-hidden">
        <InquiryDetailContainer inquiryId={inquiryId} />
      </div>
    </div>
  );
};

export default InquiryDetailParallelContainer;
