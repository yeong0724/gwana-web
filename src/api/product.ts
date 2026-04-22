import { postAxios } from '@/lib/api';
import {
  ApiResponse,
  Product,
  ProductDetailRequest,
  ProductDetailResponse,
  ProductImageDeleteRequest,
  ProductListRequest,
  ProductOptionDeleteRequest,
  ProductUpdateRequest,
} from '@/types';

const getProductList = async (params: ProductListRequest) => {
  return postAxios<ApiResponse<Product[]>>({
    url: '/product/list/search',
    params,
  });
};

const getProductDetail = async (params: ProductDetailRequest) => {
  return postAxios<ApiResponse<ProductDetailResponse>>({
    url: '/product/detail/search',
    params,
  });
};

const uploadProductImage = async (params: FormData) => {
  return postAxios<ApiResponse<string>>({
    url: '/product/image/upload',
    params,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

const createProduct = async (params: ProductUpdateRequest) => {
  return postAxios<ApiResponse<void>>({
    url: '/product/create',
    params,
  });
};

const updateProduct = async (params: ProductUpdateRequest) => {
  return postAxios<ApiResponse<void>>({
    url: '/product/update',
    params,
  });
};

const deleteProductImage = async (params: ProductImageDeleteRequest) => {
  return postAxios<ApiResponse<void>>({
    url: '/product/image/delete',
    params,
  });
};

const deleteProductOption = async (params: ProductOptionDeleteRequest) => {
  return postAxios<ApiResponse<void>>({
    url: '/product/option/delete',
    params,
  });
};

export {
  getProductList,
  getProductDetail,
  uploadProductImage,
  createProduct,
  updateProduct,
  deleteProductImage,
  deleteProductOption,
};
