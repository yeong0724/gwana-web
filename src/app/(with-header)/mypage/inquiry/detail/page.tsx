import InquiryDetailContainer from '@/components/features/mypage/inquiry/detail/InquiryDetailContainer';

type PageProps = {
  searchParams: Promise<{ inquiryId: string }>;
};
const Page = async ({ searchParams }: PageProps) => {
  const { inquiryId } = await searchParams;

  return <InquiryDetailContainer inquiryId={inquiryId} />;
};

export default Page;
