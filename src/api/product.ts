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

/* =========== 관리자 - 상품 관리 API =========== */
const uploadProductImage = async (params: FormData) => {
  return postAxios<ApiResponse<string>>({
    url: '/admin/product/image/upload',
    params,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

const createProduct = async (params: ProductUpdateRequest) => {
  return postAxios<ApiResponse<void>>({
    url: '/admin/product/create',
    params,
  });
};

const updateProduct = async (params: ProductUpdateRequest) => {
  return postAxios<ApiResponse<void>>({
    url: '/admin/product/update',
    params,
  });
};

const deleteProductImage = async (params: ProductImageDeleteRequest) => {
  return postAxios<ApiResponse<void>>({
    url: '/admin/product/image/delete',
    params,
  });
};

const deleteProductOption = async (params: ProductOptionDeleteRequest) => {
  return postAxios<ApiResponse<void>>({
    url: '/admin/product/option/delete',
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
