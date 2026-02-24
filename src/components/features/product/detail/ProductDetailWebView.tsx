import { useEffect, useState } from 'react';
import Image from 'next/image';

import { clone, isEmpty, map } from 'lodash-es';
import { Share2, X } from 'lucide-react';

import { OptionDropdown } from '@/components/common/form';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import type { CarouselApi } from '@/components/ui/carousel';
import { useControllerContext, useStateContext } from '@/context/productDetailContext';
import { localeFormat } from '@/lib/utils';

const ProductDetailWebView = () => {
  const { product, optionList, purchaseList, totalPrice } = useStateContext();
  const {
    handleShare,
    onOptionSelect,
    setPurchaseList,
    handleQuantityChange,
    handleAddToCart,
    handlePurchase,
  } = useControllerContext();

  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!carouselApi) return;
    setCurrent(carouselApi.selectedScrollSnap());
    const onSelect = () => setCurrent(carouselApi.selectedScrollSnap());
    carouselApi.on('select', onSelect);
    return () => {
      carouselApi.off('select', onSelect);
    };
  }, [carouselApi]);

  return (
    <>
      <div className="max-w-[1000px] mx-auto py-10">
        <div className="flex flex-row gap-20">
          {/* 좌측: 이미지 캐러셀 */}
          <div className="flex-[0_0_50%]">
            {product?.images && product.images.length > 0 ? (
              <div className="w-full group">
                <Carousel
                  className="w-full relative"
                  setApi={setCarouselApi}
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
                            sizes="50vw"
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

          {/* 우측: 상품 정보 */}
          <div className="flex-[0_0_50%] px-5 flex flex-col">
            {/* 브레드크럼과 공유 아이콘 */}
            <div className="flex items-center justify-between text-[18px] font-medium text-gray-400 mb-[24px]">
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
            <h1 className="text-[24px] font-bold mb-[15px]">{product.productName}</h1>

            {/* 가격 */}
            <div className="text-[22px] mb-6">{localeFormat(product.price)}원</div>

            {/* 배송비 정보 */}
            <div className="mb-6 pb-6">
              <div className="text-[14px] text-gray-400">
                <span>배송비</span>
                <span className="ml-2">
                  <span className="text-gray-900">
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

            {/* 옵션 선택 - 커스텀 드롭다운 */}
            {!isEmpty(product.options) && (
              <div className="mb-4">
                <OptionDropdown options={optionList} onOptionSelect={onOptionSelect} />
              </div>
            )}

            {/* 선택된 옵션 목록 */}
            {!isEmpty(purchaseList) && (
              <div className="space-y-3 mb-6">
                {map(
                  purchaseList,
                  ({ productName, optionId, optionName, quantity, price }, index) => (
                    <div key={index} className="border border-gray-200 bg-gray-50 p-4 space-y-3">
                      {/* 이름 + X버튼 */}
                      <div className="flex items-start justify-between">
                        <span className="text-sm font-medium text-gray-800">
                          {optionId ? optionName : productName}
                        </span>
                        {optionId && (
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
                        )}
                      </div>
                      {/* 수량 + 가격 */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleQuantityChange(index, quantity - 1)}
                            disabled={quantity <= 1}
                            className="h-8 w-8 rounded-none border-r-0 cursor-pointer text-lg bg-white"
                          >
                            -
                          </Button>
                          <div className="w-12 text-center h-8 rounded-none border-x border-y border-gray-300 text-[14px] bg-white flex items-center justify-center select-none">
                            {quantity}
                          </div>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleQuantityChange(index, quantity + 1)}
                            className="h-8 w-8 rounded-none border-l-0 cursor-pointer text-lg bg-white"
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
            <div className="flex items-center justify-between py-4 mb-6">
              <span className="text-base font-medium text-gray-700">상품금액 합계</span>
              <span className="text-2xl font-bold">{localeFormat(totalPrice)}원</span>
            </div>

            {/* 버튼 영역 */}
            <div className="flex">
              <Button
                onClick={handleAddToCart}
                className="flex-[0_0_35%] h-12 text-base bg-black text-white hover:bg-gray-800 rounded-none rounded-l-none cursor-pointer"
              >
                장바구니
              </Button>
              <Button
                onClick={handlePurchase}
                className="flex-[0_0_65%] h-12 text-base bg-teal-600 text-white hover:bg-teal-700 rounded-none rounded-r-none cursor-pointer"
              >
                구매하기
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 상세정보 섹션 - 웹뷰 */}
      <div className="max-w-[800px] py-16 mx-auto px-20 mb-[200px]">
        {/* 상세정보 타이틀 */}
        <div className="relative flex items-center justify-center mb-12">
          {/* 양쪽 라인 */}
          <div className="absolute inset-0 flex items-center px-8">
            <div className="w-full border-t border-gray-400" />
          </div>

          {/* 타이틀 영역 */}
          <div className="relative bg-white px-8">
            <div className="flex flex-col items-center">
              <span className="text-[10px] tracking-[0.3em] text-gray-400 mb-1">PRODUCT</span>
              <h2 className="text-3xl font-light tracking-[0.2em] text-gray-900">DETAIL</h2>
              <div className="mt-3 w-8 h-[2px] bg-teal-600" />
            </div>
          </div>
        </div>

        {/* 상세 이미지 영역 */}
        <div className="w-full space-y-0 md:px-12">
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
    </>
  );
};

export default ProductDetailWebView;
