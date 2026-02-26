import { Fragment, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';

import { useQueryClient } from '@tanstack/react-query';
import { map } from 'lodash-es';
import { Star } from 'lucide-react';
import { useInView } from 'react-intersection-observer';

import { ImageSlideModal } from '@/components/common/modal';
import { Checkbox } from '@/components/ui/checkbox';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { AWS_S3_DOMAIN } from '@/constants';
import useImageSlide from '@/hooks/useImageSlide';
import { cn, formatDate } from '@/lib/utils';
import { useMypageService } from '@/service';
import { Review, ReviewListSearchRequest, SortByEnum } from '@/types';

type Props = {
  reviewOpen: boolean;
  setReviewOpen: (open: boolean) => void;
  productId: string;
};

type ReviewSearchPayload = Omit<ReviewListSearchRequest, 'page'>;

const ProductReviewSheet = ({ reviewOpen, setReviewOpen, productId }: Props) => {
  const queryClient = useQueryClient();
  const { ref, inView } = useInView();

  const {
    imageSlideOpen,
    setImageSlideOpen,
    selectedImages,
    selectedImageIndex,
    handleImageModalOpen,
  } = useImageSlide();

  const initialReviewSearchPayload: ReviewSearchPayload = {
    productId,
    sortBy: SortByEnum.LATEST,
    photoOnly: false,
    size: 5,
  };

  const [reviewSearchPayload, setReviewSearchPayload] = useState<ReviewSearchPayload>({
    ...initialReviewSearchPayload,
  });

  const { useGetReviewListInfiniteQuery } = useMypageService();
  const {
    data: reviewListData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetReviewListInfiniteQuery(reviewSearchPayload, 'productReviewSheet', {
    enabled: !!reviewOpen,
  });

  const { reviewList, averageRating } = useMemo(() => {
    if (reviewListData) {
      const { pages } = reviewListData;
      return {
        reviewList: pages.flatMap(({ data }) => data.data),
        totalReviewCount: pages[0].data.totalCount,
        averageRating: pages[0].data.averageRating,
      };
    }

    return {
      reviewList: [],
      totalReviewCount: 0,
      averageRating: 0,
    };
  }, [reviewListData]);

  const handleSortBy = (sortBy: SortByEnum) => {
    setReviewSearchPayload({ ...reviewSearchPayload, sortBy });
  };

  const handleClose = (open: boolean) => {
    // 이미지 슬라이드가 열려 있을 때는 Escape 등으로 시트 닫기 요청이 와도 리뷰 시트는 유지
    if (!open && imageSlideOpen) return;

    setReviewOpen(open);

    if (!open) {
      setReviewSearchPayload({ ...initialReviewSearchPayload });

      setTimeout(() => {
        queryClient.removeQueries({
          queryKey: ['reviewList', 'productReviewSheet'],
        });
      }, 0);
    }
  };

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <Sheet open={reviewOpen} onOpenChange={handleClose}>
      <SheetContent
        side="bottom"
        className="h-full z-[100]"
        overlayClassName="z-[100]"
        aria-describedby={undefined}
      >
        <SheetHeader className="border-b">
          <SheetTitle>제품 리뷰</SheetTitle>
        </SheetHeader>
        <div className="flex items-center justify-between px-4">
          {/* 좌측: 사진 후기만 보기 체크박스 */}
          <label className="flex items-center gap-2 cursor-pointer">
            <Checkbox
              checked={reviewSearchPayload.photoOnly}
              onCheckedChange={(checked) =>
                setReviewSearchPayload({ ...reviewSearchPayload, photoOnly: checked === true })
              }
              className="h-4 w-4 border-gray-300"
            />
            <span className="text-sm text-gray-600">사진 후기만 보기</span>
          </label>

          {/* 우측: 정렬 옵션 */}
          <div className="flex items-center gap-1 text-sm">
            <button
              type="button"
              onClick={() => handleSortBy(SortByEnum.RECOMMENDED)}
              className={cn(
                'text-[14px]',
                reviewSearchPayload.sortBy === SortByEnum.RECOMMENDED
                  ? 'text-black font-medium'
                  : 'text-gray-400'
              )}
            >
              별점순
            </button>
            <span className="text-gray-300 px-1">|</span>
            <button
              type="button"
              onClick={() => handleSortBy(SortByEnum.LATEST)}
              className={cn(
                'text-[14px]',
                reviewSearchPayload.sortBy === SortByEnum.LATEST
                  ? 'text-black font-medium'
                  : 'text-gray-400'
              )}
            >
              최신순
            </button>
          </div>
        </div>
        <div className="overflow-y-auto px-5 flex-1 min-h-0">
          {/* 평균 별점: 스크롤과 함께 올라감 */}
          <div className="flex items-center justify-center gap-2 py-4">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => {
                const fillRatio = Math.min(1, Math.max(0, (averageRating ?? 0) - (star - 1)));

                return (
                  <div key={star} className="relative w-7 h-7">
                    <Star className="absolute inset-0 w-7 h-7 fill-gray-200 text-gray-200" />
                    {fillRatio > 0 && (
                      <div
                        className="absolute inset-0 overflow-hidden"
                        style={{ width: `${fillRatio * 100}%` }}
                      >
                        <Star className="w-7 h-7 fill-[#F9BC36] text-[#F9BC36]" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <span className="text-lg font-semibold text-black">
              {Number((averageRating ?? 0).toFixed(1))}
            </span>
          </div>
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
                  <p className="text-sm text-gray-700 mb-8 whitespace-pre-wrap">{review.content}</p>

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
          {hasNextPage && !isFetchingNextPage && <div ref={ref} className="h-[50px]" />}
        </div>
        {/* 시트 안에서 렌더해 Radix가 '바깥 클릭'으로 처리하지 않도록 함 */}
        <ImageSlideModal
          modalOpen={imageSlideOpen}
          setModalOpen={setImageSlideOpen}
          images={selectedImages}
          initialIndex={selectedImageIndex}
          showArrows={false}
        />
      </SheetContent>
    </Sheet>
  );
};

export default ProductReviewSheet;
