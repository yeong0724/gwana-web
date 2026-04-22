import { useMutation, useQuery } from '@tanstack/react-query';

import {
  createProduct,
  deleteProductImage,
  deleteProductOption,
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
  ProductOptionDeleteRequest,
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
      queryKey: ['productDetail', payload.productId],
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

  const useCreateProductMutation = (options?: UseMutationCustomOptions<void>) => {
    return useMutation({
      mutationFn: (param: ProductUpdateRequest) => createProduct(param),
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

  const useDeleteProductOptionMutation = (options?: UseMutationCustomOptions<void>) => {
    return useMutation({
      mutationFn: (param: ProductOptionDeleteRequest) => deleteProductOption(param),
      ...options,
    });
  };

  return {
    useProductListQuery,
    useProductDetailQuery,
    useUploadProductImagedMutation,
    useCreateProductMutation,
    useUpdateProductMutation,
    useDeleteProductImageMutation,
    useDeleteProductOptionMutation,
  };
};

export default useProductService;
