import ProductDetailContainer from '@/components/features/product/detail/ProductDetailContainer';

// 빌드 시 정적 생성할 경로들 (1 ~ 8까지의 상품 ID)
export async function generateStaticParams() {
  return Array.from({ length: 8 }, (_, i) => ({
    id: String(i + 1),
  }));
}

type PageProps = {
  params: Promise<{ id: string }>;
};

const Page = async ({ params }: PageProps) => {
  const { id } = await params;

  return <ProductDetailContainer productId={id} />;
};

export default Page;
