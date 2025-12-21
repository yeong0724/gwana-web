import { useMemo } from 'react';

import { filter, map } from 'lodash-es';

import { productMockData } from '@/api/mock';
import useNativeRouter from '@/hooks/useNativeRouter';

import ProductCard from './ProductCard';
import ProductSkeleton from './ProductSkeleton';

type Props = {
  categoryId: string;
};

const ProductList = ({ categoryId }: Props) => {
  const { forward } = useNativeRouter();

  const productList = useMemo(() => {
    return categoryId === 'all' ? productMockData : filter(productMockData, { categoryId });
  }, [categoryId]);

  const onClickProduct = (productId: string) => {
    forward(`/product/${productId}`);
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
