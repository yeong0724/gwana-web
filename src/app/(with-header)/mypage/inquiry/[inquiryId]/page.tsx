import InquiryDetailContainer from "@/components/features/mypage/inquiry/detail/InquiryDetailContainer";

type PageProps = {
  params: Promise<{ inquiryId: string }>;
}
const Page = async ({ params }: PageProps) => {
  const { inquiryId } = await params;

  return <InquiryDetailContainer inquiryId={inquiryId} />
}

export default Page;