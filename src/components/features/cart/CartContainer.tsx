'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { cloneDeep, filter, first, isEmpty, map, reject, size, some, sumBy } from 'lodash-es';
import { Info, Minus, Plus, ShoppingCart, X } from 'lucide-react';

import { PurchaseGuideModal } from '@/components/common/modal';
import { Checkbox } from '@/components/ui/checkbox';
import { usePageTransitions } from '@/hooks/usePageTransitions';
import { localeFormat } from '@/lib/utils';
import { useCartService } from '@/service';
import { useCartStore, useLoginStore } from '@/stores';
import { Cart } from '@/types';

const CartContainer = () => {
  const router = useRouter();
  const transitions = usePageTransitions();
  const { cart: cartStore, setCart: setCartStore, _hasHydrated } = useCartStore();
  const { isLogin } = useLoginStore();

  const [purchaseGuideModalOpen, setPurchaseGuideModalOpen] = useState<boolean>(false);

  const {
    useDeleteCartListMutation,
    useGetCartListQuery,
    useUpdateCartQuantityMutation,
    useCreatePaymentSessionMutation,
  } = useCartService();

  const { data: cartListData } = useGetCartListQuery({
    enabled: isLogin,
  });

  const { mutateAsync: deleteCartListAsync } = useDeleteCartListMutation();
  const { mutateAsync: updateCartQuantityAsync } = useUpdateCartQuantityMutation();
  const { mutateAsync: createPaymentSessionAsync } = useCreatePaymentSessionMutation();

  const [cart, setCart] = useState<Array<Cart & { checked: boolean }>>([]);

  const { totalProductPrice, totalShippingPrice } = useMemo(
    () => ({
      totalProductPrice: sumBy(
        filter(cart, { checked: true }),
        ({ price, quantity }) => price * quantity
      ),
      totalShippingPrice: sumBy(filter(cart, { checked: true }), 'shippingPrice'),
    }),
    [cart]
  );

  const isNoSelect = useMemo(() => !some(cart, { checked: true }), [cart]);

  const onCheckboxHandler = (checked: boolean, index: number) => {
    const cloneCart = cloneDeep(cart);
    cloneCart[index].checked = checked;
    setCart(cloneCart);
  };

  const onAllCheckboxHandler = (checked: boolean) => {
    setCart((prev) => map(prev, (item) => ({ ...item, checked })));
  };

  const onDeleteCart = async (deleteCart: Cart) => {
    if (isLogin) {
      await deleteCartListAsync([deleteCart.cartId]);
    } else {
      setCartStore(cloneDeep(cartStore).filter((item) => item.productId !== deleteCart.productId));
    }

    setCart(reject(cloneDeep(cart), { productId: deleteCart.productId }));
  };

  const onDeleteCartList = async () => {
    const selectedCart = filter(cart, { checked: true });
    if (isLogin) {
      await deleteCartListAsync(map(selectedCart, 'cartId'));
    } else {
      setCartStore(
        cloneDeep(cartStore).filter((item) => !some(selectedCart, { productId: item.productId }))
      );
    }

    setCart(filter(cart, { checked: false }));
  };

  const onUpdateCartQuantity = async (item: Cart, quantity: number, index: number) => {
    const payload: Cart = { ...item, quantity };

    if (isLogin) {
      await updateCartQuantityAsync(payload);
    } else {
      const cloneCartStore = cloneDeep(cartStore);
      cloneCartStore[index] = payload;
      setCartStore(cloneCartStore);
    }

    const cloneCart = cloneDeep(cart);
    cloneCart[index].quantity = quantity;
    setCart(cloneCart);
  };

  const moveToOrderPage = async () => {
    if (!isLogin) {
      setPurchaseGuideModalOpen(true);
      return;
    }

    const payload = filter(cart, { checked: true }).map(({ productId, quantity }) => ({
      productId,
      quantity,
    }));

    const { data: sessionId } = await createPaymentSessionAsync(payload);
    router.push(`/payment?sessionId=${sessionId}`);
  };

  const moveToLoginPage = () => {
    router.push('/login');
  };

  useEffect(() => {
    if (!_hasHydrated) return;
    const list = isLogin ? (cartListData?.data ?? []) : cartStore;
    setCart(map(list, (item) => ({ ...item, checked: false })));
  }, [cartListData, isLogin, _hasHydrated]);

  useEffect(() => transitions.show(), []);

  return (
    <>
      {/* 메인 컨텐츠 */}
      <div className="flex flex-col w-full max-w-[500px] mx-auto flex-1 border-x border-gray-100 overflow-hidden">
        {/* 전체선택 헤더 - 고정 영역 */}
        <div className="flex items-center justify-between p-3 sm:p-4 bg-white border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center gap-2">
            <Checkbox
              checked={cart.length > 0 && !some(cart, { checked: false })}
              onCheckedChange={(checked: boolean) => onAllCheckboxHandler(checked)}
              disabled={cart.length === 0}
            />
            <span className="text-[14px] sm:text-[15px] font-medium text-gray-900">
              전체선택 ({size(filter(cart, { checked: true }))} / {size(cart)})
            </span>
          </div>
          <button
            disabled={isNoSelect}
            className="text-[13px] sm:text-[14px] text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-2 py-1 rounded-md transition-colors disabled:text-gray-300 disabled:hover:bg-transparent disabled:cursor-not-allowed"
            onClick={onDeleteCartList}
          >
            상품삭제
          </button>
        </div>

        {/* 스크롤 영역 - 상품 리스트 + 결제 예상 금액 */}
        <div className="flex-1 overflow-y-auto min-h-0">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 bg-gray-100">
              <ShoppingCart size={64} className="text-gray-300" strokeWidth={1.5} />
              <span className="text-gray-500 text-[14px] sm:text-[15px]">
                장바구니가 비어있습니다
              </span>
            </div>
          ) : (
            <div className="flex flex-col min-h-full">
              {/* 장바구니 아이템 리스트 */}
              <div className="flex flex-col gap-6 sm:gap-5 md:gap-6 p-3 sm:p-4 bg-gray-100">
                {map(cart, (item, index) => (
                  <div
                    key={`${item.cartId}-${index}`}
                    className="bg-white border border-gray-100 rounded-lg overflow-hidden shadow-[3px_3px_10px_rgba(0,0,0,0.15)]"
                  >
                    {/* 상단 영역: 체크박스 + 상품 정보 */}
                    <div className="flex gap-2 sm:gap-3 px-3 sm:px-4 py-[16px] sm:py-[20px]">
                      {/* 체크박스 */}
                      <div className="flex items-start justify-center pt-1 px-2 sm:px-3">
                        <Checkbox
                          checked={item.checked}
                          onCheckedChange={(checked: boolean) => onCheckboxHandler(checked, index)}
                        />
                      </div>

                      {/* 나머지 콘텐츠 */}
                      <div className="flex-1 flex flex-col gap-2 sm:gap-3">
                        {/* 상단 영역: 이미지 + 상품정보 + X버튼 */}
                        <div className="flex gap-2 sm:gap-3">
                          {/* 상품 이미지 */}
                          <div className="relative w-14 h-14 sm:w-16 sm:h-16 md:w-24 md:h-24 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
                            {item.images && !isEmpty(item.images) ? (
                              <Image
                                src={first(item.images)!}
                                alt={item.productName}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-200" />
                            )}
                          </div>

                          {/* 상품명 */}
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <p className="text-[13px] sm:text-[14px] md:text-[16px] font-semibold text-gray-900">
                                  {item.categoryName}
                                </p>
                                <p className="text-[11px] sm:text-[12px] md:text-[14px] text-gray-700 mt-1 line-clamp-2">
                                  {item.productName}
                                </p>
                              </div>
                              {/* 삭제 버튼 */}
                              <button
                                className="p-1 hover:bg-gray-100 rounded ml-2 active:scale-70 transition-transform"
                                onClick={() => onDeleteCart(item)}
                              >
                                <X size={16} className="text-gray-500 sm:w-5 sm:h-5" />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* 상품 금액 (좌우 정렬) */}
                        <div className="flex justify-between items-center mt-3">
                          <span className="text-[12px] sm:text-[13px] md:text-[14px] text-gray-600">
                            상품 금액
                          </span>
                          <span className="text-[14px] sm:text-[15px] md:text-[16px] font-semibold text-gray-900">
                            {localeFormat(item.price * item.quantity)}원
                          </span>
                        </div>

                        {/* 수량 조절 버튼 (좌우 꽉차게) */}
                        <div className="flex items-center border border-gray-300 rounded overflow-hidden w-full">
                          <button
                            className="w-[15%] py-1 sm:py-1.5 hover:bg-gray-50 border-r border-gray-300 flex items-center justify-center"
                            onClick={() => onUpdateCartQuantity(item, item.quantity - 1, index)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus size={12} className="text-gray-600 sm:w-3.5 sm:h-3.5" />
                          </button>
                          <span className="w-[70%] py-1 sm:py-1.5 text-[13px] sm:text-[13px] md:text-[14px] text-gray-900 text-center">
                            {`${item.quantity} 개`}
                          </span>
                          <button
                            className="w-[15%] py-1 sm:py-1.5 hover:bg-gray-50 border-l border-gray-300 flex items-center justify-center"
                            onClick={() => onUpdateCartQuantity(item, item.quantity + 1, index)}
                          >
                            <Plus size={12} className="text-gray-600 sm:w-3.5 sm:h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* 하단 가격 산정 영역 */}
                    <div className="text-center text-[11px] sm:text-[11px] md:text-[13px] text-gray-600 py-3 border-t border-gray-200 bg-white">
                      {`상품 ${localeFormat(item.price * item.quantity)}원 + 배송비 ${localeFormat(item.shippingPrice)}원 = `}
                      <span className="font-semibold text-gray-900">
                        {localeFormat(item.price * item.quantity + item.shippingPrice)}원
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* 남은 공간 채우기 - 상품 적을 때 결제 예상 금액을 하단으로 밀어냄 */}
              <div className="flex-1 bg-gray-100" />

              {/* 결제 예상 금액 - 스크롤 영역 내 */}
              <div className="bg-white px-3 sm:px-4 pt-4 pb-3 sm:pt-5 sm:pb-4 border-t border-gray-200">
                <h3 className="text-[15px] sm:text-[15px] md:text-[16px] font-bold text-gray-900 mb-3 sm:mb-4">
                  결제 예상 금액
                </h3>
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex justify-between items-center text-[13px] sm:text-[13px] md:text-[14px]">
                    <span className="text-gray-700">상품금액</span>
                    <span className="text-gray-900">{localeFormat(totalProductPrice)}원</span>
                  </div>
                  <div className="flex justify-between items-center text-[13px] sm:text-[13px] md:text-[14px]">
                    <span className="text-gray-700">배송비</span>
                    <span className="text-gray-900">{localeFormat(totalShippingPrice)}원</span>
                  </div>
                  <div className="h-px bg-gray-200 my-3 sm:my-4" />
                  <div className="flex justify-between items-center text-[15px] sm:text-[15px] md:text-[16px] font-bold">
                    <span className="text-gray-900">총 결제 금액</span>
                    <span className="text-teal-600">
                      {localeFormat(totalProductPrice + totalShippingPrice)}원
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 구매하기 버튼 - 하단 고정 */}
        <div className="flex-shrink-0 bg-white px-3 sm:px-4 py-3 sm:py-4 z-10 border-t border-gray-200">
          <button
            disabled={isNoSelect}
            className="w-full bg-teal-600 text-white hover:bg-teal-700 rounded-full py-3 sm:py-4 flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:hover:bg-gray-300"
            onClick={moveToOrderPage}
          >
            <span className="text-[15px] sm:text-[16px] md:text-[17px] font-semibold">
              {isNoSelect
                ? '상품을 선택해주세요'
                : `${localeFormat(totalProductPrice + totalShippingPrice)}원 구매하기`}
            </span>
            {!isNoSelect && <Info size={20} className="text-white sm:w-5 sm:h-5" />}
          </button>
        </div>
      </div>
      <PurchaseGuideModal
        modalOpen={purchaseGuideModalOpen}
        setModalOpen={setPurchaseGuideModalOpen}
        moveToLoginPage={moveToLoginPage}
      />
    </>
  );
};

export default CartContainer;
