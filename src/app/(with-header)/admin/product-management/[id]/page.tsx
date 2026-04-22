import ProductWriteContainer from '@/components/features/admin/product-management/write/ProductWriteContainer';

type PageProps = {
  params: Promise<{ id: string }>;
};

const Page = async ({ params }: PageProps) => {
  const { id } = await params;

  return <ProductWriteContainer productId={id} />;
};

export default Page;
