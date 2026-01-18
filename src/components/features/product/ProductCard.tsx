'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';
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
    <div
      className="bg-white cursor-pointer group"
      onClick={() => onClickProduct(product.productId)}
    >
      {/* 이미지 슬라이더 영역 */}
      <div
        className="relative w-full bg-gray-50 overflow-hidde shadow-md hover:shadow-lg transition-shadow duration-300"
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
                  <Image
                    src={image}
                    alt={`image-${index}`}
                    width={600}
                    height={600}
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
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

          {/* 페이지 인디케이터 - 프로그레스 바 스타일 */}
          {images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 w-1/3">
              <div className="h-[3px] bg-black/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-black/60 transition-all duration-300 ease-out"
                  style={{
                    width: `${((current + 1) / images.length) * 100}%`,
                  }}
                />
              </div>
            </div>
          )}
        </Carousel>
      </div>

      {/* 상품 정보 */}
      <div className="flex flex-col pt-4 space-y-2 justify-center items-center">
        <h3 className="text-[15px] lg:text-[17px] font-semibold text-gray-900 leading-snug text-center break-keep">
          {product.productName}
        </h3>
        <div className="space-y-1">
          <p className="text-[13px] lg:text-[15px] text-gray-700">
            {formatPrice(product.price || 25000)}
          </p>
          {/* <div className="flex items-center gap-1 text-[12px] text-gray-500">
            <Truck className="w-3 h-3" />
            <span>
              {product.shippingPrice ? `배송비 ${formatPrice(product.shippingPrice)}` : '무료배송'}
            </span>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
