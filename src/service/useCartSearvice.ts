import { useMutation, useQuery } from '@tanstack/react-query';

import {
  addToCart,
  createPaymentSession,
  deleteCartList,
  getCartList,
  getPaymentSession,
  updateCartList,
  updateCartQuantity,
} from '@/api/cart';
import {
  AddToCartRequest,
  Cart,
  CreatePaymentSessionRequest,
  GetPaymentSessionRequest,
  UseQueryOptionsType,
} from '@/types';

const useCartService = () => {
  const useAddToCartMutation = () =>
    useMutation({
      mutationFn: (param: AddToCartRequest) => addToCart(param),
    });

  const useUpdateCartListMutation = () =>
    useMutation({
      mutationFn: (param: Cart[]) => updateCartList(param),
    });

  const useDeleteCartListMutation = () =>
    useMutation({
      mutationFn: (param: string[]) => deleteCartList(param),
    });

  const useUpdateCartQuantityMutation = () =>
    useMutation({
      mutationFn: (param: AddToCartRequest) => updateCartQuantity(param),
    });

  const useCreatePaymentSessionMutation = () =>
    useMutation({
      mutationFn: (param: CreatePaymentSessionRequest[]) => createPaymentSession(param),
    });

  const useGetCartListQuery = (options?: UseQueryOptionsType) =>
    useQuery({
      queryKey: ['cartList'],
      queryFn: () => getCartList(),
      ...options,
    });

  const useGetPaymentSessionQuery = (
    payload: GetPaymentSessionRequest,
    options?: UseQueryOptionsType
  ) =>
    useQuery({
      queryKey: ['paymentSession', payload.sessionId],
      queryFn: () => getPaymentSession(payload),
      ...options,
    });

  return {
    useAddToCartMutation,
    useGetCartListQuery,
    useUpdateCartListMutation,
    useDeleteCartListMutation,
    useUpdateCartQuantityMutation,
    useCreatePaymentSessionMutation,
    useGetPaymentSessionQuery,
  };
};

export default useCartService;
