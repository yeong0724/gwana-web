'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

import { useScroll, useTransform } from 'framer-motion';
import { forEach, shuffle, take } from 'lodash-es';

import { ResponsiveFrame } from '@/components/common/frame';
import MainMobileView from '@/components/features/main/MainMobileView';
import MainWebView from '@/components/features/main/MainWebView';
import { heroSlides } from '@/constants';
import { Provider } from '@/context/mainContext';
import useNativeRouter from '@/hooks/useNativeRouter';
import useProductService from '@/service/useProductService';
import { Product } from '@/types';

const MainContainer = () => {
  const router = useRouter();
  const { forward } = useNativeRouter();
  const { useProductListQuery } = useProductService();

  const [heroIndex, setHeroIndex] = useState(0);
  const [heroAutoplay, setHeroAutoplay] = useState(true);
  const [isSoundOn, setIsSoundOn] = useState(false);
  const heroTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // Derived — always in sync with heroIndex, no async state lag
  const slideDuration = heroSlides[heroIndex].duration;
  const currentSlide = heroSlides[heroIndex];

  const scrollRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ['start start', 'end end'],
  });

  const heroParallaxY = useTransform(scrollYProgress, [0, 0.3], ['0%', '20%']);

  const { data: productListData } = useProductListQuery({ categoryId: '' });

  const [productList, setProductList] = useState<Product[]>([]);
  const [popularProducts, setPopularProducts] = useState<Product[]>([]);

  // Shuffle on client only to avoid hydration mismatch
  useEffect(() => {
    if (productListData) {
      const { data } = productListData;
      setPopularProducts(take(shuffle([...data]), 4));
      setProductList(data);
    }
  }, [productListData]);

  const onClickProduct = (productId: string) => {
    forward(`/product/${productId}`);
  };

  const onMoveToProductPage = () => {
    if (heroIndex === 2) forward('/product?category=all');
    if (heroIndex === 1) forward('/product/4');
  };

  const onClickCategory = (categoryId: string) => {
    forward(`/product?category=${categoryId}`);
  };

  const onClickViewAll = () => {
    forward('/product?category=all');
  };

  // Video playback control — restart & play current, pause others
  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (!video) return;
      if (index === heroIndex) {
        video.currentTime = 0;
        video.muted = heroSlides[index].hasSound ? !isSoundOn : true;

        // 먼저 play() 시도, 실패 시 로드 후 재시도
        video.play().catch(() => {
          if (video.readyState === 0) video.load();
          video.addEventListener('canplay', () => video.play().catch(() => {}), { once: true });
        });
      } else {
        video.pause();
        video.muted = true;
      }
    });
  }, [heroIndex]);

  // Sound toggle — only update muted, don't restart video
  useEffect(() => {
    const video = videoRefs.current[heroIndex];
    if (!video) return;
    video.muted = heroSlides[heroIndex].hasSound ? !isSoundOn : true;
  }, [isSoundOn, heroIndex]);

  // Hero auto-advance — duration driven by heroSlides[].duration
  useEffect(() => {
    if (!heroAutoplay) return;

    const dur = heroSlides[heroIndex].duration;

    heroTimerRef.current = setTimeout(() => {
      setHeroIndex((prev) => (prev + 1) % heroSlides.length);
    }, dur * 1000);

    return () => {
      if (heroTimerRef.current) clearTimeout(heroTimerRef.current);
    };
  }, [heroAutoplay, heroIndex]);

  // Prefetching
  useEffect(() => {
    router.prefetch('/product?category=all');
    forEach(productList, ({ productId }) => {
      router.prefetch(`/product/${productId}`);
    });
  }, [router, productList]);

  // 새로고침 시 항상 최상단으로 이동
  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, []);

  return (
    <Provider
      state={{
        heroIndex,
        heroAutoplay,
        isSoundOn,
        slideDuration,
        currentSlide,
        scrollRef,
        videoRefs,
        heroParallaxY,
        productList,
        popularProducts,
      }}
      controller={{
        setHeroIndex,
        setHeroAutoplay,
        setIsSoundOn,
        onClickProduct,
        onMoveToProductPage,
        onClickCategory,
        onClickViewAll,
      }}
    >
      <ResponsiveFrame mobileComponent={<MainMobileView />} webComponent={<MainWebView />} />
    </Provider>
  );
};

export default MainContainer;
