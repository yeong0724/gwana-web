'use client';

import { useEffect, useRef, useState } from 'react';

import { forEach, map, some } from 'lodash-es';
import { Camera, Star, X } from 'lucide-react';
import { toast } from 'sonner';

import { Textarea } from '@/components/ui/textarea';
import { compressImage } from '@/lib/utils';
import { useAlertStore } from '@/stores';
import { useMypageService } from '@/service';
import { ResultCode, ReviewCreateRequest } from '@/types';
import useNativeRouter from '@/hooks/useNativeRouter';

interface Props {
  productId: string;
}

type ReviewImage = {
  preview: string;
  file: File;
};

const MAX_CONTENT_LENGTH = 300;
const MAX_IMAGES = 5;
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 5;

const ReviewContainer = ({ productId }: Props) => {
  const { backward } = useNativeRouter();
  const { showAlert, showConfirmAlert } = useAlertStore();
  const fileInputRef = useRef<HTMLInputElement>(null);


  const { useImagesUploadMutation, useCreateReviewMutation } = useMypageService();
  const { mutateAsync: uploadImages } = useImagesUploadMutation();
  const { mutate: createReview } = useCreateReviewMutation();

  const [reviewImages, setReviewImages] = useState<ReviewImage[]>([]);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [review, setReview] = useState<ReviewCreateRequest>({
    content: '',
    rating: 0,
    reviewImages: [],
    productId, // review 대상 상품 ID
  });

  // 텍스트 변경 핸들러
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= MAX_CONTENT_LENGTH) {
      setReview({ ...review, content: value });
    }
  };

  // 이미지 추가 버튼 클릭
  const handleAddImageClick = () => {
    fileInputRef.current?.click();
  };

  // 파일 선택 핸들러
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (MAX_IMAGES < files.length) {
      showAlert({
        title: '업로드 불가',
        description: `최대 ${MAX_IMAGES}개의 이미지만 업로드할 수 있습니다.`,
      });
      return;
    }

    try {
      // 병렬로 압축
      const compressedFiles = await Promise.all(
        map(files, (file) => compressImage(file, { quality: 0.9 }))
      );

      if (checkFilesType(compressedFiles)) {
        showAlert({
          title: '업로드 불가',
          description: `허용된 확장자는 jpeg, png, webp 입니다.`,
        });
        return;
      }

      if (checkFilesSize(compressedFiles)) {
        showAlert({
          title: '업로드 불가',
          description: `업로드 가능한 용량은 ${MAX_FILE_SIZE}MB 이하입니다.`,
        });
        return;
      }

      setReviewImages((prev) => [
        ...prev,
        ...map(compressedFiles, (file) => ({
          preview: URL.createObjectURL(file),
          file,
        })),
      ]);
    } catch {
      toast.error('이미지 업로드 중 오류가 발생했습니다.');
    } finally {
      e.target.value = '';
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const checkFilesType = (files: File[]): boolean => {
    return some(files, (file) => !ALLOWED_FILE_TYPES.includes(file.type));
  };

  const checkFilesSize = (files: File[]): boolean => {
    return some(files, (file) => file.size > MAX_FILE_SIZE * 1024 * 1024);
  };

  // 이미지 삭제 핸들러
  const handleRemoveImage = (index: number) => {
    setReviewImages((prev) => {
      // 메모리 해제
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  // 등록하기 핸들러 (추후 구현)
  const handleSubmit = async () => {
    const { content, rating } = review;
    if (rating === 0) {
      showAlert({
        title: '안내',
        description: '별점을 선택해주세요.',
      });
      return;
    }

    if (content.trim().length === 0 || !content.trim()) {
      showAlert({
        title: '안내',
        description: '리뷰 내용을 입력해주세요.',
      });
      return;
    }

    if (content.trim().length < 20) {
      showAlert({
        title: '안내',
        description: '리뷰 내용을 20자 이상 입력해주세요.',
      });
      return;
    }

    const confirmed = await showConfirmAlert({
      title: '안내',
      description: '리뷰를 등록하시겠습니까?',
      confirmText: '등록',
      cancelText: '취소',
    });

    if (!confirmed) return;

    try {
      const formData = new FormData();

      forEach(reviewImages, (image) => {
        formData.append('images', image.file);
      });

      formData.append('folderPath', "images/review");

      const { data, code, message } = await uploadImages(formData);

      if (code !== ResultCode.SUCCESS) {
        showAlert({
          title: '안내',
          description: message || '리뷰 등록 중 오류가 발생하였습니다.',
        });
        return;
      }

      const payload: ReviewCreateRequest = {
        ...review,
        reviewImages: data,
      };

      createReview(payload, {
        onSuccess: async ({ code, message }) => {
          if (code === ResultCode.SUCCESS) {
            await showConfirmAlert({
              title: '안내',
              description: '리뷰 등록이 완료되었습니다.',
            });

            backward();
          } else {
            showAlert({
              title: '안내',
              description: message || '리뷰 등록 중 오류가 발생하였습니다.',
            });
          }
        },
        onError: () => {
          toast.error('리뷰 등록 중 오류가 발생하였습니다.');
        },
      })

    } catch {
      toast.error('리뷰 등록 중 오류가 발생하였습니다.');
    }

  };

  useEffect(() => {
    return () => {
      forEach(reviewImages, (image) => {
        URL.revokeObjectURL(image.preview);
      });
    };
  }, []);

  const starSize = 'w-9 h-9';

  return (
    <div className="bg-warm-50 h-[calc(100dvh-56px)] flex flex-col overflow-hidden">
      <div className="mx-auto w-full flex-1 flex flex-col min-h-0 max-w-[600px] border-x border-brand-100 bg-white">
        {/* 메인 컨텐츠 영역 */}
        <div className="flex-1 min-h-0 overflow-y-auto px-4 py-5">
          {/* 타이틀 */}
          <h1 className="text-lg font-bold text-brand-900 mb-4">자세한 제품 리뷰를 작성해주세요</h1>

          {/* 별점 입력 영역 */}
          <div className="mb-4">
            <div className="flex items-center gap-3">
              {[1, 2, 3, 4, 5].map((rating) => {
                const currentRating = hoverRating || review.rating;
                const isFull = currentRating >= rating;
                const isHalf = currentRating >= rating - 0.5 && currentRating < rating;

                return (
                  <div
                    key={rating}
                    className={`relative cursor-pointer transition-transform hover:scale-110 ${starSize}`}
                    onMouseLeave={() => setHoverRating(0)}
                  >
                    {/* 빈 별 (배경) */}
                    <Star className={`absolute inset-0 fill-brand-200 text-brand-200 ${starSize}`} />

                    {/* 반쪽 채워진 별 */}
                    {isHalf && (
                      <div className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
                        <Star className={`fill-gold-400 text-gold-400 ${starSize}`} />
                      </div>
                    )}

                    {/* 전체 채워진 별 */}
                    {isFull && (
                      <Star className={`absolute inset-0 fill-gold-400 text-gold-400 ${starSize}`} />
                    )}

                    {/* 왼쪽 절반 클릭 영역 (0.5점) */}
                    <button
                      type="button"
                      className="absolute left-0 top-0 w-1/2 h-full z-10"
                      onClick={() => setReview({ ...review, rating: rating - 0.5 })}
                      onMouseEnter={() => setHoverRating(rating - 0.5)}
                    />

                    {/* 오른쪽 절반 클릭 영역 (1점) */}
                    <button
                      type="button"
                      className="absolute right-0 top-0 w-1/2 h-full z-10"
                      onClick={() => setReview({ ...review, rating })}
                      onMouseEnter={() => setHoverRating(rating)}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* 텍스트 입력 영역 */}
          <div className="mb-4">
            <Textarea
              value={review.content}
              onChange={handleContentChange}
              placeholder="주문하신 제품의 맛과 품질에 대해 자세히 써주시면 더 유용한 리뷰가 돼요."
              className="min-h-[180px] resize-none border-brand-300 focus:border-tea-500 focus:ring-tea-500"
              maxLength={MAX_CONTENT_LENGTH}
            />
            {/* 글자 수 표시 */}
            <div className="flex justify-end mt-1.5">
              <span className="text-sm text-warm-400 tabular-nums">
                ({review.content.length}/{MAX_CONTENT_LENGTH})
              </span>
            </div>
          </div>

          {/* 이미지 업로드 영역 */}
          <div className="grid grid-cols-5 gap-2">
            {/* 업로드된 이미지들 */}
            {reviewImages.map((image, index) => (
              <div
                key={index}
                className="relative aspect-square overflow-hidden bg-brand-100"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image.preview}
                  alt={`리뷰 이미지 ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                {/* 삭제 버튼 */}
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-[1px] right-[0px] w-6 h-6 bg-black/70 rounded-full flex items-center justify-center shadow-md hover:bg-black transition-colors"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            ))}

            {/* 이미지 추가 버튼 (5개 미만일 때만 표시) */}
            {reviewImages.length < MAX_IMAGES && (
              <button
                type="button"
                onClick={handleAddImageClick}
                className="aspect-square border-2 border-dashed border-tea-400 flex flex-col items-center justify-center gap-1 hover:bg-tea-50 transition-colors cursor-pointer"
              >
                <Camera className="w-6 h-6 text-tea-500" />
                <span className="text-xs text-tea-600 font-medium tabular-nums">
                  ({reviewImages.length}/{MAX_IMAGES})
                </span>
              </button>
            )}
          </div>

          {/* 숨겨진 파일 입력 */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {/* 등록하기 버튼 - 하단 고정 */}
        <div className="flex-shrink-0 bg-white p-4 border-t border-brand-200">
          <button
            onClick={handleSubmit}
            className="w-full bg-tea-500 hover:bg-tea-600 text-white rounded-full py-3 flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <span className="text-[15px] font-semibold">등록하기</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewContainer;
