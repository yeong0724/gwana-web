import React, { useEffect, useState } from 'react';

import { filter, map } from 'lodash-es';

import { productMockData } from '@/api/mock';
import { usePageTransitions } from '@/hooks/usePageTransitions';
import { useProductService } from '@/service';
import { FlowType, Product } from '@/types';

import ProductCard from './ProductCard';
import ProductSkeleton from './ProductSkeleton';

type Props = {
  categoryId: string;
};

const ProductList = ({ categoryId }: Props) => {
  const transitions = usePageTransitions();
  const { useProductListQuery } = useProductService();
  const [productList, setProductList] = useState<Array<Product>>([]);

  // const { data: productListData, isFetching } = useProductListQuery(
  //   { categoryId: categoryId === 'all' ? '' : categoryId },
  //   { enabled: true, staleTime: 0 }
  // );

  // useEffect(() => {
  //   if (productListData) {
  //     const { data } = productListData;
  //     setProductList(data);
  //   }
  // }, [productListData, categoryId]);

  useEffect(() => transitions.show(), []);

  useEffect(() => {
    const data = categoryId === 'all' ? productMockData : filter(productMockData, { categoryId });

    setProductList(data);
  }, [categoryId]);

  const onClickProduct = (productId: string) => {
    // View Transitions API로 동시 슬라이드 전환
    transitions.navigateWithTransition(`/product/${productId}`, FlowType.Next);
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
