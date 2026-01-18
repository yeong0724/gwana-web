import { CustomDropdown } from '@/components/common';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { useControllerContext, useStateContext } from '@/context/productDetailContext';
import { localeFormat } from '@/lib/utils';
import { clone, isEmpty, map } from 'lodash-es';
import { ChevronDown, Share2, X } from 'lucide-react';
import Image from 'next/image';
import { createPortal } from 'react-dom';

const ProductDetailMobileView = () => {
  const { product, current, isMounted, isBottomPanelOpen, purchaseList, totalPrice } =
    useStateContext();

  const {
    setApi,
    handleShare,
    setIsBottomPanelOpen,
    onOptionSelect,
    setPurchaseList,
    handleQuantityChange,
    onCartMobileHandler,
    onPurchaseMobileHandler,
  } = useControllerContext();

  return (
    <div className="lg:hidden">
      <div className="max-w-[1000px] mx-auto pb-2 px-6 pt-6">
        <div className="flex flex-col gap-12">
          {/* 이미지 캐러셀 */}
          <div className="flex-1">
            {product?.images && product.images.length > 0 ? (
              <div className="w-full group">
                <Carousel
                  className="w-full relative"
                  setApi={setApi}
                  opts={{
                    align: 'start',
                    loop: product.images.length > 1,
                  }}
                >
                  <CarouselContent>
                    {product.images.map((image, index) => (
                      <CarouselItem key={index}>
                        <div className="relative w-full aspect-square">
                          <Image
                            src={image}
                            alt={`${product.productName} ${index + 1}`}
                            fill
                            className="object-cover"
                            sizes="100vw"
                            priority
                          />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  {product.images.length > 1 && (
                    <>
                      <CarouselPrevious className="left-4 opacity-0 group-hover:opacity-100 disabled:opacity-0 transition-opacity" />
                      <CarouselNext className="right-4 opacity-0 group-hover:opacity-100 disabled:opacity-0 transition-opacity" />
                    </>
                  )}
                  {/* 페이지 인디케이터 - 캐러셀 안쪽 하단 */}
                  {product.images.length > 1 && (
                    <div className="absolute bottom-4 left-4 right-4 flex justify-center">
                      <div className="w-3/4 relative h-[3px] bg-black/30 overflow-hidden">
                        <div
                          className="absolute left-0 h-full bg-black transition-all duration-300 ease-out"
                          style={{
                            width: `${((current + 1) / product.images.length) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}
                </Carousel>
              </div>
            ) : (
              <div className="w-full aspect-square bg-gray-200 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
              </div>
            )}
          </div>

          {/* 상품 정보 */}
          <div className="flex-1 flex flex-col">
            {/* 브레드크럼과 공유 아이콘 */}
            <div className="flex items-center justify-between text-[18px] font-medium text-gray-900 mb-[20px]">
              <div>
                <span>티 제품</span>
                <span className="mx-2">{'>'}</span>
                <span>{product.categoryName}</span>
              </div>
              <button
                onClick={handleShare}
                className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                aria-label="공유하기"
              >
                <Share2 size={18} className="text-gray-400" />
              </button>
            </div>

            {/* 상품명 */}
            <h1 className="text-[20px] font-sans mb-[10px]">{product.productName}</h1>

            {/* 가격 */}
            <div className="text-[15px] text-gray-600 font-normal mb-6">{localeFormat(product.price)}원</div>

            {/* 배송비 정보 */}
            <div className="mb-6 pb-6">
              <div className="text-[14px] text-gray-700">
                <span>배송비</span>
                <span className="ml-2">
                  <span className="text-gray-700">
                    {product.shippingPrice ? (
                      `${localeFormat(product.shippingPrice)}원`
                    ) : (
                      <span className="font-medium">무료배송</span>
                    )}
                  </span>
                </span>
              </div>
              <p className="text-[12px] text-gray-400 mt-2">
                50,000원 이상 구매 시 무료 / 제주도 지역은 배송비 4,000원이 추가되어 부과됩니다.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 상세정보 섹션 - 모바일뷰 */}
      <div className="max-w-[800px] pt-10 mb-[200px] px-5">
        {/* 상세정보 타이틀 */}
        <div className="relative flex items-center justify-center mb-15">
          {/* 양쪽 라인 */}
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-400" />
          </div>

          {/* 타이틀 영역 */}
          <div className="relative bg-white px-8">
            <div className="flex flex-col items-center">
              <span className="text-[10px] tracking-[0.3em] text-gray-400 mb-1">PRODUCT</span>
              <h2 className="text-2xl font-light tracking-[0.2em] text-gray-900">DETAIL</h2>
              <div className="mt-3 w-8 h-[2px] bg-teal-600" />
            </div>
          </div>
        </div>

        {/* 상세 이미지 영역 */}
        <div className="w-full space-y-0">
          {product.infos.map((image, index) => (
            <div key={index} className="relative w-full">
              <Image
                src={image}
                alt={image}
                width={1000}
                height={0}
                className="w-full h-auto"
                sizes="(max-width: 1000px) 100vw, 1000px"
              />
            </div>
          ))}
        </div>
      </div>

      {/* 모바일 하단 고정 버튼 영역 - Portal로 body에 직접 렌더링 */}
      {isMounted &&
        createPortal(
          <div className="fixed bottom-0 left-0 right-0 z-70 lg:hidden">
            {/* 메인 패널 */}
            <div
              className={`bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.08)] transition-all duration-300 ease-in-out ${isBottomPanelOpen ? 'rounded-t-2xl' : ''}`}
            >
              {/* 확장 패널: 구매수량 + 상품금액 합계 (옵션 없는 경우) */}
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${isBottomPanelOpen ? 'max-h-[500px]' : 'max-h-0'
                  }`}
              >
                {/* 닫기 버튼 */}
                <button
                  onClick={() => setIsBottomPanelOpen(false)}
                  className="w-full flex items-center justify-center py-2"
                >
                  <ChevronDown size={24} className="text-gray-400" />
                </button>
                <div className="px-4 pb-4 space-y-4 bg-white">
                  {/* 옵션 선택 - 커스텀 드롭다운 */}
                  {!isEmpty(product.options) && (
                    <CustomDropdown options={product.options} onOptionSelect={onOptionSelect} />
                  )}
                  {/* 선택된 옵션 목록 */}
                  {!isEmpty(purchaseList) && (
                    <div className="space-y-3">
                      {map(
                        purchaseList,
                        ({ productName, optionId, optionName, quantity, price }, index) => (
                          <div
                            key={index}
                            className="border border-gray-200 rounded-md p-4 space-y-3"
                          >
                            <div className="flex items-start justify-between">
                              {optionId ? (
                                <>
                                  <span className="text-sm font-medium text-gray-800">
                                    {optionName}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const updatedCart = clone(purchaseList);
                                      updatedCart.splice(index, 1);
                                      setPurchaseList(updatedCart);
                                    }}
                                    className="text-gray-400 hover:text-gray-600"
                                  >
                                    <X size={20} strokeWidth={1.5} />
                                  </button>
                                </>
                              ) : (
                                <span className="text-sm font-medium text-gray-800">
                                  {productName}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center border border-gray-300 rounded">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleQuantityChange(index, quantity - 1)}
                                  disabled={quantity <= 1}
                                  className="h-9 w-9 rounded-none border-r cursor-pointer text-base"
                                >
                                  -
                                </Button>
                                <div className="w-12 text-center h-9 text-sm flex items-center justify-center select-none">
                                  {quantity}
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleQuantityChange(index, quantity + 1)}
                                  className="h-9 w-9 rounded-none border-l cursor-pointer text-base"
                                >
                                  +
                                </Button>
                              </div>
                              <span className="text-base font-semibold">
                                {localeFormat(price * quantity)}원
                              </span>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  )}

                  {/* 상품금액 합계 */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <span className="text-sm font-medium text-gray-700">상품 금액 합계</span>
                    <span className="text-xl font-bold">{localeFormat(totalPrice)}원</span>
                  </div>
                </div>
              </div>
              {/* 버튼 */}
              <div className="flex">
                <Button
                  onClick={onCartMobileHandler}
                  className="flex-[0_0_35%] h-14 text-base bg-black text-white hover:bg-gray-800 rounded-none cursor-pointer"
                >
                  장바구니
                </Button>
                <Button
                  onClick={onPurchaseMobileHandler}
                  className="flex-[0_0_65%] h-14 text-base bg-teal-600 text-white hover:bg-teal-700 rounded-none cursor-pointer"
                >
                  구매하기
                </Button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

export default ProductDetailMobileView;
