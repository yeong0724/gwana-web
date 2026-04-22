import { useMutation, useQuery } from '@tanstack/react-query';

import {
  deleteProductImage,
  getProductDetail,
  getProductList,
  updateProduct,
  uploadProductImage,
} from '@/api/product';
import {
  Product,
  ProductDetailRequest,
  ProductDetailResponse,
  ProductImageDeleteRequest,
  ProductListRequest,
  ProductUpdateRequest,
  UseMutationCustomOptions,
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

  const useUploadProductImagedMutation = (options?: UseMutationCustomOptions<string>) => {
    return useMutation({
      mutationFn: (param: FormData) => uploadProductImage(param),
      ...options,
    });
  };

  const useUpdateProductMutation = (options?: UseMutationCustomOptions<void>) => {
    return useMutation({
      mutationFn: (param: ProductUpdateRequest) => updateProduct(param),
      ...options,
    });
  };

  const useDeleteProductImageMutation = (options?: UseMutationCustomOptions<void>) => {
    return useMutation({
      mutationFn: (param: ProductImageDeleteRequest) => deleteProductImage(param),
      ...options,
    });
  };

  return {
    useProductListQuery,
    useProductDetailQuery,
    useUploadProductImagedMutation,
    useUpdateProductMutation,
    useDeleteProductImageMutation,
  };
};

export default useProductService;
