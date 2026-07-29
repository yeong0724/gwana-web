import { getAxios, postAxios } from '@/lib/api';
import {
  ApiResponse,
  InfiniteResponse,
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
const getAdminProductList = async (params: ProductListRequest) => {
  return postAxios<ApiResponse<Product[]>>({
    url: '/admin/product/list',
    params,
  });
};

const updateProductStatus = async (params: ProductStatusUpdateRequest) => {
  return postAxios<ApiResponse<void>>({
    url: '/admin/product/status/update',
    params,
  });
};

const getAdminProductDetail = async (params: ProductDetailRequest) => {
  return postAxios<ApiResponse<ProductDetailResponse>>({
    url: '/admin/product/detail',
    params,
  });
};

const getProductAddons = async () => {
  return getAxios<ApiResponse<ProductAddon[]>>({
    url: '/admin/product/addons',
  });
};

const createProductAddon = async (params: ProductAddonUpsertRequest) => {
  return postAxios<ApiResponse<void>>({
    url: '/admin/product/addon/create',
    params,
  });
};

const updateProductAddon = async (params: ProductAddonUpsertRequest) => {
  return postAxios<ApiResponse<void>>({
    url: '/admin/product/addon/update',
    params,
  });
};

const deleteProductAddon = async (params: ProductAddonDeleteRequest) => {
  return postAxios<ApiResponse<void>>({
    url: '/admin/product/addon/delete',
    params,
  });
};

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
  return postAxios<ApiResponse<ProductDetailResponse>>({
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

const deleteProductVariant = async (params: ProductVariantDeleteRequest) => {
  return postAxios<ApiResponse<void>>({
    url: '/admin/product/variant/delete',
    params,
  });
};

const getProductInquiryList = async (params: ProductInquiryListSearchRequest) => {
  return postAxios<ApiResponse<InfiniteResponse<Inquiry[]>>>({
    url: '/product/inquiry/list/search',
    params,
  });
};

export {
  getProductList,
  getProductDetail,
  getAdminProductList,
  updateProductStatus,
  getAdminProductDetail,
  getProductAddons,
  createProductAddon,
  updateProductAddon,
  deleteProductAddon,
  uploadProductImage,
  createProduct,
  updateProduct,
  deleteProductImage,
  deleteProductVariant,
  getProductInquiryList,
};
