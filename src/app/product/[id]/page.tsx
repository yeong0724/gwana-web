import { Suspense } from 'react';

import { productMockData } from '@/api/mock';
import ProductDetailContainer from '@/components/features/product/detail/ProductDetailContainer';
import ProductDetailSkeleton from '@/components/features/product/detail/ProductDetailSkeleton';

// 빌드 시 정적 생성할 경로들 (1 ~ 9까지의 상품 ID)
export async function generateStaticParams() {
  return Array.from({ length: 9 }, (_, i) => ({
    id: String(i + 1),
  }));
}

type PageProps = {
  params: Promise<{ id: string }>;
};

const Page = async ({ params }: PageProps) => {
  const { id } = await params;

  const product = productMockData[Number(id) - 1];

  return (
    <Suspense fallback={<ProductDetailSkeleton />}>
      <ProductDetailContainer productId={id} product={product} />
    </Suspense>
  );
};

export default Page;
