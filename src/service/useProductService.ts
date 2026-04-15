import { useQuery } from '@tanstack/react-query';

import { getProductDetail, getProductList } from '@/api/product';
import {
  Product,
  ProductDetailRequest,
  ProductDetailResponse,
  ProductListRequest,
  UseQueryCustomOptions,
} from '@/types';

const useProductService = () => {
  const useProductListQuery = (
    payload: ProductListRequest,
    options?: UseQueryCustomOptions<Product[]>
  ) => {
    return useQuery({
      queryKey: ['productList', payload.categoryId],
      queryFn: () => getProductList(payload),
      ...options,
    });
  };

  const useProductDetailQuery = (
    payload: ProductDetailRequest,
    options?: UseQueryCustomOptions<ProductDetailResponse>
  ) => {
    return useQuery({
      queryKey: ['productList', payload.productId],
      queryFn: () => getProductDetail(payload),
      ...options,
    });
  };

  return { useProductListQuery, useProductDetailQuery };
};

export default useProductService;
