import { useMutation, useQuery } from '@tanstack/react-query';

import {
  addToCart,
  deleteCartList,
  getCartList,
  updateCartList,
  updateCartQuantity,
} from '@/api/cart';
import { AddToCartRequest, UpdateCartRequest, UseQueryOptionsType } from '@/types';

const useCartService = () => {
  const useAddToCartMutation = () =>
    useMutation({
      mutationFn: (param: AddToCartRequest) => addToCart(param),
    });

  const useUpdateCartListMutation = () =>
    useMutation({
      mutationFn: (param: UpdateCartRequest[]) => updateCartList(param),
    });

  const useDeleteCartListMutation = () =>
    useMutation({
      mutationFn: (param: string[]) => deleteCartList(param),
    });

  const useUpdateCartQuantityMutation = () =>
    useMutation({
      mutationFn: (param: AddToCartRequest) => updateCartQuantity(param),
    });

  const useGetCartListQuery = (options?: UseQueryOptionsType) =>
    useQuery({
      queryKey: ['cartList'],
      queryFn: () => getCartList(),
      ...options,
    });

  return {
    useAddToCartMutation,
    useGetCartListQuery,
    useUpdateCartListMutation,
    useDeleteCartListMutation,
    useUpdateCartQuantityMutation,
  };
};

export default useCartService;
