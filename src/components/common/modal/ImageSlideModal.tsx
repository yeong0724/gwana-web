'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';

import { X } from 'lucide-react';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';
import { AWS_S3_DOMAIN } from '@/constants';

type Props = {
  modalOpen: boolean;
  setModalOpen: (open: boolean) => void;
  images: string[];
  initialIndex?: number;
  showArrows?: boolean;
};

const ImageSlideModal = ({
  modalOpen,
  setModalOpen,
  images,
  initialIndex = 0,
  showArrows = true,
}: Props) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [api, setApi] = useState<CarouselApi>();

  // 모달이 열릴 때마다 initialIndex로 이동
  useEffect(() => {
    if (modalOpen && api) {
      api.scrollTo(initialIndex, true);
    }
  }, [modalOpen, initialIndex, api]);

  // 캐러셀 슬라이드 변경 감지
  const onSelect = useCallback(() => {
    if (!api) return;
    setCurrentIndex(api.selectedScrollSnap());
  }, [api]);

  useEffect(() => {
    if (!api) return;
    api.on('select', onSelect);
    return () => {
      api.off('select', onSelect);
    };
  }, [api, onSelect]);

  // 모달이 열릴 때 body 스크롤 방지
  useEffect(() => {
    if (modalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [modalOpen]);

  // Escape 키: 슬라이드만 닫고, 아래 레이어(리뷰 시트 등)로 이벤트가 전파되지 않도록 capture에서 처리
  useEffect(() => {
    if (!modalOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        e.preventDefault();
        setModalOpen(false);
      }
    };
    document.addEventListener('keydown', handleEscape, true);
    return () => document.removeEventListener('keydown', handleEscape, true);
  }, [modalOpen, setModalOpen]);

  const handleClose = () => {
    setModalOpen(false);
  };

  if (!modalOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[120] bg-white flex flex-col"
      role="dialog"
      aria-modal="true"
    >
      {/* 닫기 버튼 */}
      <button
        type="button"
        onClick={handleClose}
        className="absolute top-4 right-4 z-10 p-2 text-gray-700 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
        aria-label="닫기"
      >
        <X className="w-6 h-6" />
      </button>

      {/* 이미지 캐러셀 영역 */}
      <div className="flex-1 overflow-hidden">
        <Carousel
          setApi={setApi}
          opts={{
            startIndex: initialIndex,
            loop: images.length > 1,
          }}
          className="w-full h-full [&_[data-slot='carousel-content']]:h-full"
        >
          <CarouselContent className="h-full -ml-0">
            {images.map((image, idx) => (
              <CarouselItem key={idx} className="pl-0 h-full flex items-center justify-center">
                <div className="relative w-full h-[70vh]">
                  <Image
                    src={`${AWS_S3_DOMAIN}${image}`}
                    alt={`이미지 ${idx + 1}`}
                    fill
                    className="object-contain"
                    sizes="100vw"
                    priority={idx === initialIndex}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          {showArrows && images.length > 1 && (
            <>
              <CarouselPrevious className="left-2 cursor-pointer" />
              <CarouselNext className="right-2 cursor-pointer" />
            </>
          )}
        </Carousel>
      </div>

      {/* 하단 인디케이터 */}
      <div className="py-4 text-center">
        <span className="text-gray-700 text-sm bg-gray-100 px-3 py-1 rounded-full">
          {currentIndex + 1} / {images.length}
        </span>
      </div>
    </div>
  );
};

export default ImageSlideModal;
