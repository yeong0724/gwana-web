'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

import { Truck } from 'lucide-react';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';
import { cn } from '@/lib/utils';
import { Product } from '@/types';

type ProductCardProps = {
  product: Product;
  onClickProduct: (productId: string) => void;
};

const ProductCard = ({ product, onClickProduct }: ProductCardProps) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  const images = product.images || [];

  useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const formatPrice = (price?: number) => {
    if (!price) return '0원';
    return new Intl.NumberFormat('ko-KR').format(price) + '원';
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-shadow">
      {/* 이미지 슬라이더 영역 */}
      <div
        className="relative w-full bg-gray-100 group overflow-hidden"
        style={{ aspectRatio: '1' }}
      >
        <Carousel
          setApi={setApi}
          opts={{
            align: 'start',
            loop: images.length > 1,
          }}
          className="absolute inset-0 w-full h-full"
        >
          <CarouselContent className="h-full -ml-0">
            {images.map((image, index) => (
              <CarouselItem key={index} className="h-full pl-0 basis-full shrink-0 grow-0">
                <div className="relative w-full h-full">
                  <Image src={image} alt={`${image}`} width={600} height={600} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* 네비게이션 화살표 */}
          {images.length > 1 && (
            <>
              <CarouselPrevious className="left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white border-none shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-20" />
              <CarouselNext className="right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white border-none shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-20" />
            </>
          )}

          {/* 페이지 인디케이터 */}
          {images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-20 pointer-events-none">
              {images.map((_, index) => (
                <button
                  key={index}
                  className={cn(
                    'h-2 rounded-full transition-all pointer-events-auto',
                    current === index ? 'w-6 bg-white' : 'w-2 bg-white/50 hover:bg-white/75'
                  )}
                  onClick={() => api?.scrollTo(index)}
                  aria-label={`이미지 ${index + 1}로 이동`}
                />
              ))}
            </div>
          )}
        </Carousel>
      </div>

      {/* 상품 정보 */}
      <div
        className="p-4 space-y-2 cursor-pointer"
        onClick={() => onClickProduct(product.productId)}
      >
        <h3 className="text-sm font-medium text-gray-900 line-clamp-2 min-h-[2.5rem]">
          {product.productName}
        </h3>
        <div className="flex items-center justify-between pt-1">
          <div className="space-y-1">
            <p className="text-lg font-bold text-gray-900">{formatPrice(product.price || 25000)}</p>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Truck className="w-3 h-3" />
              <span>
                {product.shippingPrice
                  ? `배송비 ${formatPrice(product.shippingPrice)}`
                  : '무료배송'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
