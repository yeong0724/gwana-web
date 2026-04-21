import { useState } from 'react';

import { AnimatePresence, animate, motion, useMotionValue } from 'framer-motion';
import { filter, map } from 'lodash-es';
import {
  ArrowRight,
  ArrowUpRight,
  ChevronDown,
  Leaf,
  Pause,
  Play,
  Volume2,
  VolumeX,
} from 'lucide-react';

import { ProductCard } from '@/components/common';
import { PulsingDot, ShimmerBar } from '@/components/features/main/atoms';
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
      <section className="relative min-h-[100dvh] w-full overflow-hidden">
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
              dragElastic={0.55}
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
  );
};

export default MainMobileView;
