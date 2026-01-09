import ProductContainer from '@/components/features/product/ProductContainer';

interface Props {
  searchParams: Promise<{ category: string }>;
}

const Page = async ({ searchParams }: Props) => {
  const { category } = await searchParams;

  return <ProductContainer categoryId={category} />;
};

export default Page;
