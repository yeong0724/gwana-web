import { Fragment, useEffect, useRef, useState } from 'react';
import Image from 'next/image';

import gsap from 'gsap';
import { clone, includes, isEmpty, map, size, without } from 'lodash-es';
import { ChevronDown, ChevronUp, Lock, Share2, Star, X } from 'lucide-react';
import { createPortal } from 'react-dom';

import { OptionDropdown } from '@/components/common/form';
import { ImageSlideModal } from '@/components/common/modal';
import ProductCarousel from '@/components/features/product/detail/ProductCarousel';
import { Button } from '@/components/ui/button';
import { AWS_S3_DOMAIN } from '@/constants';
import { customerStatusBadge } from '@/constants/options';
import { useControllerContext, useStateContext } from '@/context/productDetailContext';
import useImageSlide from '@/hooks/useImageSlide';
import { cn, formatDate, getCleanHtmlContent, localeFormat } from '@/lib/utils';
import { useScrollTopStore } from '@/stores';
import { Inquiry, Review, YesOrNoEnum } from '@/types';

type TabType = 'detail' | 'review' | 'qna';

const ProductDetailMobileView = () => {
  const {
    product,
    isPurchasable,
    optionalOptions,
    requiredOptions,
    isMounted,
    isBottomPanelOpen,
    purchaseList,
    totalPrice,
    reviewList,
    totalReviewCount,
    averageRating,
    productInquiryList,
    totalInquiryCount,
  } = useStateContext();
  const statusBadge = customerStatusBadge[product.status];

  const {
    handleShare,
    setIsBottomPanelOpen,
    onOptionSelect,
    setPurchaseList,
    handleQuantityChange,
    onCartMobileHandler,
    onPurchaseMobileHandler,
    handleReviewOpen,
    moveToInquiryWritePage,
  } = useControllerContext();

  const [isDetailExpanded, setIsDetailExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('detail');
  const [expandedInquiryIds, setExpandedInquiryIds] = useState<number[]>([]);

  const toggleInquiryExpand = (inquiryId: number) => {
    setExpandedInquiryIds((prev) =>
      includes(prev, inquiryId) ? without(prev, inquiryId) : [...prev, inquiryId]
    );
  };

  const { setBottomOffset, setHidden } = useScrollTopStore();

  // 스크롤탑 버튼: 하단 고정바(구매/장바구니) 높이만큼 띄워주고, 패널 펼쳐지면 숨김
  useEffect(() => {
    setBottomOffset(96);
    return () => {
      setBottomOffset(0);
      setHidden(false);
    };
  }, []);

  useEffect(() => {
    setHidden(isBottomPanelOpen);
  }, [isBottomPanelOpen]);

  // 하단 패널 열렸을 때 body 스크롤 잠금
  useEffect(() => {
    if (!isBottomPanelOpen) return;
    const { overflow, paddingRight } = document.body.style;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
    return () => {
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
    };
  }, [isBottomPanelOpen]);

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
        <div className="flex flex-col gap-6">
          {/* 이미지 캐러셀 — 모바일은 좌우/상단 패딩 무시하고 엣지-투-엣지 */}
          <div className="-mx-6 -mt-6">
            <ProductCarousel product={product} />
          </div>

          {/* 상품 정보 */}
          <div className="flex-1 flex flex-col">
            {/* 카테고리 + 공유 아이콘 */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-[15px] font-medium text-neutral-500">
                {`${product.categoryName} >`}
              </span>
              <button
                onClick={handleShare}
                aria-label="공유하기"
                className="w-9 h-9 flex items-center justify-center text-neutral-700 hover:text-black transition-colors -mr-2"
              >
                <Share2 size={20} strokeWidth={1.75} />
              </button>
            </div>

            {/* 상품명 */}
            <div className="flex items-center gap-2 mb-3">
              {statusBadge && (
                <span className="shrink-0 rounded-sm bg-warm-800 px-2 py-0.5 text-[12px] font-semibold text-white">
                  {statusBadge}
                </span>
              )}
              <h1 className="text-[18px] font-semibold leading-[1.4] text-black break-keep tracking-[-0.01em]">
                {product.name}
              </h1>
            </div>

            {/* 가격 */}
            <div className="flex items-baseline gap-1.5 mb-4">
              <span className="text-[24px] font-bold text-black tabular-nums tracking-tight">
                {localeFormat(product.displayPrice)}
              </span>
              <span className="text-[18px] font-semibold text-black">원</span>
            </div>

            {/* 별점 · 리뷰 — 리뷰 없을 때는 0.0 / 0건 */}
            <div className="flex items-center gap-2 mb-6 text-[14px]">
              <div className="flex items-center gap-1">
                <Star size={14} className="text-gold-400 fill-gold-400" />
                <span className="font-semibold text-black tabular-nums">
                  {(averageRating ?? 0).toFixed(1)}
                </span>
              </div>
              <span className="text-neutral-300">|</span>
              {totalReviewCount > 0 ? (
                <button
                  type="button"
                  onClick={handleReviewOpen}
                  className="text-neutral-600 hover:text-black underline-offset-2 hover:underline tabular-nums cursor-pointer"
                >
                  리뷰 {localeFormat(totalReviewCount)}건
                </button>
              ) : (
                <span className="text-neutral-500 tabular-nums">리뷰 0건</span>
              )}
            </div>

            {/* 배송비 정보 */}
            <div className="mb-6 pb-6">
              <div className="text-[14px] text-warm-700">
                <span>배송비</span>
                <span className="ml-2">
                  <span className="text-warm-700">
                    {product.shippingPrice ? (
                      `${localeFormat(product.shippingPrice)}원`
                    ) : (
                      <span className="font-medium">무료배송</span>
                    )}
                  </span>
                </span>
              </div>
              <p className="text-[12px] text-warm-400 mt-2">
                50,000원 이상 구매 시 무료 / 제주도 지역은 배송비 4,000원이 추가되어 부과됩니다.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 탭 네비게이션 */}
      <div className="sticky top-[48px] z-10 bg-warm-50">
        <div className="flex items-center justify-center">
          <button
            onClick={() => handleTabClick('detail')}
            className={`flex-1 py-4 text-center text-[15px] font-medium transition-colors ${
              activeTab === 'detail' ? 'text-black' : 'text-warm-400'
            }`}
          >
            상세 설명
          </button>
          <button
            onClick={() => handleTabClick('review')}
            className={`flex-1 py-4 text-center text-[15px] font-medium transition-colors ${
              activeTab === 'review' ? 'text-black' : 'text-warm-400'
            }`}
          >
            후기 ({totalReviewCount})
          </button>
          <button
            onClick={() => handleTabClick('qna')}
            className={`flex-1 py-4 text-center text-[15px] font-medium transition-colors ${
              activeTab === 'qna' ? 'text-black' : 'text-warm-400'
            }`}
          >
            Q&A ({totalInquiryCount})
          </button>
        </div>
        {/* 탭 밑줄 인디케이터 */}
        <div className="relative h-[2px] bg-gray-200">
          <div
            className="absolute h-full bg-brand-900 transition-all duration-300"
            style={{
              width: '33.333%',
              left: activeTab === 'detail' ? '0%' : activeTab === 'review' ? '33.333%' : '66.666%',
            }}
          />
        </div>
      </div>

      {/* 상세정보 섹션 - 모바일뷰 */}
      <div ref={detailSectionRef} className="max-w-[800px]">
        {/* 상세 이미지 영역 */}
        <div className="relative">
          <div
            className={`w-full space-y-0 overflow-hidden transition-all duration-500 ease-in-out ${
              isDetailExpanded ? 'max-h-none' : 'max-h-[600px]'
            }`}
          >
            {product.detailImages.map((image, index) => (
              <div key={index} className="relative w-full">
                <Image
                  src={`${AWS_S3_DOMAIN}${image}`}
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
              isDetailExpanded ? 'my-8' : 'absolute bottom-4 left-0 right-0'
            }`}
          >
            <button
              onClick={() => {
                setIsDetailExpanded(!isDetailExpanded);
                if (isDetailExpanded) {
                  handleTabClick('detail');
                }
              }}
              className="flex items-center gap-2 px-6 py-3 bg-warm-50 border border-brand-200 rounded-full shadow-sm hover:bg-brand-50 transition-colors"
            >
              <span className="text-sm font-medium text-warm-700">
                {isDetailExpanded ? '상세 정보 접기' : '상세 정보 더보기'}
              </span>
              {isDetailExpanded ? (
                <ChevronUp size={18} className="text-warm-500" />
              ) : (
                <ChevronDown size={18} className="text-warm-500" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 섹션 구분라인 */}
      <div className="h-2 bg-brand-100" />

      {/* 리뷰 섹션 */}
      <div ref={reviewSectionRef} className="max-w-[800px] py-6 px-5">
        {/* 리뷰 타이틀 */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[18px] font-medium text-brand-800">리뷰 {totalReviewCount}</h3>
        </div>

        <div className="border-t border-brand-200/60" />

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
                                  <Star className="w-4 h-4 fill-gold-400 text-gold-400" />
                                </div>
                              )}
                              {isFull && (
                                <Star className="absolute inset-0 w-4 h-4 fill-gold-400 text-gold-400" />
                              )}
                            </div>
                          );
                        })}
                      </div>
                      <div className="flex items-center">
                        <span className="text-[13px] text-warm-500">{review.email}</span>
                        <span className="text-[12px] text-warm-400 mx-[4px]">|</span>
                        <span className="text-[12px] text-warm-400">
                          {formatDate(review?.createdAt, 'yyyy.MM.dd')}
                        </span>
                      </div>
                    </div>

                    {/* 리뷰 내용 */}
                    <p className="text-sm text-warm-700 mb-8 whitespace-pre-wrap">
                      {review.content}
                    </p>

                    {/* 리뷰 이미지 */}
                    {review.reviewImages && review.reviewImages.length > 0 && (
                      <div className="flex gap-3 overflow-x-auto">
                        {review.reviewImages.map((image, idx) => (
                          <div
                            key={idx}
                            className="relative w-30 h-30 flex-shrink-0 cursor-pointer border border-brand-200/60 rounded-xs"
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
                  {index !== reviewList.length - 1 && (
                    <div className="border-t border-brand-200/60" />
                  )}
                </Fragment>
              );
            })}

            {/* 리뷰 더보기 버튼 */}
            {totalReviewCount > 0 && (
              <div className="flex justify-center pt-10 pb-2">
                <button
                  className={cn(
                    'px-6 py-2',
                    'text-sm font-medium text-tea-500',
                    'border border-tea-500 rounded-md',
                    'active:bg-tea-500/10'
                  )}
                  onClick={handleReviewOpen}
                >
                  리뷰 전체보기
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="py-12 text-center min-h-[250px] flex items-center justify-center">
            <p className="text-warm-400">작성된 후기가 없습니다.</p>
          </div>
        )}
      </div>

      {/* 섹션 구분라인 */}
      <div className="h-2 bg-brand-100" />

      {/* Q&A 섹션 */}
      <div ref={qnaSectionRef} className="max-w-[800px] pt-6 px-5 mb-[100px]">
        {/* 질문 타이틀 */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[18px] font-medium text-brand-800">Q&A</h3>
          <button
            className="mr-1 text-[15px] text-warm-500 active:text-warm-700"
            onClick={moveToInquiryWritePage}
          >
            문의하기
          </button>
        </div>

        <div className="border-t border-brand-200/60" />

        {/* Q&A 목록 */}
        {!isEmpty(productInquiryList) ? (
          <ul className="divide-y divide-brand-200/60">
            {map(productInquiryList, (inquiry: Inquiry) => {
              const isExpanded = includes(expandedInquiryIds, inquiry.inquiryId);
              const hasAnswer = inquiry.isAnswered === YesOrNoEnum.YES;

              return (
                <li key={inquiry.inquiryId} className="py-4">
                  {/* 본문: 비밀글이면 자물쇠 표시, 아니면 제목 노출 */}
                  <div className="mb-3">
                    {inquiry.canView ? (
                      <p className="text-[14px] text-brand-800 font-medium leading-relaxed break-words">
                        {inquiry.title}
                      </p>
                    ) : (
                      <p className="flex items-center gap-1.5 text-[14px] text-warm-500">
                        <span>비밀글입니다.</span>
                        <Lock size={13} strokeWidth={2} className="text-warm-500" />
                      </p>
                    )}
                  </div>

                  {/* 메타 정보 + 토글 */}
                  {inquiry.canView ? (
                    <button
                      type="button"
                      onClick={() => toggleInquiryExpand(inquiry.inquiryId)}
                      aria-label={isExpanded ? '문의 접기' : '문의 펼치기'}
                      aria-expanded={isExpanded}
                      className="w-full flex items-center justify-between cursor-pointer active:opacity-70"
                    >
                      <div className="flex items-center gap-2 text-[12px] min-w-0">
                        <span
                          className={cn(
                            'shrink-0 font-semibold',
                            hasAnswer ? 'text-tea-700' : 'text-gold-600'
                          )}
                        >
                          {hasAnswer ? '답변완료' : '답변대기'}
                        </span>
                        <span className="text-warm-200">|</span>
                        <span className="text-warm-500 truncate">{inquiry.email}</span>
                        <span className="text-warm-200">|</span>
                        <span className="text-warm-400 tabular-nums shrink-0">
                          {formatDate(inquiry.createdAt, 'yyyy.MM.dd HH:mm')}
                        </span>
                      </div>
                      <span className="ml-2 shrink-0 p-1 text-warm-500">
                        <ChevronDown
                          size={18}
                          className={cn(
                            'transition-transform duration-200',
                            isExpanded && 'rotate-180'
                          )}
                        />
                      </span>
                    </button>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-[12px] min-w-0">
                        <span
                          className={cn(
                            'shrink-0 font-semibold',
                            hasAnswer ? 'text-tea-700' : 'text-gold-600'
                          )}
                        >
                          {hasAnswer ? '답변완료' : '답변대기'}
                        </span>
                        <span className="text-warm-200">|</span>
                        <span className="text-warm-500 truncate">{inquiry.email}</span>
                        <span className="text-warm-200">|</span>
                        <span className="text-warm-400 tabular-nums shrink-0">
                          {formatDate(inquiry.createdAt, 'yyyy.MM.dd HH:mm')}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* 펼침 영역: 질문 본문 + (있다면) 답변 본문 */}
                  {inquiry.canView && isExpanded && (
                    <div className="mt-4 space-y-3">
                      {/* 질문자 본문 */}
                      <div className="flex gap-3 px-3 py-3 border border-brand-200/60 rounded-md">
                        <span className="shrink-0 inline-flex items-center justify-center w-6 h-6 rounded-full bg-warm-100 text-warm-600 text-[12px] font-bold leading-none">
                          Q
                        </span>
                        <div
                          className="flex-1 min-w-0 pt-0.5 text-[14px] text-brand-800 leading-relaxed break-words [&_img]:max-w-full [&_img]:h-auto [&_img]:my-2 [&_img]:rounded"
                          dangerouslySetInnerHTML={{
                            __html: getCleanHtmlContent(inquiry.content),
                          }}
                        />
                      </div>

                      {/* 판매자 답변 */}
                      {hasAnswer && inquiry.answer && (
                        <div className="flex gap-3 px-3 py-3 bg-tea-50/40 border border-brand-200/60 rounded-md">
                          <span className="shrink-0 inline-flex items-center justify-center w-6 h-6 rounded-full bg-tea-500 text-white text-[12px] font-bold leading-none">
                            A
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1.5">
                              <span className="text-[11px] font-semibold text-tea-700">판매자</span>
                              <span className="text-[11px] text-warm-400 tabular-nums">
                                {formatDate(inquiry.answer.createdAt, 'yyyy.MM.dd HH:mm')}
                              </span>
                            </div>
                            <div
                              className="text-[14px] text-brand-700 leading-relaxed break-words [&_img]:max-w-full [&_img]:h-auto [&_img]:my-2 [&_img]:rounded"
                              dangerouslySetInnerHTML={{
                                __html: getCleanHtmlContent(inquiry.answer.content),
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="py-12 text-center min-h-[250px] flex items-center justify-center">
            <p className="text-warm-400">작성된 질문이 없습니다.</p>
          </div>
        )}

        <div className="border-t border-brand-200/60" />

        {/* 질문 쓰기 버튼 */}
        {totalInquiryCount > 5 && (
          <div className="flex justify-center pt-6 pb-2">
            <button
              className={cn(
                'px-6 py-2',
                'text-sm font-medium text-tea-500',
                'border border-tea-500 rounded-md',
                'active:bg-tea-500/10'
              )}
            >
              Q&A 전체보기
            </button>
          </div>
        )}
      </div>

      {/* 모바일 하단 고정 버튼 영역 - Portal로 body에 직접 렌더링 */}
      {isMounted &&
        createPortal(
          <>
            {/* 백드롭 — 패널이 열리면 뒷배경 어둡게 + 터치/스크롤 차단 */}
            <div
              onClick={() => setIsBottomPanelOpen(false)}
              aria-hidden="true"
              className={cn(
                'fixed inset-0 z-60 bg-black/50 lg:hidden transition-opacity duration-300 touch-none',
                isBottomPanelOpen
                  ? 'opacity-100 pointer-events-auto'
                  : 'opacity-0 pointer-events-none'
              )}
              style={{ viewTransitionName: 'none' }}
            />
            <div
              className="fixed bottom-0 left-0 right-0 z-70 lg:hidden"
              style={{ viewTransitionName: 'none' }}
            >
              {/* 메인 패널 */}
              <div
                className={cn(
                  'bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.08)] overflow-hidden',
                  'rounded-t-2xl transition-all duration-300 ease-in-out'
                )}
              >
                {/* 상단 토글 핸들 — 열림/닫힘 상태와 무관하게 항상 같은 자리, 아이콘만 회전 */}
                <button
                  type="button"
                  onClick={() => setIsBottomPanelOpen(!isBottomPanelOpen)}
                  aria-label={isBottomPanelOpen ? '상세 옵션 닫기' : '상세 옵션 열기'}
                  aria-expanded={isBottomPanelOpen}
                  className="w-full flex items-center justify-center pt-2.5 pb-1 cursor-pointer"
                >
                  <ChevronUp
                    size={22}
                    strokeWidth={1.75}
                    className={cn(
                      'text-neutral-400 transition-transform duration-300 ease-in-out',
                      isBottomPanelOpen && 'rotate-180'
                    )}
                  />
                </button>
                {/* 확장 패널: 구매수량 + 상품금액 합계 (옵션 없는 경우) */}
                <div
                  className={`overflow-hidden overflow-y-auto transition-all duration-300 ease-in-out ${
                    isBottomPanelOpen ? 'max-h-[650px]' : 'max-h-0'
                  }`}
                >
                  <div className="px-4 pt-1 pb-4 space-y-4">
                    {/* 옵션 선택 - 커스텀 드롭다운 */}
                    {size(requiredOptions) > 1 && (
                      <>
                        <span className="text-[13px] font-semibold tracking-tight text-warm-700 ml-0.5 mb-1.5 inline-block">
                          옵션선택{' '}
                          <span className="text-rose-500 text-[11px] font-medium align-middle">
                            필수
                          </span>
                        </span>
                        <OptionDropdown
                          options={requiredOptions}
                          onOptionSelect={onOptionSelect}
                          placeholder="구성 선택"
                        />
                      </>
                    )}
                    {/* 옵션 선택 - 커스텀 드롭다운 */}
                    {!isEmpty(optionalOptions) && (
                      <>
                        <span className="text-[13px] font-semibold tracking-tight text-warm-700 ml-0.5 mb-1.5 inline-block">
                          추가상품{' '}
                          <span className="text-warm-400 text-[11px] font-normal align-middle">
                            선택
                          </span>
                        </span>
                        <OptionDropdown options={optionalOptions} onOptionSelect={onOptionSelect} />
                      </>
                    )}
                    {/* 선택된 옵션 목록 */}
                    {!isEmpty(purchaseList) && (
                      <div className="space-y-3">
                        {map(
                          purchaseList,
                          ({ productVariantId, optionLabel, quantity, price }, index) => (
                            <div
                              key={`${productVariantId}-${index}`}
                              className="border border-brand-200/60 rounded-md p-4 space-y-3"
                            >
                              <div className="flex items-start justify-between">
                                <>
                                  <span className="text-sm font-medium text-brand-800">
                                    {optionLabel}
                                  </span>
                                  {size(requiredOptions) > 1 && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const updatedCart = clone(purchaseList);
                                        updatedCart.splice(index, 1);
                                        setPurchaseList(updatedCart);
                                      }}
                                      className="text-warm-400 hover:text-warm-600"
                                    >
                                      <X size={20} strokeWidth={1.5} />
                                    </button>
                                  )}
                                </>
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center border border-brand-200 rounded">
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
                      <span className="text-sm font-medium text-warm-700">상품 금액 합계</span>
                      <span className="text-xl font-bold">{localeFormat(totalPrice)}원</span>
                    </div>
                  </div>
                </div>
                {/* 버튼 — 화이트/블랙 B&W 톤 */}
                <div className="flex gap-2 px-4 pt-3 pb-[max(12px,env(safe-area-inset-bottom))]">
                  {isPurchasable ? (
                    <>
                      <Button
                        onClick={onCartMobileHandler}
                        className="flex-1 h-12 text-[15px] font-semibold bg-white text-black border border-black hover:bg-neutral-50 active:bg-neutral-100 shadow-none rounded-lg cursor-pointer"
                      >
                        장바구니
                      </Button>
                      <Button
                        onClick={onPurchaseMobileHandler}
                        className="flex-1 h-12 text-[15px] font-semibold bg-black text-white border border-black hover:bg-neutral-900 active:bg-neutral-800 shadow-none rounded-lg cursor-pointer"
                      >
                        구매하기
                      </Button>
                    </>
                  ) : (
                    <Button
                      disabled
                      className="flex-1 h-12 text-[15px] font-semibold bg-warm-300 text-white shadow-none rounded-lg disabled:opacity-100"
                    >
                      {statusBadge ?? '구매 불가'}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </>,
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
