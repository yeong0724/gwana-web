import { productMockData } from '@/api/mock';
import useNativeRouter from '@/hooks/useNativeRouter';
import { delayAsync } from '@/lib/utils';
import { filter, map } from 'lodash-es';
import { useEffect, useMemo, useState } from 'react';
import ProductCard from './ProductCard';
import ProductSkeleton from './ProductSkeleton';

type Props = {
  categoryId: string;
};

const ProductList = ({ categoryId }: Props) => {
  const { forward } = useNativeRouter();
  const [isLoading, setIsLoading] = useState(false);
  const productList = useMemo(() => {
    return categoryId === 'all' ? productMockData : filter(productMockData, { categoryId });
  }, [categoryId]);

  const onClickProduct = (productId: string) => {
    forward(`/product/${productId}`);
  };

  useEffect(() => {
    (async () => {
      await delayAsync(500);
      setIsLoading(false);
    })();
  }, []);

  return (
    <>
      {isLoading ? (
        <ProductSkeleton />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-x-[25px] gap-y-10 md:gap-x-4 md:gap-y-10">
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
