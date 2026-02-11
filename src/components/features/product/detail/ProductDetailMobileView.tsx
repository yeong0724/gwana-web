import { Fragment, useEffect, useRef, useState } from 'react';
import Image from 'next/image';

import gsap from 'gsap';
import { clone, isEmpty, map } from 'lodash-es';
import { ChevronDown, ChevronUp, Share2, Star, X } from 'lucide-react';
import { createPortal } from 'react-dom';

import { OptionDropdown } from '@/components/common/form';
import ImageSlideModal from '@/components/common/modal/ImageSlideModal';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { AWS_S3_DOMAIN } from '@/constants';
import { useControllerContext, useStateContext } from '@/context/productDetailContext';
import useImageSlide from '@/hooks/useImageSlide';
import { formatDate, localeFormat } from '@/lib/utils';
import { Review, RoleEnum } from '@/types';

type TabType = 'detail' | 'review' | 'qna';

const ProductDetailMobileView = () => {
  const {
    product,
    optionList,
    current,
    isMounted,
    isBottomPanelOpen,
    purchaseList,
    totalPrice,
    reviewList,
    totalReviewCount,
    role,
  } = useStateContext();

  const {
    setApi,
    handleShare,
    setIsBottomPanelOpen,
    onOptionSelect,
    setPurchaseList,
    handleQuantityChange,
    onCartMobileHandler,
    onPurchaseMobileHandler,
    handleReviewOpen,
  } = useControllerContext();

  const [isDetailExpanded, setIsDetailExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('detail');

  // Review Images Slide Modal Hook
  const {
    imageSlideOpen,
    setImageSlideOpen,
    selectedImages,
    selectedImageIndex,
    handleImageModalOpen,
  } = useImageSlide();

  // 섹션 refs
  const detailSectionRef = useRef<HTMLDivElement>(null);
  const reviewSectionRef = useRef<HTMLDivElement>(null);
  const qnaSectionRef = useRef<HTMLDivElement>(null);

  // 탭 클릭으로 인한 스크롤인지 여부
  const isTabClickScrolling = useRef(false);

  // 탭 클릭 핸들러
  const handleTabClick = (tab: TabType) => {
    setActiveTab(tab);
    isTabClickScrolling.current = true;

    const refMap = {
      detail: detailSectionRef,
      review: reviewSectionRef,
      qna: qnaSectionRef,
    };

    const targetRef = refMap[tab];
    if (targetRef.current) {
      const headerOffset = 100; // Header(48px) + 탭(52px) 높이 고려
      const targetY =
        targetRef.current.getBoundingClientRect().top + window.pageYOffset - headerOffset;

      // GSAP으로 부드러운 스크롤 애니메이션
      gsap.to(window, {
        scrollTo: { y: targetY, autoKill: false },
        duration: 0.6,
        ease: 'power2.out',
        onComplete: () => {
          // 스크롤 애니메이션 완료 후 플래그 해제
          isTabClickScrolling.current = false;
        },
      });
    }
  };

  // ScrollToPlugin 등록
  useEffect(() => {
    import('gsap/ScrollToPlugin').then(({ ScrollToPlugin }) => {
      gsap.registerPlugin(ScrollToPlugin);
    });
  }, []);

  // 스크롤 위치 기반 탭 자동 변경
  useEffect(() => {
    let ticking = false;

    const updateActiveTab = () => {
      if (isTabClickScrolling.current) {
        ticking = false;
        return;
      }

      // 기준점: 뷰포트 상단에서 20% 아래 (= 바닥에서 80% 위치)
      const threshold = window.innerHeight * 0.2;

      const sections = [
        { ref: detailSectionRef, tab: 'detail' as TabType },
        { ref: reviewSectionRef, tab: 'review' as TabType },
        { ref: qnaSectionRef, tab: 'qna' as TabType },
      ];

      // 역순으로 확인 (아래 섹션부터) - 기준점을 통과한 가장 아래 섹션 찾기
      for (let i = sections.length - 1; i >= 0; i--) {
        const { ref, tab } = sections[i];
        if (ref.current) {
          const rect = ref.current.getBoundingClientRect();
          // 섹션 상단이 기준점보다 위에 있으면 (= 기준점을 통과함)
          if (rect.top <= threshold) {
            setActiveTab(tab);
            break;
          }
        }
      }

      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateActiveTab);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <>
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
                      <div className="w-3/4 relative h-[4px] border border-gray-600 overflow-hidden bg-gray-400">
                        <div
                          className="absolute left-0 h-full bg-white transition-all duration-300 ease-out"
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
            <h1 className="text-[20px] font-sans mb-[10px] break-keep">{product.productName}</h1>

            {/* 가격 */}
            <div className="text-[15px] text-gray-600 font-normal mb-6">
              {localeFormat(product.price)}원
            </div>

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

      {/* 탭 네비게이션 */}
      <div className="sticky top-[48px] z-10 bg-white">
        <div className="flex items-center justify-center">
          <button
            onClick={() => handleTabClick('detail')}
            className={`flex-1 py-4 text-center text-[15px] font-medium transition-colors ${
              activeTab === 'detail' ? 'text-black' : 'text-gray-400'
            }`}
          >
            상세 설명
          </button>
          <button
            onClick={() => handleTabClick('review')}
            className={`flex-1 py-4 text-center text-[15px] font-medium transition-colors ${
              activeTab === 'review' ? 'text-black' : 'text-gray-400'
            }`}
          >
            후기 ({totalReviewCount})
          </button>
          <button
            onClick={() => handleTabClick('qna')}
            className={`flex-1 py-4 text-center text-[15px] font-medium transition-colors ${
              activeTab === 'qna' ? 'text-black' : 'text-gray-400'
            }`}
          >
            Q&A
          </button>
        </div>
        {/* 탭 밑줄 인디케이터 */}
        <div className="relative h-[2px] bg-gray-200">
          <div
            className="absolute h-full bg-black transition-all duration-300"
            style={{
              width: '33.333%',
              left: activeTab === 'detail' ? '0%' : activeTab === 'review' ? '33.333%' : '66.666%',
            }}
          />
        </div>
      </div>

      {/* 상세정보 섹션 - 모바일뷰 */}
      <div ref={detailSectionRef} className="max-w-[800px] pt-18 pb-16 px-5">
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
        <div className="relative">
          <div
            className={`w-full space-y-0 overflow-hidden transition-all duration-500 ease-in-out ${
              isDetailExpanded ? 'max-h-none' : 'max-h-[600px]'
            }`}
          >
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

          {/* 페이드아웃 그라데이션 오버레이 (접힌 상태일 때만) */}
          {!isDetailExpanded && (
            <div className="absolute bottom-0 left-0 right-0 h-[250px] bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" />
          )}

          {/* 펼치기/접기 버튼 */}
          <div
            className={`flex justify-center ${
              isDetailExpanded ? 'mt-8' : 'absolute bottom-4 left-0 right-0'
            }`}
          >
            <button
              onClick={() => {
                setIsDetailExpanded(!isDetailExpanded);
                if (isDetailExpanded) {
                  handleTabClick('detail');
                }
              }}
              className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 rounded-full shadow-sm hover:bg-gray-50 transition-colors"
            >
              <span className="text-sm font-medium text-gray-700">
                {isDetailExpanded ? '상세 정보 접기' : '상세 정보 더보기'}
              </span>
              {isDetailExpanded ? (
                <ChevronUp size={18} className="text-gray-500" />
              ) : (
                <ChevronDown size={18} className="text-gray-500" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 섹션 구분라인 */}
      <div className="h-2 bg-gray-100" />

      {/* 리뷰 섹션 */}
      <div ref={reviewSectionRef} className="max-w-[800px] py-6 px-5">
        {/* 리뷰 타이틀 */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[18px] font-medium text-gray-800">후기</h3>
        </div>

        <div className="border-t border-gray-200" />

        {/* 리뷰 목록 */}
        {!isEmpty(reviewList) ? (
          <>
            {map(reviewList, (review: Review, index: number) => {
              return (
                <Fragment key={review.reviewId}>
                  <div key={review.reviewId} className="py-4">
                    {/* 별점 및 작성일 */}
                    <div className="flex items-center justify-between pb-4">
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => {
                          const isFull = review.rating >= star;
                          const isHalf = review.rating >= star - 0.5 && review.rating < star;

                          return (
                            <div key={star} className="relative w-4 h-4">
                              <Star className="absolute inset-0 w-4 h-4 fill-gray-200 text-gray-200" />
                              {isHalf && (
                                <div
                                  className="absolute inset-0 overflow-hidden"
                                  style={{ width: '50%' }}
                                >
                                  <Star className="w-4 h-4 fill-[#F9BC36] text-[#F9BC36]" />
                                </div>
                              )}
                              {isFull && (
                                <Star className="absolute inset-0 w-4 h-4 fill-[#F9BC36] text-[#F9BC36]" />
                              )}
                            </div>
                          );
                        })}
                      </div>
                      <div className="flex items-center">
                        <span className="text-[13px] text-gray-500">{review.email}</span>
                        <span className="text-[12px] text-gray-400 mx-[4px]">|</span>
                        <span className="text-[12px] text-gray-400">
                          {formatDate(review?.createdAt, 'yyyy.MM.dd')}
                        </span>
                      </div>
                    </div>

                    {/* 리뷰 내용 */}
                    <p className="text-sm text-gray-700 mb-8 whitespace-pre-wrap">
                      {review.content}
                    </p>

                    {/* 리뷰 이미지 */}
                    {review.reviewImages && review.reviewImages.length > 0 && (
                      <div className="flex gap-3 overflow-x-auto">
                        {review.reviewImages.map((image, idx) => (
                          <div
                            key={idx}
                            className="relative w-30 h-30 flex-shrink-0 cursor-pointer border border-gray-200 rounded-xs"
                            onClick={() => handleImageModalOpen(review.reviewImages!, idx)}
                          >
                            <Image
                              src={`${AWS_S3_DOMAIN}${image}`}
                              alt={`리뷰 이미지 ${idx + 1}`}
                              fill
                              className="object-cover"
                              sizes="80px"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {index !== reviewList.length - 1 && <div className="border-t border-gray-200" />}
                </Fragment>
              );
            })}

            {/* 리뷰 더보기 버튼 */}
            {totalReviewCount > 0 && (
              <div className="flex justify-center pt-10 pb-2">
                <button
                  className="px-6 py-2 text-sm font-medium text-[#A8BF6A] border border-[#A8BF6A] rounded-md hover:bg-[#A8BF6A]/5 transition-colors"
                  onClick={handleReviewOpen}
                >
                  리뷰 더보기
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="py-12 text-center min-h-[250px] flex items-center justify-center">
            <p className="text-gray-400">작성된 후기가 없습니다.</p>
          </div>
        )}
      </div>

      {/* 섹션 구분라인 */}
      <div className="h-2 bg-gray-100" />

      {/* Q&A 섹션 */}
      <div ref={qnaSectionRef} className="max-w-[800px] pt-6 px-5 mb-[100px]">
        {/* 질문 타이틀 */}
        <h3 className="text-[18px] font-medium text-gray-800 mb-4">질문</h3>

        <div className="border-t border-gray-200" />

        {/* Q&A 목록 - 현재는 빈 상태 UI만 */}
        <div className="py-12 text-center min-h-[250px] flex items-center justify-center">
          <p className="text-gray-400">작성된 질문이 없습니다.</p>
        </div>

        <div className="border-t border-gray-200" />

        {/* 질문 쓰기 버튼 */}
        {role !== RoleEnum.ADMIN && (
          <div className="flex justify-end py-4">
            <button className="px-6 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-md hover:bg-[#96ad5c] transition-colors">
              질문 쓰기
            </button>
          </div>
        )}
      </div>

      {/* 모바일 하단 고정 버튼 영역 - Portal로 body에 직접 렌더링 */}
      {isMounted &&
        createPortal(
          <div
            className="fixed bottom-0 left-0 right-0 z-70 lg:hidden"
            style={{ viewTransitionName: 'none' }}
          >
            {/* 메인 패널 */}
            <div
              className={`bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.08)] transition-all duration-300 ease-in-out ${isBottomPanelOpen ? 'rounded-t-2xl' : ''}`}
            >
              {/* 확장 패널: 구매수량 + 상품금액 합계 (옵션 없는 경우) */}
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  isBottomPanelOpen ? 'max-h-[500px]' : 'max-h-0'
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
                    <OptionDropdown options={optionList} onOptionSelect={onOptionSelect} />
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

      {/* 이미지 슬라이드 모달 */}
      <ImageSlideModal
        modalOpen={imageSlideOpen}
        setModalOpen={setImageSlideOpen}
        images={selectedImages}
        initialIndex={selectedImageIndex}
        showArrows={false}
      />
    </>
  );
};

export default ProductDetailMobileView;
