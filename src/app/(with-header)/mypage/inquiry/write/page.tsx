import InquiryWriteContainer from '@/components/features/mypage/inquiry/write/InquiryWriteContainer';

interface Props {
  searchParams: Promise<{ inquiryId: string }>;
}

const Page = async ({ searchParams }: Props) => {
  const { inquiryId = '' } = await searchParams;

  return <InquiryWriteContainer inquiryId={inquiryId} />;
};

export default Page;
