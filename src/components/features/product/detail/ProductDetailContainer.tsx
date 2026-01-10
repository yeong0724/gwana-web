'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';

import { useQueryClient } from '@tanstack/react-query';
import { clone, findIndex } from 'lodash-es';
import { ChevronDown, Share2 } from 'lucide-react';
import { createPortal } from 'react-dom';
import { toast } from 'sonner';

import { PurchaseGuideModal } from '@/components/common/modal';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';
import { getIsMobile, localeFormat } from '@/lib/utils';
import { useCartService } from '@/service';
import { useCartStore, useLoginStore } from '@/stores';
import { Cart, Product } from '@/types';

type Props = {
  product: Product;
  productId: string;
};

const ProductDetailContainer = ({ product, productId }: Props) => {
  const queryClient = useQueryClient();
  const pathname = usePathname();
  const router = useRouter();
  const { isLogin } = useLoginStore();
  const isMobile = getIsMobile();
  const { setCart, addCart, cart } = useCartStore();
  const { useAddToCartMutation } = useCartService();

  const [quantity, setQuantity] = useState<number>(1);
  const [purchaseGuideModalOpen, setPurchaseGuideModalOpen] = useState<boolean>(false);

  // Carousel State
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  // 모바일 하단 패널 토글 상태
  const [isBottomPanelOpen, setIsBottomPanelOpen] = useState(false);

  // Portal을 위한 클라이언트 마운트 상태
  const [isMounted, setIsMounted] = useState(false);

  const { mutate: addToCartMutate } = useAddToCartMutation();

  const isFetching = false;

  // 클라이언트 마운트 감지 + 스크롤 최상단 이동
  useEffect(() => {
    setIsMounted(true);
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());
    api.on('select', () => setCurrent(api.selectedScrollSnap()));
  }, [api]);

  const totalPrice = useMemo(
    () => product.price * quantity + product.shippingPrice,
    [product.price, quantity, product.shippingPrice]
  );

  const moveToLoginPage = () => {
    router.push('/login');
  };

  const handlePurchase = () => {
    if (isLogin) {
      router.push('/payment');
    } else {
      setPurchaseGuideModalOpen(true);
    }
  };

  const handleShare = () => {
    const { Kakao, location } = window;
    Kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title: product.productName,
        description: '차를 마셔보세요 ~ !',
        imageUrl: `${process.env.NEXT_PUBLIC_APP_BASE_URL}${product.images[0]}`,
        link: {
          mobileWebUrl: location.href,
          webUrl: location.href,
        },
      },
      buttons: [
        {
          title: '관아수제차 방문하기',
          link: {
            mobileWebUrl: `${process.env.NEXT_PUBLIC_APP_BASE_URL}${pathname}`,
            webUrl: `${process.env.NEXT_PUBLIC_API_BASE_URL}${pathname}`,
          },
        },
      ],
    });
  };

  /**
   * 장바구니 상품 추가
   */
  const handleAddToCart = () => {
    const payload: Cart = {
      cartId: '',
      quantity,
      productId,
      productName: product.productName,
      categoryName: product.categoryName,
      price: product.price,
      shippingPrice: product?.shippingPrice ?? 0,
      images: product.images,
    };

    // 로그인 상태인 경우
    if (isLogin) {
      addToCartMutate(payload, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['cartList'], refetchType: 'all' });
          handleSuccessToast();
        },
        /* eslint-disable @typescript-eslint/no-unused-vars */
        onError: (error) => {
          toast.error('장바구니 추가 실패하였습니다.');
        },
      });
    }
    // 비로그인 상태인 경우
    else {
      const index = findIndex(cart, { productId });

      if (index < 0) {
        addCart(payload);
      } else {
        const updatedCart = clone(cart);
        updatedCart[index].quantity += quantity;
        setCart(updatedCart);
      }

      handleSuccessToast();
    }

    setIsBottomPanelOpen(false);
  };

  const onPurchaseMobileHandler = () => {
    if (isBottomPanelOpen) {
      handlePurchase();
      return;
    }

    setIsBottomPanelOpen(true);
  };

  const onCartMobileHandler = () => {
    if (!isBottomPanelOpen) {
      setIsBottomPanelOpen(true);
      return;
    }

    handleAddToCart();
  };

  const handleSuccessToast = () => {
    toast.success('상품이 장바구니에 추가되었습니다', {
      description: '장바구니 페이지에서 확인하세요',
    });
  };

  return (
    <>
      {/* 모바일에서 하단 버튼 영역 높이만큼 여백 추가 */}
      <div className="max-w-[1000px] mx-auto pb-2 lg:pb-10">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          {/* 좌측: 이미지 캐러셀 */}
          <div className="flex-1 lg:flex-[0_0_50%] lg:px-0">
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
                            sizes="(max-width: 768px) 100vw, 50vw"
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
          <div className="flex-1 lg:flex-[0_0_50%] px-5 flex flex-col">
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
            <h1 className="text-xl lg:text-[20px] font-bold mb-[30px]">{product.productName}</h1>

            {/* 가격 */}
            <div className="text-[30px] mb-6">{localeFormat(product.price)}원</div>

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
            </div>

            {/* 구매수량 - 데스크톱에서만 표시 (모바일은 하단 패널에서) */}
            <div className="hidden lg:flex items-center justify-between mb-6 bg-gray-100 p-5">
              <label className="text-sm font-medium text-gray-700">구매수량</label>
              <div className="flex items-center">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity((prev) => prev - 1)}
                  disabled={quantity <= 1}
                  className="h-11 w-11 rounded-none border-r-0 cursor-pointer text-lg bg-white"
                >
                  -
                </Button>
                <div className="w-24 text-center h-11 rounded-none border-x border-y border-gray-300 text-base bg-white flex items-center justify-center select-none">
                  {quantity}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity((prev) => prev + 1)}
                  className="h-11 w-11 rounded-none border-l-0 cursor-pointer text-lg"
                >
                  +
                </Button>
              </div>
            </div>

            {/* 상품금액 합계 - 데스크톱에서만 표시 */}
            <div className="hidden lg:flex items-center justify-between py-4 mb-6">
              <span className="text-base font-medium text-gray-700">상품금액 합계</span>
              <span className="text-2xl font-bold">{localeFormat(totalPrice)}원</span>
            </div>

            {/* 버튼 영역 - 데스크톱에서만 표시 */}
            <div className="hidden lg:flex">
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

      {/* 상세정보 섹션 */}
      {!isFetching && (
        <div className="max-w-[800px] pt-2 lg:py-16 lg:mx-auto lg:px-20 mb-[200px] px-4">
          {/* 상세정보 타이틀 */}
          <div className="relative flex items-center justify-center mb-8 lg:mb-12">
            {/* 양쪽 라인 */}
            <div className="absolute inset-0 flex items-center px-8">
              <div className="w-full border-t border-gray-400" />
            </div>

            {/* 타이틀 영역 */}
            <div className="relative bg-white px-8">
              <div className="flex flex-col items-center">
                <span className="text-[10px] tracking-[0.3em] text-gray-400 mb-1">PRODUCT</span>
                <h2 className="text-2xl md:text-3xl font-light tracking-[0.2em] text-gray-900">
                  DETAIL
                </h2>
                <div className="mt-3 w-8 h-[2px] bg-teal-600" />
              </div>
            </div>
          </div>

          {/* 상세 이미지 영역 */}
          <div className={`w-full space-y-0 ${isMobile ? '' : 'md:px-12'}`}>
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
      )}

      {/* 모바일 하단 고정 버튼 영역 - Portal로 body에 직접 렌더링 */}
      {!isFetching &&
        isMounted &&
        createPortal(
          <div className="fixed bottom-0 left-0 right-0 z-[100] lg:hidden">
            {/* 메인 패널 */}
            <div
              className={`bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.08)] ${isBottomPanelOpen ? 'rounded-t-2xl' : ''}`}
            >
              {/* 닫기 버튼 - 열린 상태에서만 표시 */}
              {isBottomPanelOpen && (
                <button
                  onClick={() => setIsBottomPanelOpen(false)}
                  className="w-full flex items-center justify-center"
                >
                  <ChevronDown size={24} className="text-gray-400" />
                </button>
              )}
              {/* 확장 패널: 구매수량 + 상품금액 합계 */}
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  isBottomPanelOpen ? 'max-h-60' : 'max-h-0'
                }`}
              >
                <div className="px-4 py-4 space-y-4 bg-white">
                  {/* 구매수량 */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">구매수량</span>
                    <div className="flex items-center">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setQuantity((prev) => prev - 1)}
                        disabled={quantity <= 1}
                        className="h-9 w-9 rounded-none border-r-0 cursor-pointer text-base bg-white"
                      >
                        -
                      </Button>
                      <div className="w-16 text-center h-9 rounded-none border border-gray-300 text-sm bg-white flex items-center justify-center select-none">
                        {quantity}
                      </div>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setQuantity((prev) => prev + 1)}
                        className="h-9 w-9 rounded-none border-l-0 cursor-pointer text-base"
                      >
                        +
                      </Button>
                    </div>
                  </div>

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
      <PurchaseGuideModal
        modalOpen={purchaseGuideModalOpen}
        setModalOpen={setPurchaseGuideModalOpen}
        moveToLoginPage={moveToLoginPage}
      />
    </>
  );
};

export default ProductDetailContainer;
