import { useEffect, useRef, useState } from 'react';

import { AnimatePresence, animate, motion, useMotionValue } from 'framer-motion';
import { filter, map } from 'lodash-es';
import {
  ArrowRight,
  ArrowUpRight,
  ChevronDown,
  Pause,
  Play,
  Volume2,
  VolumeX,
} from 'lucide-react';

import { ProductCard } from '@/components/common';
import { PulsingDot } from '@/components/features/main/atoms';
import {
  AWS_S3_DOMAIN,
  brandStory,
  categories,
  fadeUp,
  heroSlides,
  staggerContainer,
} from '@/constants';
import { useControllerContext, useStateContext } from '@/context/mainContext';

const MainMobileView = () => {
  const {
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
  } = useStateContext();
  const {
    setHeroIndex,
    setHeroAutoplay,
    setIsSoundOn,
    setIsHeroDragging,
    onClickProduct,
    onMoveToProductPage,
    onClickCategory,
    onClickViewAll,
  } = useControllerContext();

  const dragX = useMotionValue(0);
  const [peekIndex, setPeekIndex] = useState((heroIndex + 1) % heroSlides.length);
  const heroSectionRef = useRef<HTMLElement>(null);

  // 모든 히어로 비디오를 마운트 시점에 강제로 로드한다.
  // iOS Safari 는 preload="auto" 를 metadata 수준으로만 다뤄서 드래그시
  // 비활성 슬라이드가 빈 화면으로 보이는 문제가 있음.
  useEffect(() => {
    videoRefs.current.forEach((video) => {
      if (!video) return;
      if (video.readyState < 2) video.load();
    });
  }, [videoRefs]);

  // 히어로 터치 시 방향을 먼저 판정해서 가로로 잠기면 세로 스크롤을 차단한다.
  // + 좌측 가장자리(≤20px)에서 시작하는 터치는 iOS 뒤로가기 제스처 차단을 위해
  //   touchstart 단계에서 preventDefault 한다.
  useEffect(() => {
    const section = heroSectionRef.current;
    if (!section) return;

    const EDGE_BACK_GESTURE_PX = 20;

    let startX = 0;
    let startY = 0;
    let locked: 'horizontal' | 'vertical' | null = null;

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      const { clientX, clientY } = e.touches[0];
      if (clientX <= EDGE_BACK_GESTURE_PX) {
        // iOS 좌측 스와이프 뒤로가기 제스처 차단
        e.preventDefault();
      }
      startX = clientX;
      startY = clientY;
      locked = null;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      if (locked === 'vertical') return;
      if (locked === 'horizontal') {
        e.preventDefault();
        return;
      }
      const dx = e.touches[0].clientX - startX;
      const dy = e.touches[0].clientY - startY;
      const absDx = Math.abs(dx);
      const absDy = Math.abs(dy);
      if (absDx < 6 && absDy < 6) return;
      if (absDx > absDy) {
        locked = 'horizontal';
        e.preventDefault();
      } else {
        locked = 'vertical';
      }
    };

    section.addEventListener('touchstart', onTouchStart, { passive: false });
    section.addEventListener('touchmove', onTouchMove, { passive: false });
    return () => {
      section.removeEventListener('touchstart', onTouchStart);
      section.removeEventListener('touchmove', onTouchMove);
    };
  }, []);

  const commitSwipe = async (direction: 1 | -1) => {
    const target = direction > 0 ? -window.innerWidth : window.innerWidth;
    await animate(dragX, target, { duration: 0.32, ease: [0.32, 0.72, 0, 1] });
    dragX.set(0);
    setHeroIndex((prev) => (prev + direction + heroSlides.length) % heroSlides.length);
  };

  const handleDragStart = () => {
    setIsHeroDragging(true);
  };

  const handleDrag = (
    _: unknown,
    info: { offset: { x: number } }
  ) => {
    if (info.offset.x < -4) {
      setPeekIndex((heroIndex + 1) % heroSlides.length);
    } else if (info.offset.x > 4) {
      setPeekIndex((heroIndex - 1 + heroSlides.length) % heroSlides.length);
    }
  };

  const handleDragEnd = (
    _: unknown,
    info: { offset: { x: number }; velocity: { x: number } }
  ) => {
    setIsHeroDragging(false);
    const distanceThreshold = 80;
    const velocityThreshold = 500;
    const { offset, velocity } = info;

    if (offset.x < -distanceThreshold || velocity.x < -velocityThreshold) {
      commitSwipe(1);
    } else if (offset.x > distanceThreshold || velocity.x > velocityThreshold) {
      commitSwipe(-1);
    } else {
      animate(dragX, 0, { type: 'spring', stiffness: 320, damping: 32 });
    }
  };

  return (
    <div ref={scrollRef} className="relative w-full bg-warm-50 overflow-hidden">
      <section ref={heroSectionRef} className="relative min-h-[100dvh] w-full overflow-hidden">
        {/* Stacked slide cards — top is draggable, underneath peek stays in place */}
        {heroSlides.map((slide, i) => {
          const isActive = i === heroIndex;
          const isPeek = i === peekIndex;
          const shouldShow = isActive || isPeek;

          return (
            <motion.div
              key={i}
              className="absolute inset-0 touch-pan-y"
              style={{
                x: isActive ? dragX : 0,
                zIndex: isActive ? 3 : isPeek ? 2 : 1,
              }}
              initial={false}
              animate={{ opacity: shouldShow ? 1 : 0 }}
              transition={{ opacity: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } }}
              drag={isActive ? 'x' : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={1}
              dragMomentum={false}
              onDragStart={isActive ? handleDragStart : undefined}
              onDrag={isActive ? handleDrag : undefined}
              onDragEnd={isActive ? handleDragEnd : undefined}
            >
              {/* Media */}
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
                  className="w-full h-full object-cover pointer-events-none"
                  style={{ y: heroParallaxY }}
                />
              ) : (
                <motion.img
                  src={slide.src}
                  alt=""
                  loading="eager"
                  className="w-full h-full object-cover pointer-events-none"
                  style={{ y: heroParallaxY }}
                  draggable={false}
                />
              )}

              {/* Gradient overlays — part of each card so they travel with drag */}
              <div className="absolute inset-0 bg-gradient-to-t from-brand-900/80 via-brand-900/20 to-transparent pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-r from-brand-900/40 to-transparent pointer-events-none" />

              {/* Text content — only on active card, slides together with drag */}
              {isActive && (
                <div className="absolute inset-0 flex flex-col justify-end px-6 pb-40 pointer-events-none">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={heroIndex}
                      variants={staggerContainer}
                      initial="hidden"
                      animate="show"
                      exit="hidden"
                      className="space-y-4 pointer-events-auto"
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
                </div>
              )}
            </motion.div>
          );
        })}

        {/* Fixed UI controls — stay in place regardless of drag */}
        <div className="absolute bottom-24 left-6 right-6 z-[10] flex items-center gap-3 pointer-events-none">
          <div className="flex items-center gap-3 flex-1 pointer-events-auto">
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

        {/* Scroll hint */}
        <motion.div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[10]"
          animate={{ y: [0, 3, 0] }}
          transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-6 h-6 text-white/50" strokeWidth={2} />
        </motion.div>
      </section>

      {/* ══════════════════════════════════
          SECTION 2 — Brand Introduction
          ══════════════════════════════════ */}
      <section className="relative px-6 pt-24 pb-20 bg-warm-50">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ margin: '-80px' }}
          className="space-y-7"
        >
          <motion.div variants={fadeUp} className="flex items-center gap-3">
            <span className="font-mono text-[11px] tracking-[0.1em] text-tea-700">01</span>
            <span className="h-px flex-1 bg-brand-900/10" />
            <span className="text-[11px] tracking-[0.15em] uppercase text-warm-400">
              Since 1994
            </span>
          </motion.div>

          <motion.h2
            variants={fadeUp}
            className="text-[2.25rem] font-light leading-[1.15] tracking-tight text-brand-900 break-keep"
          >
            차 한 잔에 담긴
            <br />
            <span className="font-medium">지리산의 시간</span>
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="text-[14px] leading-[1.75] text-warm-500 break-keep max-w-[42ch]"
          >
            관아수제차는 경남 하동에서 유기농으로 재배한 찻잎을 전통 방식 그대로 손으로 덖어
            만듭니다. 빠르게 흘러가는 일상 속, 천천히 우려낸 한 잔이 가져다주는 고요함을 전합니다.
          </motion.p>

          <motion.dl
            variants={fadeUp}
            className="mt-10 grid grid-cols-3 divide-x divide-brand-900/10"
          >
            <div className="px-1">
              <dd className="font-mono text-[1.5rem] font-light text-brand-900 tracking-tight">
                1994
              </dd>
              <dt className="mt-1 text-[10px] tracking-[0.15em] uppercase text-warm-400">
                Founded
              </dt>
            </div>
            <div className="pl-4 pr-1">
              <dd className="text-[1.5rem] font-light text-brand-900 tracking-tight">하동</dd>
              <dt className="mt-1 text-[10px] tracking-[0.15em] uppercase text-warm-400">
                Origin
              </dt>
            </div>
            <div className="pl-4">
              <dd className="text-[1.5rem] font-light text-brand-900 tracking-tight">유기농</dd>
              <dt className="mt-1 text-[10px] tracking-[0.15em] uppercase text-warm-400">
                Organic
              </dt>
            </div>
          </motion.dl>
        </motion.div>
      </section>

      {/* ══════════════════════════════════
          SECTION 3 — Brand Story (Horizontal Scroll)
          ══════════════════════════════════ */}
      <section className="py-20 bg-warm-100/60 border-y border-brand-900/5">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ margin: '-60px' }}
          className="px-6 mb-10"
        >
          <motion.div variants={fadeUp} className="flex items-center gap-3 mb-5">
            <span className="font-mono text-[11px] tracking-[0.1em] text-tea-700">02</span>
            <span className="h-px w-10 bg-brand-900/15" />
            <span className="text-[11px] tracking-[0.15em] uppercase text-warm-400">
              Our Process
            </span>
          </motion.div>
          <motion.h2
            variants={fadeUp}
            className="text-[1.75rem] font-light leading-tight tracking-tight text-brand-900 break-keep"
          >
            손끝에서 <span className="font-medium">완성되는 차</span>
          </motion.h2>
        </motion.div>

        <div
          className="flex gap-4 overflow-x-auto pl-6 pb-4 snap-x snap-mandatory scrollbar-hide"
          style={{ scrollPaddingLeft: '1.5rem' }}
        >
          {brandStory.map((story, i) => (
            <motion.article
              key={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{}}
              className="snap-start shrink-0 grow-0 basis-[72vw] min-w-0"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-brand-900/5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={story.image}
                  alt=""
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
              <div className="mt-4 flex items-baseline gap-3">
                <span className="font-mono text-[11px] text-tea-700">{story.label}</span>
                <h3 className="text-[16px] font-medium text-brand-900 tracking-tight">
                  {story.title}
                </h3>
              </div>
              <p className="mt-2 text-[13px] leading-[1.7] text-warm-500 break-keep pr-4">
                {story.text}
              </p>
            </motion.article>
          ))}
          <div className="shrink-0 w-2" aria-hidden="true" />
        </div>
      </section>

      {/* ══════════════════════════════════
          SECTION 4 — Popular Products
          ══════════════════════════════════ */}
      <section className="px-6 pt-20 pb-16 bg-warm-50">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ margin: '-60px' }}
        >
          <motion.div variants={fadeUp} className="flex items-center gap-3 mb-5">
            <span className="font-mono text-[11px] tracking-[0.1em] text-tea-700">03</span>
            <span className="h-px flex-1 bg-brand-900/10" />
            <button
              onClick={onClickViewAll}
              className="inline-flex items-center gap-1 text-[11px] tracking-[0.1em] uppercase text-warm-500 active:text-brand-900 transition-colors"
            >
              All
              <ArrowUpRight className="w-3 h-3" strokeWidth={1.5} />
            </button>
          </motion.div>

          <motion.h2
            variants={fadeUp}
            className="text-[1.75rem] font-light leading-tight tracking-tight text-brand-900 break-keep mb-10"
          >
            지금 <span className="font-medium">가장 사랑받는</span>
          </motion.h2>

          <div className="grid grid-cols-2 gap-x-4 gap-y-10 items-start">
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
          SECTION 5 — Category Browse (Editorial List)
          ══════════════════════════════════ */}
      <section className="bg-warm-50 px-6 pb-20">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ margin: '-60px' }}
        >
          <motion.div variants={fadeUp} className="flex items-center gap-3 mb-5 pt-4">
            <span className="font-mono text-[11px] tracking-[0.1em] text-tea-700">04</span>
            <span className="h-px flex-1 bg-brand-900/10" />
            <span className="text-[11px] tracking-[0.15em] uppercase text-warm-400">
              Collections
            </span>
          </motion.div>

          <motion.h2
            variants={fadeUp}
            className="text-[1.75rem] font-light leading-tight tracking-tight text-brand-900 mb-8"
          >
            카테고리 <span className="font-medium">둘러보기</span>
          </motion.h2>

          <motion.ul
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{}}
            className="divide-y divide-brand-900/10 border-y border-brand-900/10"
          >
            {categories.map((cat) => (
              <motion.li key={cat.id} variants={fadeUp}>
                <button
                  onClick={() => onClickCategory(cat.id)}
                  className="group flex w-full items-center gap-4 py-5 active:bg-brand-900/[0.02] transition-colors"
                >
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-sm bg-brand-900/5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={cat.image}
                      alt=""
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-mono text-[10px] tracking-[0.15em] uppercase text-warm-400">
                      {cat.nameEn}
                    </div>
                    <div className="mt-0.5 text-[17px] font-medium text-brand-900 tracking-tight">
                      {cat.name}
                    </div>
                    <div className="mt-1 text-[12px] text-warm-500 break-keep">
                      {cat.description}
                    </div>
                  </div>
                  <ArrowRight
                    className="h-4 w-4 shrink-0 text-warm-400 group-active:translate-x-0.5 group-active:text-brand-900 transition-all"
                    strokeWidth={1.5}
                  />
                </button>
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>
      </section>

      {/* ══════════════════════════════════
          SECTION 6 — Substitute Tea Products
          ══════════════════════════════════ */}
      <section className="px-6 pt-20 pb-16 bg-warm-100/50">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ margin: '-60px' }}
        >
          <motion.div variants={fadeUp} className="flex items-center gap-3 mb-5">
            <span className="font-mono text-[11px] tracking-[0.1em] text-tea-700">05</span>
            <span className="h-px flex-1 bg-brand-900/10" />
            <span className="text-[11px] tracking-[0.15em] uppercase text-warm-400">
              Caffeine Free
            </span>
          </motion.div>

          <motion.h2
            variants={fadeUp}
            className="text-[1.75rem] font-light leading-tight tracking-tight text-brand-900 break-keep"
          >
            카페인 없이,
            <br />
            <span className="font-medium">대용차 컬렉션</span>
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="mt-3 text-[13px] leading-[1.7] text-warm-500 mb-10"
          >
            늦은 오후에도 부담 없이 즐기는 자연의 맛.
          </motion.p>

          <div className="grid grid-cols-2 gap-x-4 gap-y-10 items-start">
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
      <section className="relative px-6 py-28 bg-warm-50 overflow-hidden">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ margin: '-60px' }}
          className="relative mx-auto max-w-[400px] space-y-7"
        >
          <motion.div variants={fadeUp} className="flex items-center gap-3">
            <span className="font-mono text-[11px] tracking-[0.1em] text-tea-700">06</span>
            <span className="h-px flex-1 bg-brand-900/10" />
          </motion.div>

          <motion.h2
            variants={fadeUp}
            className="text-[2rem] font-light leading-[1.2] tracking-tight text-brand-900 break-keep"
          >
            당신의 하루에
            <br />
            <span className="font-medium">고요한 한 잔을</span>
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="text-[13px] leading-[1.8] text-warm-500 break-keep max-w-[32ch]"
          >
            지리산 자락의 정성이 담긴 차 한 잔으로 오늘 하루를 천천히 마무리해 보세요.
          </motion.p>

          <motion.button
            variants={fadeUp}
            onClick={onClickViewAll}
            className="group inline-flex items-center gap-3 border-b border-brand-900 pb-1.5 text-[14px] font-medium text-brand-900 active:-translate-y-px transition-transform"
          >
            상품 전체 둘러보기
            <ArrowRight
              className="h-4 w-4 group-active:translate-x-0.5 transition-transform"
              strokeWidth={1.5}
            />
          </motion.button>
        </motion.div>
      </section>

      {/* Bottom spacing for mobile nav */}
      <div className="h-20 bg-warm-50" />
    </div>
  );
};

export default MainMobileView;
