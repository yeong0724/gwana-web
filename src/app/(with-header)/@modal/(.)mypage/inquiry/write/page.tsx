import { ParallelRouterFrame } from '@/components/common/frame';
import InquiryWriteContainer from '@/components/features/mypage/inquiry/write/InquiryWriteContainer';

interface Props {
  searchParams: Promise<{ inquiryId: string; productId?: string }>;
}

const Page = async ({ searchParams }: Props) => {
  const { inquiryId = '', productId = null } = await searchParams;

  return (
    <ParallelRouterFrame>
      <InquiryWriteContainer inquiryId={inquiryId} productId={productId} />
    </ParallelRouterFrame>
  );
};

export default Page;
