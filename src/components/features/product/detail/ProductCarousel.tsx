import { useEffect, useState } from 'react';
import Image from 'next/image';

import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { cn } from '@/lib/utils';
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
                <div
                  className={cn(
                    'w-3/4 relative h-[4px] overflow-hidden',
                    'border-[1px] border-gray-500',
                    'bg-black'
                  )}
                >
                  <div
                    className={cn(
                      'absolute left-0 h-full',
                      'transition-all duration-300 ease-out',
                      'bg-white'
                    )}
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
  );
};

export default ProductCarousel;
