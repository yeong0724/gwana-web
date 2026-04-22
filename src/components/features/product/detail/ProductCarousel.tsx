import { useEffect, useState } from 'react';
import Image from 'next/image';

import { ChevronLeft, ChevronRight } from 'lucide-react';

import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { AWS_S3_DOMAIN } from '@/constants';
import { ProductDetailResponse } from '@/types';

type Props = {
  product: ProductDetailResponse;
};

const ProductCarousel = ({ product }: Props) => {
  // 캐러셀 인디케이터용 로컬 상태 (모바일/웹 동시 마운트 시 각 뷰가 자기 Carousel api만 구독하도록)
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
    <div className="flex-1">
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
                      src={`${AWS_S3_DOMAIN}${image}`}
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
            {/* 페이지 인디케이터 — 이미지 2장 이상일 때만 노출 */}
            {product.images.length > 1 && (
              <div className="absolute bottom-3 left-0 right-0 flex justify-center pointer-events-none">
                <div className="flex items-center gap-1 px-3 py-0.5 rounded-full bg-black/55 backdrop-blur-sm text-white text-[12px] font-medium tabular-nums pointer-events-auto leading-none">
                  <button
                    type="button"
                    onClick={() => carouselApi?.scrollPrev()}
                    aria-label="이전 이미지"
                    className="flex items-center justify-center w-5 h-5 text-white/90 hover:text-white transition-colors"
                  >
                    <ChevronLeft size={14} strokeWidth={2} />
                  </button>
                  <span className="min-w-[1ch] text-center">{current + 1}</span>
                  <span className="text-white/55">|</span>
                  <span>{product.images.length}</span>
                  <button
                    type="button"
                    onClick={() => carouselApi?.scrollNext()}
                    aria-label="다음 이미지"
                    className="flex items-center justify-center w-5 h-5 text-white/90 hover:text-white transition-colors"
                  >
                    <ChevronRight size={14} strokeWidth={2} />
                  </button>
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
  );
};

export default ProductCarousel;
