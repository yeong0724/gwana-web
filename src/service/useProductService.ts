import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query';

import {
  createProduct,
  createProductAddon,
  deleteProductAddon,
  deleteProductImage,
  deleteProductVariant,
  getAdminProductDetail,
  getAdminProductList,
  getProductAddons,
  getProductDetail,
  getProductInquiryList,
  getProductList,
  updateProduct,
  updateProductAddon,
  updateProductStatus,
  uploadProductImage,
} from '@/api/product';
import {
  Inquiry,
  Product,
  ProductAddon,
  ProductAddonDeleteRequest,
  ProductAddonUpsertRequest,
  ProductDetailRequest,
  ProductDetailResponse,
  ProductImageDeleteRequest,
  ProductInquiryListSearchRequest,
  ProductListRequest,
  ProductStatusUpdateRequest,
  ProductVariantDeleteRequest,
  ProductUpdateRequest,
  UseInfiniteQueryCustomOptions,
  UseMutationCustomOptions,
  UseQueryCustomOptions,
} from '@/types';

const useProductService = () => {
  const useProductListQuery = (
    payload: ProductListRequest,
    options?: UseQueryCustomOptions<Product[]>
  ) => {
    return useQuery({
      queryKey: ['productList', payload.categorySlug],
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

  const useAdminProductListQuery = (
    payload: ProductListRequest,
    options?: UseQueryCustomOptions<Product[]>
  ) => {
    return useQuery({
      queryKey: ['adminProductList', payload.categorySlug],
      queryFn: () => getAdminProductList(payload),
      ...options,
    });
  };

  const useUpdateProductStatusMutation = (options?: UseMutationCustomOptions<void>) => {
    return useMutation({
      mutationFn: (param: ProductStatusUpdateRequest) => updateProductStatus(param),
      ...options,
    });
  };

  const useAdminProductDetailQuery = (
    payload: ProductDetailRequest,
    options?: UseQueryCustomOptions<ProductDetailResponse>
  ) => {
    return useQuery({
      queryKey: ['adminProductDetail', payload.productId],
      queryFn: () => getAdminProductDetail(payload),
      ...options,
    });
  };

  const useProductAddonsQuery = (options?: UseQueryCustomOptions<ProductAddon[]>) => {
    return useQuery({
      queryKey: ['productAddons'],
      queryFn: () => getProductAddons(),
      ...options,
    });
  };

  const useCreateProductAddonMutation = (options?: UseMutationCustomOptions<void>) => {
    return useMutation({
      mutationFn: (param: ProductAddonUpsertRequest) => createProductAddon(param),
      ...options,
    });
  };

  const useUpdateProductAddonMutation = (options?: UseMutationCustomOptions<void>) => {
    return useMutation({
      mutationFn: (param: ProductAddonUpsertRequest) => updateProductAddon(param),
      ...options,
    });
  };

  const useDeleteProductAddonMutation = (options?: UseMutationCustomOptions<void>) => {
    return useMutation({
      mutationFn: (param: ProductAddonDeleteRequest) => deleteProductAddon(param),
      ...options,
    });
  };

  const useUploadProductImagedMutation = (options?: UseMutationCustomOptions<string>) => {
    return useMutation({
      mutationFn: (param: FormData) => uploadProductImage(param),
      ...options,
    });
  };

  const useCreateProductMutation = (options?: UseMutationCustomOptions<ProductDetailResponse>) => {
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

  const useDeleteProductVariantMutation = (options?: UseMutationCustomOptions<void>) => {
    return useMutation({
      mutationFn: (param: ProductVariantDeleteRequest) => deleteProductVariant(param),
      ...options,
    });
  };

  const useGetProductInquiryListInfiniteQuery = (
    payload: Omit<ProductInquiryListSearchRequest, 'page'>,
    options?: UseInfiniteQueryCustomOptions<Inquiry[]>
  ) => {
    return useInfiniteQuery({
      queryKey: ['productInquiryList', payload],
      queryFn: ({ pageParam = 0 }) => getProductInquiryList({ ...payload, page: pageParam }),
      getNextPageParam: (lastPage) => (lastPage.data.hasNext ? lastPage.data.page + 1 : undefined),
      initialPageParam: 0,
      ...options,
    });
  };

  return {
    useProductListQuery,
    useAdminProductListQuery,
    useUpdateProductStatusMutation,
    useAdminProductDetailQuery,
    useProductDetailQuery,
    useProductAddonsQuery,
    useCreateProductAddonMutation,
    useUpdateProductAddonMutation,
    useDeleteProductAddonMutation,
    useUploadProductImagedMutation,
    useCreateProductMutation,
    useUpdateProductMutation,
    useDeleteProductImageMutation,
    useDeleteProductVariantMutation,
    useGetProductInquiryListInfiniteQuery,
  };
};

export default useProductService;
