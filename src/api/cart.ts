import { getAxios, postAxios } from '@/lib/api';
import {
  AddToCartRequest,
  ApiResponse,
  Cart,
  CreatePaymentSessionRequest,
  GetPaymentSessionRequest,
  PaymentSession,
} from '@/types';

const addToCart = async (params: AddToCartRequest) => {
  return postAxios<ApiResponse<void>>({
    url: '/cart/add',
    params,
  });
};

const updateCartList = async (params: Cart[]) => {
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

const deleteCartList = async (params: string[]) => {
  return postAxios<ApiResponse<void>>({
    url: '/cart/delete',
    params,
  });
};

const updateCartQuantity = async (params: AddToCartRequest) => {
  return postAxios<ApiResponse<void>>({
    url: '/cart/update/quantity',
    params,
  });
};

const createPaymentSession = async (params: CreatePaymentSessionRequest[]) => {
  return postAxios<ApiResponse<string>>({
    url: '/cart/create/payment/session',
    params,
  });
};

const getPaymentSession = async (params: GetPaymentSessionRequest) => {
  return postAxios<ApiResponse<PaymentSession[]>>({
    url: '/cart/search/payment/session',
    params,
  });
};

export {
  addToCart,
  getCartList,
  updateCartList,
  deleteCartList,
  updateCartQuantity,
  createPaymentSession,
  getPaymentSession,
};
