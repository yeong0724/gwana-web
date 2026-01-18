'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import { ChevronLeft, ChevronRight, ArrowRight, Volume2, VolumeX, Check } from 'lucide-react';
import { filter, forEach, map, shuffle, take } from 'lodash-es';

import { productMockData } from '@/api/mock';
import ProductCard from '@/components/features/product/ProductCard';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel';
import useNativeRouter from '@/hooks/useNativeRouter';
import { useRouter } from 'next/navigation';

type RankingTab = 'realtime' | 'monthly';

const MainContainer = () => {
  const router = useRouter();
  const { forward } = useNativeRouter();
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [isSoundOn, setIsSoundOn] = useState(false);
  const [rankingTab, setRankingTab] = useState<RankingTab>('monthly');
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const videos = [
    {
      src: '/videos/gwana_intro_2.mp4',
      alt: 'gwana_intro_2',
      isSound: true,
    },
    {
      src: '/videos/tea_drip.mp4',
      alt: 'tea_drip',
      isSound: true,
    },
  ];

  const [popularProducts, setPopularProducts] = useState<typeof productMockData>([]);

  // 랜덤 4개 상품 선택 (탭이 변경될 때마다 새로 랜덤 선택)
  useEffect(() => {
    setPopularProducts(take(shuffle([...productMockData]), 4));
  }, [rankingTab]);

  const onClickProduct = (productId: string) => {
    forward(`/product/${productId}`);
  };

  const onClickViewAll = () => {
    forward('/product?category=all');
  };

  useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  // 사운드 토글 시 현재 비디오만 제어
  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (video) {
        if (index === current) {
          video.play();
          video.muted = videos[index].isSound ? !isSoundOn : true;
        } else {
          video.pause();
          video.muted = true;
        }
      }
    });
  }, [current, isSoundOn]);

  useEffect(() => {
    router.prefetch('/product?category=all');
  }, [router]);

  useEffect(() => {
    forEach(productMockData, ({ productId }) => {
      router.prefetch(`/product/${productId}`);
    });
  }, []);

  const currentVideoHasSound = videos[current]?.isSound;

  return (
    <>
      <div className="hidden lg:block">
        <div>Web View Main Page</div>
      </div>

      {/* Mobile View Main Page */}
      <div className="lg:hidden relative w-full bg-gray-50 overflow-hidden">
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
                  ref={(el) => {
                    videoRefs.current[index] = el;
                  }}
                  src={src}
                  autoPlay
                  muted
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

        {/* 인기상품 섹션 */}
        <div className="bg-white px-4 pt-15">
          {/* 타이틀 */}
          <h2 className="text-[21px] font-medium text-gray-900 mb-8">관아수제차 인기상품</h2>

          {/* 탭 & 전체보기 */}
          <div className="flex justify-between items-center mb-5">
            <div className="flex items-center gap-1 text-[13px] text-gray-500">
              <button
                onClick={() => setRankingTab('realtime')}
                className={`flex items-center gap-0.5 ${rankingTab === 'realtime' ? 'text-gray-900 font-semibold' : 'text-gray-400'}`}
              >
                {rankingTab === 'realtime' && <Check className="w-3.5 h-3.5" />}
                실시간
              </button>
              <span className="text-gray-300 mx-1">|</span>
              <button
                onClick={() => setRankingTab('monthly')}
                className={`flex items-center gap-0.5 ${rankingTab === 'monthly' ? 'text-gray-900 font-semibold' : 'text-gray-400'}`}
              >
                {rankingTab === 'monthly' && <Check className="w-3.5 h-3.5" />}
                월간
              </button>
            </div>
            <button
              onClick={onClickViewAll}
              className="flex items-center text-[12px] text-gray-400 font-medium gap-[4px]"
            >
              전체보기
              <ArrowRight className="w-3.5 h-3.5 text-amber-700" />
            </button>
          </div>

          {/* 상품 그리드 (2x2) */}
          <div className="grid grid-cols-2 gap-x-[25px] gap-y-10">
            {map(popularProducts, (product) => (
              <ProductCard
                key={product.productId}
                product={product}
                onClickProduct={onClickProduct}
              />
            ))}
          </div>
        </div>

        <div className="bg-white px-4 pt-20 pb-30">
          {/* 타이틀 */}
          <h2 className="text-[21px] font-medium text-gray-900 mb-8">대용차 (논카페인)</h2>
          {/* 상품 그리드 (2x2) */}
          <div className="grid grid-cols-2 gap-x-[25px] gap-y-10">
            {filter(productMockData, { categoryId: 'substituteTea' }).map((product) => (
              <ProductCard
                key={product.productId}
                product={product}
                onClickProduct={onClickProduct}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default MainContainer;
