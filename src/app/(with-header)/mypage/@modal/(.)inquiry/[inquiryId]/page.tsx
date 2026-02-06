import InquiryDetailParallelContainer from '@/components/features/mypage/inquiry/detail/InquiryDetailParallelContainer';

type PageProps = {
  params: Promise<{ inquiryId: string }>;
};

const Page = async ({ params }: PageProps) => {
  const { inquiryId } = await params;

  return <InquiryDetailParallelContainer inquiryId={inquiryId} />;
};

export default Page;
