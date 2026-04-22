import ProductWriteContainer from '@/components/features/admin/product-management/write/ProductWriteContainer';

type PageProps = {
  searchParams: Promise<{ productId: string }>;
};

const Page = async ({ searchParams }: PageProps) => {
  const { productId } = await searchParams;

  return <ProductWriteContainer productId={productId} />;
};

export default Page;
