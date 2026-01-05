'use client';

import { useEffect, useState } from 'react';

import { ChevronLeft, ChevronRight, Volume2, VolumeX } from 'lucide-react';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel';

const MainContainer = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [isSoundOn, setIsSoundOn] = useState(false);

  const videos = [
    {
      src: '/videos/gwana_intro_2.mp4',
      alt: 'gwana_intro_2',
      isSound: true,
    },
    {
      src: '/videos/tea_drip.mp4',
      alt: 'tea_drip',
      isSound: false,
    },
  ];

  useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const currentVideoHasSound = videos[current]?.isSound;

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
                muted={!isSoundOn}
                loop
                playsInline
                className="w-full h-auto"
              />
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* 네비게이션 화살표 */}
        {videos.length > 0 && (
          <>
            <button
              onClick={() => api?.scrollPrev()}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20"
            >
              <ChevronLeft className="h-8 w-8 text-white stroke-[3] drop-shadow-[0_0_2px_rgba(0,0,0,0.8)]" />
            </button>
            <button
              onClick={() => api?.scrollNext()}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20"
            >
              <ChevronRight className="h-8 w-8 text-white stroke-[3] drop-shadow-[0_0_2px_rgba(0,0,0,0.8)]" />
            </button>
          </>
        )}

        {/* 사운드 토글 버튼 */}
        {currentVideoHasSound && (
          <button
            onClick={() => setIsSoundOn(!isSoundOn)}
            className="absolute bottom-3 right-3 h-10 w-10 flex items-center justify-center rounded-full bg-black/50 hover:bg-black/70 z-20 transition-colors"
          >
            {isSoundOn ? (
              <Volume2 className="h-5 w-5 text-white" />
            ) : (
              <VolumeX className="h-5 w-5 text-white" />
            )}
          </button>
        )}

        {/* 페이지 인디케이터 */}
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
