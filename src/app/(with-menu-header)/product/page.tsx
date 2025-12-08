import ProductContainer from '@/components/features/product/ProductContainer';

type PageProps = {
  searchParams: Promise<{ category: string }>;
};

const Page = async ({ searchParams }: PageProps) => {
  const { category } = await searchParams;

  return <ProductContainer categoryId={category} />;
};

export default Page;
