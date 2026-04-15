import { getAxios, postAxios } from '@/lib/api';
import {
  ApiResponse,
  Cart,
  DeleteCartItemRequest,
  DeleteCartRequest,
  UpdateCartItemQuantityRequest,
  UpsertCartRequest,
} from '@/types';

const getCartList = async () => {
  return getAxios<ApiResponse<Cart[]>>({
    url: '/cart/list/search',
  });
};

const upsertCart = async (params: UpsertCartRequest) => {
  return postAxios<ApiResponse<void>>({
    url: '/cart/upsert',
    params,
  });
};

const upsertCartList = async (params: UpsertCartRequest[]) => {
  return postAxios<ApiResponse<void>>({
    url: '/cart/list/upsert',
    params,
  });
};

const deleteCart = async (params: DeleteCartRequest) => {
  return postAxios<ApiResponse<void>>({
    url: '/cart/delete',
    params,
  });
};

const deleteCartItem = async (params: DeleteCartItemRequest) => {
  return postAxios<ApiResponse<void>>({
    url: '/cart/cart-item/delete',
    params,
  });
};

const deleteCartList = async (params: string[]) => {
  return postAxios<ApiResponse<void>>({
    url: '/cart/list/delete',
    params,
  });
};

const updateCartItemQuantity = async (params: UpdateCartItemQuantityRequest) => {
  return postAxios<ApiResponse<void>>({
    url: '/cart/quantity/update',
    params,
  });
};

export {
  upsertCart,
  deleteCart,
  deleteCartList,
  getCartList,
  upsertCartList,
  deleteCartItem,
  updateCartItemQuantity,
};
