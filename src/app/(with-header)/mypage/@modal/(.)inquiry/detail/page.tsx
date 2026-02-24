import InquiryDetailParallelContainer from '@/components/features/mypage/inquiry/detail/InquiryDetailParallelContainer';

type PageProps = {
  searchParams: Promise<{ inquiryId: string }>;
};

const Page = async ({ searchParams }: PageProps) => {
  const { inquiryId } = await searchParams;

  return <InquiryDetailParallelContainer inquiryId={inquiryId} />;
};

export default Page;
