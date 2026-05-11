import { useMutation, useQuery } from '@tanstack/react-query';

import { createOrder, getOrder } from '@/api/order';
import {
  Cart,
  OrderResponse,
  OrderSearchRequest,
  UseMutationCustomOptions,
  UseQueryCustomOptions,
} from '@/types';

const useOrderService = () => {
  const useCreateOrderMutation = (options?: UseMutationCustomOptions) => {
    return useMutation({
      mutationFn: (param: Cart[]) => createOrder(param),
      ...options,
    });
  };

  const useGetOrderQuery = (
    payload: OrderSearchRequest,
    options?: UseQueryCustomOptions<OrderResponse>
  ) => {
    return useQuery({
      queryKey: ['order', payload],
      queryFn: () => getOrder(payload),
      ...options,
    });
  };

  return { useCreateOrderMutation, useGetOrderQuery };
};

export default useOrderService;
