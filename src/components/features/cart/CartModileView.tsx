import React from 'react';
import Image from 'next/image';

import { filter, first, isEmpty, map, size, some } from 'lodash-es';
import { Minus, Plus, ShoppingCart, X } from 'lucide-react';

import { Checkbox } from '@/components/ui/checkbox';
import { useControllerContext, useStateContext } from '@/context/cartContext';
import { localeFormat } from '@/lib/utils';

const CartModileView = () => {
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
    <div className="flex flex-col w-full mx-auto flex-1 border-x border-gray-100 overflow-hidden">
      {/* 전체선택 헤더 */}
      <div className="flex items-center justify-between p-3 bg-white border-b border-gray-200 flex-shrink-0">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <Checkbox
            checked={cart.length > 0 && !some(cart, { checked: false })}
            onCheckedChange={(checked: boolean) => onAllCheckboxHandler(checked)}
            disabled={cart.length === 0}
          />
          <span className="text-[14px] font-medium text-gray-900">
            전체선택 ({size(filter(cart, { checked: true }))} / {size(cart)})
          </span>
        </label>
        <button
          disabled={isNoSelect}
          className="text-[13px] text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-2 py-1 rounded-md transition-colors disabled:text-gray-300 disabled:hover:bg-transparent disabled:cursor-not-allowed"
          onClick={onDeleteCartList}
        >
          상품삭제
        </button>
      </div>

      {/* 상품 리스트 + 결제 예상 금액 */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 bg-white">
            <ShoppingCart size={64} className="text-gray-300" strokeWidth={1.5} />
            <span className="text-gray-500 text-[14px]">장바구니가 비어있습니다</span>
          </div>
        ) : (
          <div className="flex flex-col min-h-full">
            {/* 장바구니 아이템 리스트 */}
            <div className="flex flex-col bg-white">
              {map(cart, (item, index) => (
                <React.Fragment key={`${item.cartId}-${index}`}>
                  <div key={`${item.cartId}-${index}`} className="bg-white px-2">
                    {/* 상단 영역: 체크박스 + 상품 정보 */}
                    <div className="flex gap-2 px-1 pt-[24px]">
                      {/* 체크박스 */}
                      <div className="flex items-start justify-center pt-1 px-2">
                        <Checkbox
                          checked={item.checked}
                          onCheckedChange={(checked: boolean) => onCheckboxHandler(checked, index)}
                        />
                      </div>

                      {/* 나머지 콘텐츠 */}
                      <div className="flex-1 flex flex-col gap-2">
                        {/* 상단 영역: 이미지 + 상품정보 */}
                        <div className="flex gap-2">
                          {/* 상품 이미지 */}
                          <div className="relative w-14 h-14 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
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
                            <p className="text-[13px] font-semibold text-gray-900">
                              {item.categoryName}
                            </p>
                            <p className="text-[11px] text-gray-700 mt-1 line-clamp-2">
                              {item.productName}
                            </p>
                          </div>
                        </div>

                        {/* 메인 상품 영역 - optionRequired가 false일 때만 표시 */}
                        {!item.optionRequired && (
                          <div className="flex flex-col gap-2 mt-3 py-2">
                            <div className="flex items-baseline gap-1">
                              <span className="text-[11px] text-teal-600 font-medium">
                                메인 상품
                              </span>
                              <span className="text-[11px] text-gray-400">|</span>
                              <span className="text-[12px] text-gray-700">{item.productName}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              {/* 수량 조절 */}
                              <div className="flex items-center border border-gray-300 rounded overflow-hidden">
                                <button
                                  className="w-7 h-6 hover:bg-gray-50 border-r border-gray-300 flex items-center justify-center disabled:opacity-50"
                                  disabled={item.quantity <= 1}
                                  onClick={() =>
                                    onUpdateCartQuantity(
                                      item.productId,
                                      '',
                                      item.quantity,
                                      index,
                                      item.optionRequired,
                                      -1
                                    )
                                  }
                                >
                                  <Minus size={12} className="text-gray-600" />
                                </button>
                                <span className="w-8 h-6 text-[12px] text-gray-900 flex items-center justify-center">
                                  {item.quantity}
                                </span>
                                <button className="w-7 h-6 hover:bg-gray-50 border-l border-gray-300 flex items-center justify-center">
                                  <Plus
                                    size={12}
                                    className="text-gray-600"
                                    onClick={() =>
                                      onUpdateCartQuantity(
                                        item.productId,
                                        '',
                                        item.quantity,
                                        index,
                                        item.optionRequired,
                                        1
                                      )
                                    }
                                  />
                                </button>
                              </div>
                              <div className="flex items-center gap-2">
                                {/* 금액 */}
                                <span className="text-[13px] font-semibold text-gray-900">
                                  {localeFormat(item.price)}원
                                </span>
                                {/* 삭제 버튼 */}
                                <button
                                  className="p-1 hover:bg-gray-100 rounded active:scale-90 transition-transform"
                                  onClick={() => onDeleteCart(item.cartId, '', index)}
                                >
                                  <X size={14} className="text-gray-400" />
                                </button>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* 옵션 상품 영역 */}
                        {item.options && item.options.length > 0 && (
                          <div className="flex flex-col">
                            {map(
                              item.options,
                              (
                                { cartId, optionId, optionName, optionPrice, quantity },
                                optionIndex
                              ) => (
                                <div
                                  key={`${item.cartId}-option-${optionIndex}`}
                                  className="flex flex-col gap-2 py-2"
                                >
                                  <div className="flex items-baseline gap-1">
                                    <span className="text-[11px] text-teal-600 font-medium">
                                      옵션
                                    </span>
                                    <span className="text-[11px] text-gray-400">|</span>
                                    <span className="text-[12px] text-gray-700">{optionName}</span>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    {/* 수량 조절 */}
                                    <div className="flex items-center border border-gray-300 rounded overflow-hidden">
                                      <button
                                        className="w-7 h-6 hover:bg-gray-50 border-r border-gray-300 flex items-center justify-center disabled:opacity-50"
                                        disabled={quantity <= 1}
                                        onClick={() =>
                                          onUpdateCartQuantity(
                                            item.productId,
                                            optionId,
                                            quantity,
                                            index,
                                            item.optionRequired,
                                            -1
                                          )
                                        }
                                      >
                                        <Minus size={12} className="text-gray-600" />
                                      </button>
                                      <span className="w-8 h-6 text-[12px] text-gray-900 flex items-center justify-center">
                                        {quantity}
                                      </span>
                                      <button className="w-7 h-6 hover:bg-gray-50 border-l border-gray-300 flex items-center justify-center">
                                        <Plus
                                          size={12}
                                          className="text-gray-600"
                                          onClick={() =>
                                            onUpdateCartQuantity(
                                              item.productId,
                                              optionId,
                                              quantity,
                                              index,
                                              item.optionRequired,
                                              1
                                            )
                                          }
                                        />
                                      </button>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      {/* 금액 */}
                                      <span className="text-[13px] font-semibold text-gray-900">
                                        {localeFormat(optionPrice)}원
                                      </span>
                                      {/* 삭제 버튼 */}
                                      <button
                                        className="p-1 hover:bg-gray-100 rounded active:scale-90 transition-transform"
                                        onClick={() => onDeleteCart(cartId, optionId, index)}
                                      >
                                        <X size={14} className="text-gray-400" />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 하단 가격 산정 영역 */}
                    <div className="text-center text-[11px] text-gray-600 pt-3 pb-5 bg-white">
                      {/* 구분선 */}

                      {`상품 ${localeFormat(getSumProductPrice(item))}원 + 배송비 ${localeFormat(getShippingPrice(item))}원 = `}
                      <span className="font-semibold text-gray-900">
                        {localeFormat(getSumProductPrice(item) + getShippingPrice(item))}원
                      </span>
                    </div>
                  </div>
                  {cart.length - 1 !== index && <div className="h-px bg-gray-300 scale-y-50" />}
                </React.Fragment>
              ))}
              <div className="h-px bg-gray-300 scale-y-50" />
            </div>

            {/* 남은 공간 채우기 - 상품 적을 때 결제 예상 금액을 하단으로 밀어냄 */}
            <div className="flex-1 bg-white" />

            {/* 결제 예상 금액 - 스크롤 영역 내 */}
            <div className="bg-white px-3 pt-4 pb-3 border-t border-gray-200">
              <h3 className="text-[15px] font-bold text-gray-900 mb-3">결제 예상 금액</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-[13px]">
                  <span className="text-gray-700">상품금액</span>
                  <span className="text-gray-900">{localeFormat(totalProductPrice)}원</span>
                </div>
                <div className="flex justify-between items-center text-[13px]">
                  <span className="text-gray-700">배송비</span>
                  <span className="text-gray-900">{localeFormat(totalShippingPrice)}원</span>
                </div>
                <div className="h-px bg-gray-200 my-3" />
                <div className="flex justify-between items-center text-[15px] font-bold">
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
      <div className="flex-shrink-0 bg-white p-4 z-10 border-t border-gray-200">
        <button
          disabled={isNoSelect}
          className="w-full bg-gray-900 text-white hover:bg-gray-800 rounded-full py-3 flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:hover:bg-gray-300"
          onClick={moveToOrderPage}
        >
          <span className="text-[15px] font-semibold">
            {isNoSelect
              ? '상품을 선택해주세요'
              : `${localeFormat(totalProductPrice + totalShippingPrice)}원 구매하기`}
          </span>
        </button>
      </div>
    </div>
  );
};

export default CartModileView;
