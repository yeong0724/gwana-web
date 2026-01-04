'use client';

import { useEffect, useState } from 'react';

import { ChevronLeft, ChevronRight } from 'lucide-react';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel';

const MainContainer = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  const videos = [
    {
      src: '/videos/gwana_intro_2.mp4',
      alt: 'gwana_intro_2',
    },
    {
      src: '/videos/tea_drip.mp4',
      alt: 'tea_drip',
    },
  ];

  useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <div className="relative w-full bg-gray-50 overflow-hidden">
      <Carousel
        setApi={setApi}
        opts={{
          align: 'start',
          loop: videos.length > 1,
        }}
        className="w-full group"
      >
        <CarouselContent className="-ml-0">
          {videos.map(({ src }, index) => (
            <CarouselItem key={index} className="pl-0 basis-full shrink-0 grow-0">
              <video
                src={src}
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-auto max-h-[78vh]"
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        {/* 네비게이션 화살표 */}
        {videos.length > 0 && (
          <>
            <button
              onClick={() => api?.scrollPrev()}
              className="absolute left-1 top-1/2 -translate-y-1/2 h-10 w-10 flex items-center justify-center rounded-full bg-white/80 hover:bg-white shadow-lg z-20"
            >
              <ChevronLeft className="h-6 w-6 text-gray-700" />
            </button>
            <button
              onClick={() => api?.scrollNext()}
              className="absolute right-1 top-1/2 -translate-y-1/2 h-10 w-10 flex items-center justify-center rounded-full bg-white/80 hover:bg-white shadow-lg z-20"
            >
              <ChevronRight className="h-6 w-6 text-gray-700" />
            </button>
          </>
        )}
        {/* 페이지 인디케이터 - 프로그레스 바 스타일 */}
        {videos.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 w-1/3">
            <div className="h-[5px] bg-white/30 rounded-full overflow-hidden border border-black/20">
              <div
                className="h-full bg-white transition-all duration-300 ease-out"
                style={{
                  width: `${((current + 1) / videos.length) * 100}%`,
                }}
              />
            </div>
          </div>
        )}
      </Carousel>
    </div>
  );
};

export default MainContainer;
