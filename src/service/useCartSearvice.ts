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
  Cart,
  DeleteCartItemRequest,
  DeleteCartRequest,
  UpdateCartItemQuantityRequest,
  UpsertCartRequest,
  UseMutationCustomOptions,
  UseQueryCustomOptions,
} from '@/types';

const useCartService = () => {
  /**
   * 장바구니 목록 조회
   */
  const useGetCartListQuery = (options?: UseQueryCustomOptions<Cart[]>) =>
    useQuery({
      queryKey: ['cartList'],
      queryFn: () => getCartList(),
      ...options,
    });

  /**
   * 장바구니 상품 추가/수정
   */
  const useUpsertCartMutation = (options?: UseMutationCustomOptions) =>
    useMutation({
      mutationFn: (param: UpsertCartRequest) => upsertCart(param),
      ...options,
    });

  /**
   * 장바구니 상품 목록 추가/수정
   */
  const useUpsertCartListMutation = (options?: UseMutationCustomOptions) =>
    useMutation({
      mutationFn: (param: UpsertCartRequest[]) => upsertCartList(param),
      ...options,
    });

  /**
   * 장바구니 선택 목록 삭제
   */
  const useDeleteCartListMutation = (options?: UseMutationCustomOptions) =>
    useMutation({
      mutationFn: (param: string[]) => deleteCartList(param),
      ...options,
    });

  /**
   * 장바구니 상품 삭제
   */
  const useDeleteCartMutation = (options?: UseMutationCustomOptions) =>
    useMutation({
      mutationFn: (param: DeleteCartRequest) => deleteCart(param),
      ...options,
    });

  /**
   * 장바구니 옵션 삭제
   */
  const useDeleteCartItemMutation = (options?: UseMutationCustomOptions) =>
    useMutation({
      mutationFn: (param: DeleteCartItemRequest) => deleteCartItem(param),
      ...options,
    });

  /**
   * 장바구니 옵션 수량 수정
   */
  const useUpdateCartItemQuantityMutation = (options?: UseMutationCustomOptions) =>
    useMutation({
      mutationFn: (param: UpdateCartItemQuantityRequest) => updateCartItemQuantity(param),
      ...options,
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
