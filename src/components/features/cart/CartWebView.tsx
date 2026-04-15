import Image from 'next/image';

import { first, isEmpty, map, size, some } from 'lodash-es';
import { Minus, Plus, ShoppingCart, X } from 'lucide-react';

import { Checkbox } from '@/components/ui/checkbox';
import { useControllerContext, useStateContext } from '@/context/cartContext';
import { localeFormat } from '@/lib/utils';

const CartWebView = () => {
  const { cart, isNoSelect, totalProductPrice, totalShippingPrice } = useStateContext();
  const {
    moveToOrderPage,
    onAllCheckboxHandler,
    onDeleteCartList,
    onCheckboxHandler,
    onUpdateCartQuantity,
    onDeleteCart,
    getSumProductPrice,
    getShippingPrice,
  } = useControllerContext();

  return (
    <div className="flex w-full max-w-[1500px] mx-auto px-16 pt-8 bg-white">
      {/* 좌측: 장바구니 목록 영역 */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* 장바구니 타이틀 */}
        <h1 className="text-2xl font-medium text-gray-900 mb-6">장바구니 ({size(cart)})</h1>

        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 gap-4 bg-gray-50 rounded-lg py-20">
            <ShoppingCart size={80} className="text-gray-300" strokeWidth={1.5} />
            <span className="text-gray-500 text-[16px]">장바구니가 비어있습니다</span>
          </div>
        ) : (
          <div className="flex flex-col flex-1">
            {/* 전체선택 헤더 */}
            <div className="flex items-center justify-between py-3 border-b-[1.5px] border-gray-900">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <Checkbox
                  checked={cart.length > 0 && !some(cart, { checked: false })}
                  onCheckedChange={(checked: boolean) => onAllCheckboxHandler(checked)}
                  disabled={cart.length === 0}
                />
                <span className="text-[15px] font-semibold text-gray-700">전체선택</span>
              </label>
              <button
                disabled={isNoSelect}
                className="text-[15px] text-gray-500 hover:text-gray-900 disabled:text-gray-300 disabled:cursor-not-allowed"
                onClick={onDeleteCartList}
              >
                선택 상품 삭제
              </button>
            </div>

            {/* 상품 리스트 */}
            <div className="flex flex-col divide-y divide-gray-300">
              {map(cart, (item, index) => (
                <div key={`desktop-${item.cartId}-${index}`} className="py-6">
                  {/* 상단: 체크박스 + 이미지 + 상품명 */}
                  <div className="flex gap-4 items-start">
                    <div className="flex items-center pt-1">
                      <Checkbox
                        checked={item.checked}
                        onCheckedChange={(checked: boolean) => onCheckboxHandler(checked, index)}
                      />
                    </div>

                    <div className="relative flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
                      {item.images && !isEmpty(item.images) ? (
                        <Image
                          src={first(item.images)!}
                          alt={item.productName}
                          width={120}
                          height={120}
                        />
                      ) : (
                        <div className="w-[120px] h-[120px] bg-gray-200" />
                      )}
                    </div>

                    <div className="flex-1">
                      <p className="text-[15px] text-gray-600">{item.categoryName}</p>
                      <p className="text-[16px] font-semibold text-gray-700 mt-1">
                        {item.productName}
                      </p>
                    </div>
                  </div>

                  {/* 하위 cartItems 리스트 */}
                  <div className="flex flex-col gap-2 mt-4 ml-[32px]">
                    {map(item.cartItems, (cartItem, cartItemIndex) => (
                      <div
                        key={`${cartItem.cartItemId}-${cartItemIndex}`}
                        className="flex items-center gap-4 py-2 px-4 bg-[#f8f9fd] rounded-md"
                      >
                        {/* 옵션 라벨 + 이름 */}
                        <div className="flex items-baseline gap-1.5 flex-1 min-w-0">
                          {cartItem.isRequired ? (
                            <span className="text-[13px] text-teal-600 font-medium flex-shrink-0">
                              메인 상품
                            </span>
                          ) : (
                            <span className="text-[13px] text-teal-600 font-medium flex-shrink-0">
                              선택 옵션
                            </span>
                          )}
                          <span className="text-[13px] text-gray-400">|</span>
                          <span className="text-[14px] text-gray-700 truncate">
                            {cartItem.optionName}
                          </span>
                        </div>

                        {/* 수량 UI */}
                        <div className="flex items-center border border-gray-300 rounded overflow-hidden bg-white">
                          <button
                            className="w-7 h-7 hover:bg-gray-50 border-r border-gray-300 flex items-center justify-center disabled:opacity-50"
                            disabled={cartItem.quantity <= 1}
                            onClick={() =>
                              onUpdateCartQuantity(
                                cartItem.cartItemId,
                                index,
                                cartItemIndex,
                                cartItem.quantity,
                                -1
                              )
                            }
                          >
                            <Minus size={12} className="text-gray-600" />
                          </button>
                          <span className="w-9 h-7 text-[13px] text-gray-900 flex items-center justify-center">
                            {cartItem.quantity}
                          </span>
                          <button
                            className="w-7 h-7 hover:bg-gray-50 border-l border-gray-300 flex items-center justify-center"
                            onClick={() =>
                              onUpdateCartQuantity(
                                cartItem.cartItemId,
                                index,
                                cartItemIndex,
                                cartItem.quantity,
                                1
                              )
                            }
                          >
                            <Plus size={12} className="text-gray-600" />
                          </button>
                        </div>

                        {/* 가격 */}
                        <span className="text-[14px] font-medium text-gray-900 w-[100px] text-right">
                          {localeFormat(cartItem.optionPrice)}원
                        </span>

                        {/* 삭제 */}
                        <button
                          className="p-1 hover:bg-gray-200 rounded"
                          onClick={() =>
                            onDeleteCart(item.cartId, cartItem.cartItemId, index, cartItemIndex)
                          }
                        >
                          <X size={16} className="text-gray-400 hover:text-gray-600" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* 소계 */}
                  <div className="flex justify-end items-center gap-6 mt-3 ml-[32px] text-[14px]">
                    <span className="text-gray-500">
                      상품 {localeFormat(getSumProductPrice(item))}원
                    </span>
                    <span className="text-gray-400">+</span>
                    <span className="text-gray-500">
                      배송비{' '}
                      {getShippingPrice(item) === 0 ? (
                        <span className="text-teal-600 font-medium">무료</span>
                      ) : (
                        `${localeFormat(getShippingPrice(item))}원`
                      )}
                    </span>
                    <span className="text-gray-400">=</span>
                    <span className="text-[15px] font-bold text-gray-900">
                      {localeFormat(getSumProductPrice(item) + getShippingPrice(item))}원
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* 테이블 하단 구분선 */}
            <div className="border-t-[1.5px] border-gray-900 mt-2" />

            {/* 하단 영역: 무료배송 안내 */}
            <div className="flex justify-end items-center mt-5 mb-8">
              <p className="text-[14px] text-gray-600">※ 50,000원 이상 구매 시 무료배송</p>
            </div>
          </div>
        )}
      </div>

      {/* 우측: 결제 예정 금액 섹션 (sticky) */}
      <div className="w-[450px] flex-shrink-0 ml-20">
        <div className="sticky top-16">
          <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
            <h2 className="text-[18px] font-bold text-gray-900 mb-6">결제 예정 금액</h2>

            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center text-[15px]">
                <span className="text-gray-600">총 선택 상품 금액</span>
                <span className="text-gray-900">{localeFormat(totalProductPrice)}원</span>
              </div>
              <div className="flex justify-between items-center text-[15px]">
                <span className="text-gray-600">총 배송 금액</span>
                <span className="text-gray-900">{localeFormat(totalShippingPrice)}원</span>
              </div>
              <div className="h-px bg-gray-200 my-2" />
              <div className="flex justify-between items-center text-[18px] font-bold">
                <span className="text-gray-900">총 주문 예상 금액</span>
                <span className="text-gray-900">
                  {localeFormat(totalProductPrice + totalShippingPrice)}원
                </span>
              </div>
            </div>

            {/* 구매하기 버튼 */}
            <button
              disabled={isNoSelect}
              className="w-full mt-6 bg-gray-900 text-white hover:bg-gray-800 rounded-md py-3.5 text-[16px] font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed disabled:hover:bg-gray-300 transition-colors"
              onClick={moveToOrderPage}
            >
              구매하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartWebView;
