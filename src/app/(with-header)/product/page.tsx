import { Suspense } from 'react';

import ProductContainer from '@/components/features/product/ProductContainer';
import ProductSkeleton from '@/components/features/product/ProductSkeleton';

const Page = () => {
  return (
    <Suspense fallback={<ProductSkeleton />}>
      <ProductContainer />
    </Suspense>
  );
};

export default Page;
