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
    <div className="flex w-full max-w-[1600px] mx-auto flex-1 min-h-0 overflow-y-auto px-16 pt-8 bg-white">
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
            {/* 테이블 헤더 */}
            <div className="grid grid-cols-[40px_1fr_120px_140px] gap-6 items-center py-3 border-b-[1.5px] border-gray-900">
              <div className="flex justify-center">
                <Checkbox
                  checked={cart.length > 0 && !some(cart, { checked: false })}
                  onCheckedChange={(checked: boolean) => onAllCheckboxHandler(checked)}
                  disabled={cart.length === 0}
                />
              </div>
              <span className="text-[15px] font-semibold text-gray-700">상품 정보</span>
              <span className="text-[15px] font-medium text-gray-700 text-center">총 가격</span>
              <span className="text-[15px] font-medium text-gray-700 text-center">배송비</span>
            </div>

            {/* 테이블 바디 */}
            <div className="flex flex-col divide-y divide-gray-300">
              {map(cart, (item, index) => (
                <div
                  key={`desktop-${item.cartId}-${index}`}
                  className="grid grid-cols-[40px_1fr_120px_140px] gap-6 items-center py-6"
                >
                  {/* 체크박스 */}
                  <div className="flex justify-center">
                    <Checkbox
                      checked={item.checked}
                      onCheckedChange={(checked: boolean) => onCheckboxHandler(checked, index)}
                    />
                  </div>

                  {/* 상품 정보 */}
                  <div className="flex gap-5 items-center">
                    {/* 이미지 */}
                    <div className="relative flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
                      {item.images && !isEmpty(item.images) ? (
                        <Image
                          src={first(item.images)!}
                          alt={item.productName}
                          width={100}
                          height={100}
                        />
                      ) : (
                        <div className="w-[100px] h-[100px] bg-gray-200" />
                      )}
                    </div>

                    {/* 상품명 + 옵션 영역 */}
                    <div className="flex flex-col gap-2 flex-1">
                      {/* 메인 상품 행 */}
                      <div className="flex items-center gap-4">
                        <p className="text-[15px] font-medium text-gray-900 flex-1">
                          {item.productName}
                        </p>
                        {/* 수량 UI */}
                        {!item.optionRequired && (
                          <>
                            <div className="flex items-center border border-gray-300 rounded overflow-hidden">
                              <button
                                className="w-6 h-6 hover:bg-gray-50 border-r border-gray-300 flex items-center justify-center disabled:opacity-50"
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
                                <Minus size={10} className="text-gray-600" />
                              </button>
                              <span className="w-8 h-6 text-[12px] text-gray-900 flex items-center justify-center">
                                {item.quantity}
                              </span>
                              <button
                                className="w-6 h-6 hover:bg-gray-50 border-l border-gray-300 flex items-center justify-center"
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
                              >
                                <Plus size={10} className="text-gray-600" />
                              </button>
                            </div>
                            {/* 가격 */}
                            <span className="text-[14px] text-gray-900 w-[80px] text-right">
                              {localeFormat(item.price)}원
                            </span>
                            {/* 삭제 X 아이콘 */}
                            <button
                              className="p-1 hover:bg-gray-100 rounded"
                              onClick={() => onDeleteCart(item.cartId, '', index)}
                            >
                              <X size={16} className="text-gray-400 hover:text-gray-600" />
                            </button>
                          </>
                        )}
                      </div>

                      {/* 옵션 행들 */}
                      {!isEmpty(item.options) &&
                        map(
                          item.options,
                          (
                            { cartId, optionId, optionName, optionPrice, quantity },
                            optionIndex
                          ) => (
                            <div
                              key={`${item.cartId}-option-${optionIndex}`}
                              className="flex items-center gap-4 pl-2"
                            >
                              <p className="text-[14px] text-gray-500 flex-1">
                                <span className="text-teal-600 mr-2">옵션</span>
                                {optionName}
                              </p>
                              {/* 수량 UI */}
                              <div className="flex items-center border border-gray-300 rounded overflow-hidden">
                                <button
                                  className="w-6 h-6 hover:bg-gray-50 border-r border-gray-300 flex items-center justify-center disabled:opacity-50"
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
                                  <Minus size={10} className="text-gray-600" />
                                </button>
                                <span className="w-8 h-6 text-[12px] text-gray-900 flex items-center justify-center">
                                  {quantity}
                                </span>
                                <button
                                  className="w-6 h-6 hover:bg-gray-50 border-l border-gray-300 flex items-center justify-center"
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
                                >
                                  <Plus size={10} className="text-gray-600" />
                                </button>
                              </div>
                              {/* 가격 */}
                              <span className="text-[14px] text-gray-900 w-[80px] text-right">
                                {localeFormat(optionPrice)}원
                              </span>
                              {/* 삭제 X 아이콘 */}
                              <button
                                className="p-1 hover:bg-gray-100 rounded"
                                onClick={() => onDeleteCart(cartId, optionId, index)}
                              >
                                <X size={16} className="text-gray-400 hover:text-gray-600" />
                              </button>
                            </div>
                          )
                        )}
                    </div>
                  </div>

                  {/* 총 가격 */}
                  <div className="text-center">
                    <span className="text-[15px] font-bold text-gray-900">
                      {localeFormat(getSumProductPrice(item))}원
                    </span>
                  </div>

                  {/* 배송비 */}
                  <div className="text-center">
                    {getShippingPrice(item) === 0 ? (
                      <span className="text-[14px] text-teal-600 font-medium">무료 배송</span>
                    ) : (
                      <span className="text-[14px] text-gray-500 font-medium">
                        {localeFormat(getShippingPrice(item))}원
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* 테이블 하단 구분선 */}
            <div className="border-t-[1.5px] border-gray-900 mt-2" />

            {/* 하단 영역: 삭제 버튼 + 무료배송 안내 */}
            <div className="flex justify-between items-center mt-5 mb-8">
              {/* 좌측: 삭제 버튼 */}
              <button
                disabled={isNoSelect}
                className="text-[15px] text-gray-500 hover:text-gray-900 disabled:text-gray-300 disabled:cursor-not-allowed"
                onClick={onDeleteCartList}
              >
                선택 상품 삭제
              </button>

              {/* 우측: 무료배송 안내 */}
              <p className="text-[14px] text-gray-600">※ 50,000원 이상 구매 시 무료배송</p>
            </div>
          </div>
        )}
      </div>

      {/* 우측: 결제 예정 금액 섹션 (sticky) */}
      <div className="w-[320px] flex-shrink-0 ml-20">
        <div className="sticky top-16">
          <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
            <h2 className="text-[18px] font-bold text-gray-900 mb-6">결제 예정 금액</h2>

            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center text-[15px]">
                <span className="text-gray-600">상품 합계</span>
                <span className="text-gray-900">{localeFormat(totalProductPrice)}원</span>
              </div>
              <div className="flex justify-between items-center text-[15px]">
                <span className="text-gray-600">배송비</span>
                <span className="text-gray-900">{localeFormat(totalShippingPrice)}원</span>
              </div>
              <div className="h-px bg-gray-200 my-2" />
              <div className="flex justify-between items-center text-[18px] font-bold">
                <span className="text-gray-900">합계</span>
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
