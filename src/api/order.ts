import { postAxios } from '@/lib/api';
import { ApiResponse, Cart, OrderResponse, OrderSearchRequest } from '@/types';

const createOrder = async (params: Cart[]) => {
  return postAxios<ApiResponse<void>>({
    url: '/order/create',
    params,
  });
};

const getOrder = async (params: OrderSearchRequest) => {
  return postAxios<ApiResponse<OrderResponse>>({
    url: '/order/search',
    params,
  });
};

export { createOrder, getOrder };
