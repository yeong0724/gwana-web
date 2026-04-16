'use client';

/* ─────────────────────────────────────────────
   Isolated motion atoms (memoized, no parent re-renders)
   ───────────────────────────────────────────── */
import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion';
import { filter, forEach, map, shuffle, take } from 'lodash-es';
import {
  ArrowRight,
  ArrowUpRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Leaf,
  Pause,
  Play,
  Volume2,
  VolumeX,
} from 'lucide-react';

import { ProductCard } from '@/components/common';
import { AWS_S3_DOMAIN } from '@/constants';
import useNativeRouter from '@/hooks/useNativeRouter';
import useProductService from '@/service/useProductService';
import { HeroSlide, Product } from '@/types';

const FloatingLeaf = React.memo(function FloatingLeaf({
  delay,
  x,
  size,
}: {
  delay: number;
  x: string;
  size: number;
}) {
  return (
    <motion.div
      className="absolute text-tea-400/20 pointer-events-none"
      style={{ left: x, top: '-2rem' }}
      animate={{
        y: ['0vh', '110vh'],
        rotate: [0, 360],
        opacity: [0, 0.6, 0.6, 0],
      }}
      transition={{
        duration: 12 + delay * 2,
        repeat: Infinity,
        delay,
        ease: 'linear',
      }}
    >
      <Leaf size={size} />
    </motion.div>
  );
});

const PulsingDot = React.memo(function PulsingDot() {
  return (
    <motion.span
      className="inline-block w-2 h-2 rounded-full bg-tea-500"
      animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
    />
  );
});

const ShimmerBar = React.memo(function ShimmerBar() {
  return (
    <div className="relative h-[1px] w-full overflow-hidden bg-brand-200/40">
      <motion.div
        className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-gold-400/60 to-transparent"
        animate={{ x: ['-100%', '400%'] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
});

/* ─────────────────────────────────────────────
   Stagger wrapper
   ───────────────────────────────────────────── */

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0, 0, 0.2, 1] as const },
  },
};

/**
 * Main Hero Slide Data Structure
 */
const heroSlides: HeroSlide[] = [
  {
    type: 'video',
    src: 'videos/main/gwana_main_video_1.mp4',
    hasSound: true,
    duration: 31, // TODO: 실제 영상 길이에 맞게 수정
    subtitle: '하동 지리산 자락에서',
    title: '자연이 빚은\n한 잔의 차',
  },
  {
    type: 'video',
    src: 'videos/main/gwana_main_video_2.mp4',
    hasSound: true,
    duration: 10, // TODO: 실제 영상 길이에 맞게 수정
    subtitle: '유기농 녹차 드립백',
    title: '느리게,\n정성으로',
    cta: '녹차 드립백 보러가기',
  },
  {
    type: 'image',
    src: 'https://picsum.photos/seed/gwana-tea-hero3/800/1200',
    hasSound: false,
    duration: 8,
    subtitle: '2025 봄 신차',
    title: '첫물의\n싱그러움',
    cta: '상품 둘러보기',
  },
];

const categories = [
  {
    id: 'greenTea',
    name: '녹차',
    nameEn: 'Green Tea',
    image: 'https://picsum.photos/seed/gwana-green-tea/600/400',
    description: '지리산 하동의 유기농 녹차',
  },
  {
    id: 'substituteTea',
    name: '대용차',
    nameEn: 'Herbal Tea',
    image: 'https://picsum.photos/seed/gwana-herbal-tea/600/400',
    description: '논카페인 수제 블렌딩',
  },
];

const brandStory = [
  {
    image: 'https://picsum.photos/seed/gwana-story1/600/800',
    label: '01',
    title: '지리산 하동',
    text: '천 년의 차 역사가 깃든 땅에서 직접 재배합니다.',
  },
  {
    image: 'https://picsum.photos/seed/gwana-story2/600/800',
    label: '02',
    title: '수작업 덖음',
    text: '솥에서 한 잎 한 잎 정성으로 덖어냅니다.',
  },
  {
    image: 'https://picsum.photos/seed/gwana-story3/600/800',
    label: '03',
    title: '자연 그대로',
    text: '유기농 인증, 어떤 화학물질도 사용하지 않습니다.',
  },
];

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

  const currentSlide = heroSlides[heroIndex];

  return (
    <>
      <div className="hidden md:block">
        <div>Web View Main Page</div>
      </div>

      {/* Mobile View Main Page */}
      <div ref={scrollRef} className="md:hidden relative w-full bg-warm-50 overflow-hidden">
        {/* ── Floating Leaves (ambient) ── */}
        <div className="absolute inset-0 pointer-events-none z-[1] overflow-hidden">
          <FloatingLeaf delay={0} x="10%" size={16} />
          <FloatingLeaf delay={4} x="70%" size={12} />
          <FloatingLeaf delay={8} x="40%" size={14} />
        </div>

        {/* ══════════════════════════════════
            SECTION 1 — Cinematic Hero
            ══════════════════════════════════ */}
        <section className="relative min-h-[100dvh] w-full overflow-hidden">
          {/* Background media — all slides pre-rendered, cross-fade via opacity */}
          {heroSlides.map((slide, i) => (
            <motion.div
              key={i}
              className="absolute inset-0"
              initial={false}
              animate={{
                opacity: i === heroIndex ? 1 : 0,
                scale: i === heroIndex ? 1 : 1.08,
              }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              style={{ zIndex: i === heroIndex ? 1 : 0 }}
            >
              {slide.type === 'video' ? (
                <motion.video
                  ref={(el) => {
                    videoRefs.current[i] = el;
                    // React hydration bug: muted prop이 DOM에 반영되지 않는 문제 해결
                    if (el) el.muted = true;
                  }}
                  src={`${AWS_S3_DOMAIN}${slide.src}`}
                  preload="auto"
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                  style={{ y: heroParallaxY }}
                />
              ) : (
                <motion.img
                  src={slide.src}
                  alt=""
                  loading="eager"
                  className="w-full h-full object-cover"
                  style={{ y: heroParallaxY }}
                />
              )}
            </motion.div>
          ))}

          {/* Gradient overlays */}
          <div className="absolute inset-0 z-[2] bg-gradient-to-t from-brand-900/80 via-brand-900/20 to-transparent pointer-events-none" />
          <div className="absolute inset-0 z-[2] bg-gradient-to-r from-brand-900/40 to-transparent pointer-events-none" />

          {/* Hero nav arrows */}
          <button
            onClick={() =>
              setHeroIndex((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
            }
            className="absolute left-3 top-1/2 -translate-y-1/2 z-[4] p-2 active:scale-[0.9] transition-transform"
            aria-label="이전 슬라이드"
          >
            <ChevronLeft className="w-6 h-6 text-white/70" />
          </button>
          <button
            onClick={() => setHeroIndex((prev) => (prev + 1) % heroSlides.length)}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-[4] p-2 active:scale-[0.9] transition-transform"
            aria-label="다음 슬라이드"
          >
            <ChevronRight className="w-6 h-6 text-white/70" />
          </button>

          {/* Hero content */}
          <div className="absolute inset-0 z-[3] flex flex-col justify-end px-6 pb-28 pointer-events-none">
            <div className="pointer-events-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={heroIndex}
                  variants={staggerContainer}
                  initial="hidden"
                  animate="show"
                  exit="hidden"
                  className="space-y-4"
                >
                  {/* Overline */}
                  <motion.div variants={fadeUp} className="flex items-center gap-2">
                    <PulsingDot />
                    <span className="text-[11px] tracking-[0.1em] uppercase text-gold-300 font-medium">
                      {currentSlide.subtitle}
                    </span>
                  </motion.div>

                  {/* Title */}
                  <motion.h1
                    variants={fadeUp}
                    className="font-serif text-[2.5rem] leading-[1.15] tracking-tight text-white whitespace-pre-line"
                  >
                    {currentSlide.title}
                  </motion.h1>

                  {/* CTA */}
                  {currentSlide.cta && (
                    <motion.button
                      variants={fadeUp}
                      onClick={onMoveToProductPage}
                      className="mt-4 inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white/10 border border-white/20 text-white text-sm font-medium backdrop-blur-sm active:scale-[0.97] transition-transform"
                    >
                      {currentSlide.cta}
                      <ArrowRight className="w-4 h-4" />
                    </motion.button>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Slide indicator + autoplay toggle */}
              <div className="mt-8 flex items-center gap-3">
                {heroSlides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setHeroIndex(i)}
                    className="relative h-[2px] flex-1 max-w-12 bg-white/30 rounded-full overflow-hidden"
                    aria-label={`슬라이드 ${i + 1}`}
                  >
                    {i === heroIndex && (
                      <motion.div
                        key={`progress-${heroIndex}`}
                        className="absolute inset-y-0 left-0 bg-white rounded-full"
                        initial={{ width: '0%' }}
                        animate={{ width: '100%' }}
                        transition={{ duration: slideDuration, ease: 'linear' }}
                      />
                    )}
                    {i < heroIndex && <div className="absolute inset-0 bg-white rounded-full" />}
                  </button>
                ))}
                <button
                  onClick={() => setHeroAutoplay((prev) => !prev)}
                  className="ml-2 w-7 h-7 flex items-center justify-center rounded-full bg-white/10 border border-white/20 backdrop-blur-sm"
                  aria-label={heroAutoplay ? '자동 재생 정지' : '자동 재생 시작'}
                >
                  {heroAutoplay ? (
                    <Pause className="w-3 h-3 text-white" />
                  ) : (
                    <Play className="w-3 h-3 text-white ml-[1px]" />
                  )}
                </button>

                {/* Sound toggle — only for video slides with sound */}
                {currentSlide.type === 'video' && currentSlide.hasSound && (
                  <button
                    onClick={() => setIsSoundOn((prev) => !prev)}
                    className="ml-1 w-7 h-7 flex items-center justify-center rounded-full bg-white/10 border border-white/20 backdrop-blur-sm"
                    aria-label={isSoundOn ? '음소거' : '소리 켜기'}
                  >
                    {isSoundOn ? (
                      <Volume2 className="w-3 h-3 text-white" />
                    ) : (
                      <VolumeX className="w-3 h-3 text-white" />
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Scroll hint */}
          <motion.div
            className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[3]"
            animate={{ y: [0, 3, 0] }}
            transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ChevronDown className="w-6 h-6 text-white/50" strokeWidth={2} />
          </motion.div>
        </section>

        {/* ══════════════════════════════════
            SECTION 2 — Brand Introduction
            ══════════════════════════════════ */}
        <section className="relative px-6 py-20 bg-warm-50">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ margin: '-80px' }}
            className="space-y-6"
          >
            <motion.p
              variants={fadeUp}
              className="text-[11px] tracking-[0.15em] uppercase text-tea-600 font-medium"
            >
              Since 1994
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="font-serif text-[1.75rem] leading-tight tracking-tight text-brand-900"
            >
              차 한 잔에 담긴
              <br />
              지리산의 시간
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="text-[15px] leading-relaxed text-warm-500 max-w-[65ch]"
            >
              관아수제차는 경남 하동에서 유기농으로 재배한 찻잎을 전통 방식 그대로 손으로 덖어
              만듭니다. 빠르게 흘러가는 일상 속, 천천히 우려낸 한 잔이 가져다주는 고요함을 전합니다.
            </motion.p>
          </motion.div>

          <ShimmerBar />
        </section>

        {/* ══════════════════════════════════
            SECTION 3 — Brand Story (Horizontal Scroll)
            ══════════════════════════════════ */}
        <section className="py-16 bg-brand-50">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ margin: '-60px' }}
            className="px-6 mb-8"
          >
            <motion.p
              variants={fadeUp}
              className="text-[11px] tracking-[0.15em] uppercase text-brand-400 font-medium mb-3"
            >
              Our Process
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="font-serif text-[1.5rem] leading-tight tracking-tight text-brand-900"
            >
              만드는 사람의 이야기
            </motion.h2>
          </motion.div>

          <div
            className="flex gap-4 overflow-x-auto pl-6 pb-6 snap-x snap-mandatory scrollbar-hide"
            style={{ scrollPaddingLeft: '1.5rem' }}
          >
            {brandStory.map((story, i) => (
              <motion.article
                key={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{}}
                className="snap-start shrink-0 grow-0 basis-[68vw] min-w-0 space-y-3"
              >
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={story.image}
                    alt=""
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-900/50 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="text-[11px] tracking-[0.15em] text-gold-300 font-medium">
                      {story.label}
                    </span>
                    <h3 className="font-serif text-xl text-white mt-1">{story.title}</h3>
                  </div>
                </div>
                <p className="text-[13px] leading-relaxed text-warm-500">{story.text}</p>
              </motion.article>
            ))}
            {/* End spacer for last card padding */}
            <div className="shrink-0 w-2" aria-hidden="true" />
          </div>
        </section>

        {/* ══════════════════════════════════
            SECTION 4 — Popular Products
            ══════════════════════════════════ */}
        <section className="px-6 py-20 bg-white">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ margin: '-60px' }}
          >
            <motion.div variants={fadeUp} className="flex items-end justify-between mb-8">
              <div>
                <p className="text-[11px] tracking-[0.15em] uppercase text-tea-600 font-medium mb-2">
                  Best Sellers
                </p>
                <h2 className="font-serif text-[1.5rem] leading-tight tracking-tight text-brand-900">
                  지금 가장 사랑받는
                </h2>
              </div>
              <button
                onClick={onClickViewAll}
                className="flex items-center gap-1 text-[12px] text-brand-500 font-medium active:scale-[0.97] transition-transform"
              >
                전체보기
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </motion.div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-8 items-start">
              {map(popularProducts, (product) => (
                <ProductCard
                  key={product.productId}
                  product={product}
                  onClickProduct={onClickProduct}
                />
              ))}
            </div>
          </motion.div>
        </section>

        {/* ══════════════════════════════════
            SECTION 5 — Category Browse
            ══════════════════════════════════ */}
        <section className="py-16 bg-brand-50">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ margin: '-60px' }}
            className="px-6 mb-8"
          >
            <motion.p
              variants={fadeUp}
              className="text-[11px] tracking-[0.15em] uppercase text-brand-400 font-medium mb-3"
            >
              Collections
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="font-serif text-[1.5rem] leading-tight tracking-tight text-brand-900"
            >
              카테고리
            </motion.h2>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{}}
            className="space-y-4 px-6"
          >
            {categories.map((cat) => (
              <motion.button
                key={cat.id}
                variants={fadeUp}
                onClick={() => onClickCategory(cat.id)}
                className="group relative w-full h-44 rounded-2xl overflow-hidden active:scale-[0.98] transition-transform"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={cat.image}
                  alt=""
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover group-active:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-brand-900/70 via-brand-900/40 to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-center px-6">
                  <span className="text-[10px] tracking-[0.15em] uppercase text-gold-300/80 font-medium">
                    {cat.nameEn}
                  </span>
                  <h3 className="font-serif text-2xl text-white mt-1">{cat.name}</h3>
                  <p className="text-[12px] text-white/60 mt-1.5">{cat.description}</p>
                </div>
                <div className="absolute right-5 top-1/2 -translate-y-1/2">
                  <ArrowRight className="w-5 h-5 text-white/40 group-active:translate-x-1 transition-transform" />
                </div>
              </motion.button>
            ))}
          </motion.div>
        </section>

        {/* ══════════════════════════════════
            SECTION 6 — Substitute Tea Products
            ══════════════════════════════════ */}
        <section className="px-6 py-20 bg-white">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ margin: '-60px' }}
          >
            <motion.div variants={fadeUp} className="mb-8">
              <p className="text-[11px] tracking-[0.15em] uppercase text-tea-600 font-medium mb-2">
                Caffeine Free
              </p>
              <h2 className="font-serif text-[1.5rem] leading-tight tracking-tight text-brand-900">
                대용차 컬렉션
              </h2>
              <p className="text-[13px] text-warm-400 mt-2">카페인 없이 즐기는 자연의 맛</p>
            </motion.div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-8 items-start">
              {filter(productList, { categoryId: 'substituteTea' }).map((product) => (
                <ProductCard
                  key={product.productId}
                  product={product}
                  onClickProduct={onClickProduct}
                />
              ))}
            </div>
          </motion.div>
        </section>

        {/* ══════════════════════════════════
            SECTION 7 — Brand Promise / Footer CTA
            ══════════════════════════════════ */}
        <section className="relative px-6 py-24 bg-brand-900 overflow-hidden">
          {/* Background texture */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
            }}
          />

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ margin: '-60px' }}
            className="relative text-center space-y-6"
          >
            <motion.div variants={fadeUp}>
              <Leaf className="w-6 h-6 text-tea-400 mx-auto mb-4" />
            </motion.div>

            <motion.h2
              variants={fadeUp}
              className="font-serif text-[1.75rem] leading-tight tracking-tight text-white"
            >
              당신의 하루에
              <br />
              고요한 한 잔을
            </motion.h2>

            <motion.p
              variants={fadeUp}
              className="text-[13px] leading-relaxed text-warm-400 max-w-[280px] mx-auto"
            >
              지리산 자락의 정성이 담긴 차 한 잔으로 오늘 하루를 천천히 마무리해 보세요.
            </motion.p>

            <motion.button
              variants={fadeUp}
              onClick={onClickViewAll}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-gold-400 text-brand-900 text-sm font-semibold active:scale-[0.97] transition-transform"
            >
              상품 둘러보기
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </motion.div>
        </section>

        {/* Bottom spacing for mobile nav */}
        <div className="h-20 bg-brand-900" />
      </div>
    </>
  );
};

export default MainContainer;
