import { useMutation, useQuery } from '@tanstack/react-query';

import {
  deleteCart,
  deleteCartItem,
  deleteCartList,
  getCartList,
  updateCartItemQuantity,
  upsertCart,
  upsertCartList,
} from '@/api/cart';
import {
  DeleteCartItemRequest,
  DeleteCartRequest,
  UpdateCartItemQuantityRequest,
  UpsertCartRequest,
  UseQueryOptionsType,
} from '@/types';

const useCartService = () => {
  /**
   * 장바구니 목록 조회
   */
  const useGetCartListQuery = (options?: UseQueryOptionsType) =>
    useQuery({
      queryKey: ['cartList'],
      queryFn: () => getCartList(),
      ...options,
    });

  /**
   * 장바구니 상품 추가/수정
   */
  const useUpsertCartMutation = () =>
    useMutation({
      mutationFn: (param: UpsertCartRequest) => upsertCart(param),
    });

  const useUpsertCartListMutation = () =>
    useMutation({
      mutationFn: (param: UpsertCartRequest[]) => upsertCartList(param),
    });

  const useDeleteCartListMutation = () =>
    useMutation({
      mutationFn: (param: string[]) => deleteCartList(param),
    });

  /**
   * 장바구니 상품 삭제
   */
  const useDeleteCartMutation = () =>
    useMutation({
      mutationFn: (param: DeleteCartRequest) => deleteCart(param),
    });

  /**
   * 장바구니 옵션 삭제
   */
  const useDeleteCartItemMutation = () =>
    useMutation({
      mutationFn: (param: DeleteCartItemRequest) => deleteCartItem(param),
    });

  const useUpdateCartItemQuantityMutation = () =>
    useMutation({
      mutationFn: (param: UpdateCartItemQuantityRequest) => updateCartItemQuantity(param),
    });

  return {
    useUpsertCartMutation,
    useGetCartListQuery,
    useUpsertCartListMutation,
    useDeleteCartListMutation,
    useDeleteCartMutation,
    useDeleteCartItemMutation,
    useUpdateCartItemQuantityMutation,
  };
};

export default useCartService;
