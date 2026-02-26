import { getAxios, postAxios } from '@/lib/api';
import { AddToCartRequest, ApiResponse, Cart, DeleteCartRequest, UpdateCartRequest } from '@/types';

const addToCart = async (params: AddToCartRequest) => {
  return postAxios<ApiResponse<void>>({
    url: '/cart/add',
    params,
  });
};

const updateCartList = async (params: UpdateCartRequest[]) => {
  return postAxios<ApiResponse<void>>({
    url: '/cart/update',
    params,
  });
};

const getCartList = async () => {
  return getAxios<ApiResponse<Cart[]>>({
    url: '/cart/list',
  });
};

const deleteCart = async (params: DeleteCartRequest) => {
  return postAxios<ApiResponse<void>>({
    url: '/cart/delete',
    params,
  });
};

const deleteCartList = async (params: string[]) => {
  return postAxios<ApiResponse<void>>({
    url: '/cart/delete/list',
    params,
  });
};

const updateCartQuantity = async (params: AddToCartRequest) => {
  return postAxios<ApiResponse<void>>({
    url: '/cart/update/quantity',
    params,
  });
};

export { addToCart, deleteCart, deleteCartList, getCartList, updateCartList, updateCartQuantity };
