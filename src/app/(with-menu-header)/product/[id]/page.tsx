import ProductDetailContainer from '@/components/features/product/detail/ProductDetailContainer';

type PageProps = {
  params: Promise<{ id: string }>;
};

const Page = async ({ params }: PageProps) => {
  const { id } = await params;

  return <ProductDetailContainer productId={id} />;
};

export default Page;
