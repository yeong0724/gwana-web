import { useMemo } from 'react';
import { useRouter } from 'next/navigation';

import { filter, map } from 'lodash-es';

import { productMockData } from '@/api/mock';
import { usePageTransitions } from '@/hooks/usePageTransitions';
import { useProductService } from '@/service';
import { FlowType } from '@/types';

import ProductCard from './ProductCard';
import ProductSkeleton from './ProductSkeleton';

type Props = {
  categoryId: string;
};

const ProductList = ({ categoryId }: Props) => {
  const router = useRouter();
  const transitions = usePageTransitions();
  const { useProductListQuery } = useProductService();

  const productList = useMemo(() => {
    return categoryId === 'all' ? productMockData : filter(productMockData, { categoryId });
  }, [categoryId]);

  // useEffect(() => transitions.show(), []);

  const onClickProduct = (productId: string) => {
    transitions.hide(FlowType.Next).then(() => {
      router.push(`/product/${productId}`);
    });
  };

  return (
    <>
      {false ? (
        <ProductSkeleton />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
          {map(productList, (product) => (
            <ProductCard
              key={product.productId}
              product={product}
              onClickProduct={onClickProduct}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default ProductList;
