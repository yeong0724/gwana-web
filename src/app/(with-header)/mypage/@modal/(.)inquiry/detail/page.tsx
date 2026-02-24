import { ParallelRouterFrame } from '@/components/common/frame';
import InquiryDetailContainer from '@/components/features/mypage/inquiry/detail/InquiryDetailContainer';

type PageProps = {
  searchParams: Promise<{ inquiryId: string }>;
};

const Page = async ({ searchParams }: PageProps) => {
  const { inquiryId } = await searchParams;

  return (
    <ParallelRouterFrame>
      <InquiryDetailContainer inquiryId={inquiryId} />
    </ParallelRouterFrame>
  );
};

export default Page;
