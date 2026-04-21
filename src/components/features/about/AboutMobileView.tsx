'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, ChevronDown } from 'lucide-react';

import { AWS_S3_DOMAIN } from '@/constants';

gsap.registerPlugin(ScrollTrigger);

const AboutMobileView = () => {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  /* ── Hero pinned section ── */
  const heroRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const content1Ref = useRef<HTMLDivElement>(null);
  const content2Ref = useRef<HTMLDivElement>(null);

  /* ── Viewport height tracking (mobile browser UI) ── */
  const [viewportHeight, setViewportHeight] = useState<number | null>(null);
  const [isHeroPinned, setIsHeroPinned] = useState(true);
  const isKakaoRef = useRef(false);
  const isReturningRef = useRef(false);

  const updateViewport = useCallback(() => {
    if (!isHeroPinned) return;
    const height = window.visualViewport?.height ?? window.innerHeight;
    setViewportHeight(height);
  }, [isHeroPinned]);

  useEffect(() => {
    isKakaoRef.current = /KAKAOTALK/i.test(navigator.userAgent);
    if (!isHeroPinned) return;

    updateViewport();
    window.addEventListener('resize', updateViewport);

    const visualViewport = window.visualViewport;
    if (visualViewport) {
      visualViewport.addEventListener('resize', updateViewport);
    }

    let scrollThrottleTimer: NodeJS.Timeout | null = null;
    const handleScroll = () => {
      if (!isKakaoRef.current || scrollThrottleTimer) return;
      scrollThrottleTimer = setTimeout(() => {
        scrollThrottleTimer = null;
        updateViewport();
      }, 1000);
    };

    if (isKakaoRef.current) {
      window.addEventListener('scroll', handleScroll, { passive: true });
    }

    return () => {
      window.removeEventListener('resize', updateViewport);
      if (visualViewport) {
        visualViewport.removeEventListener('resize', updateViewport);
      }
      if (isKakaoRef.current) {
        window.removeEventListener('scroll', handleScroll);
        if (scrollThrottleTimer) clearTimeout(scrollThrottleTimer);
      }
    };
  }, [updateViewport, isHeroPinned]);

  /* ── Phase 1 elements ── */
  const phase1BgRef = useRef<HTMLDivElement>(null);
  const phase1LineRef = useRef<HTMLDivElement>(null);
  const phase1OverlineRef = useRef<HTMLDivElement>(null);
  const phase1TitleRef = useRef<HTMLHeadingElement>(null);
  const phase1Sub1Ref = useRef<HTMLParagraphElement>(null);
  const phase1Sub2Ref = useRef<HTMLParagraphElement>(null);

  /* ── Phase 2 elements ── */
  const phase2BgRef = useRef<HTMLDivElement>(null);
  const phase2OverlineRef = useRef<HTMLDivElement>(null);
  const phase2TitleRef = useRef<HTMLHeadingElement>(null);
  const phase2TextRef = useRef<HTMLParagraphElement>(null);
  const phase2ButtonRef = useRef<HTMLButtonElement>(null);
  const arrowRef = useRef<HTMLDivElement>(null);
  const chevronDownRef = useRef<HTMLDivElement>(null);

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* ━━━ Phase 1: Entry animation ━━━ */
      const phase1Els = [
        phase1LineRef.current,
        phase1OverlineRef.current,
        phase1TitleRef.current,
        phase1Sub1Ref.current,
        phase1Sub2Ref.current,
      ];

      gsap.set(phase1Els, { opacity: 0, y: 30 });
      gsap.set(phase1LineRef.current, { scaleY: 0 });

      const entryTl = gsap.timeline({ delay: 0.3 });
      entryTl
        .to(phase1LineRef.current, {
          opacity: 1,
          scaleY: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
        })
        .to(
          phase1OverlineRef.current,
          { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
          '-=0.3'
        )
        .to(
          phase1TitleRef.current,
          { opacity: 1, y: 0, duration: 1, ease: 'power2.out' },
          '-=0.3'
        )
        .to(
          phase1Sub1Ref.current,
          { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' },
          '-=0.5'
        )
        .to(
          phase1Sub2Ref.current,
          { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' },
          '-=0.4'
        );

      /* ━━━ ScrollTrigger timeline ━━━ */
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: heroRef.current,
          start: window.innerWidth >= 1024 ? 'top 94px' : '',
          end: '+=400%',
          pin: true,
          scrub: 0.5,
          onLeave: () => setIsHeroPinned(false),
          onEnterBack: () => {
            if (isKakaoRef.current) {
              isReturningRef.current = true;
              setTimeout(() => {
                isReturningRef.current = false;
              }, 500);
            }
            setIsHeroPinned(true);
          },
        },
      });

      // Hold phase 1
      tl.to({}, { duration: 1 });

      // Phase 1 → 2 transition
      tl.to(content1Ref.current, {
        opacity: 0,
        duration: 0.8,
        ease: 'power2.inOut',
      })
        .to(
          phase1BgRef.current,
          { opacity: 0, duration: 2, ease: 'power1.inOut' },
          '<'
        )
        .to(
          overlayRef.current,
          { opacity: 0.5, duration: 2, ease: 'power1.inOut' },
          '<'
        )
        .to(
          phase2BgRef.current,
          { opacity: 1, duration: 2, ease: 'power1.inOut' },
          '<'
        );

      /* ━━━ Phase 2: Second content ━━━ */
      const phase2Els = [
        phase2OverlineRef.current,
        phase2TitleRef.current,
        phase2TextRef.current,
        phase2ButtonRef.current,
      ];

      gsap.set(phase2Els, { opacity: 0, y: 30 });

      tl.to(phase2OverlineRef.current, { opacity: 1, y: 0, duration: 0.5 })
        .to(phase2TitleRef.current, { opacity: 1, y: 0, duration: 0.5 })
        .to(phase2TextRef.current, { opacity: 1, y: 0, duration: 0.5 })
        .to(phase2ButtonRef.current, { opacity: 1, y: 0, duration: 0.5 });

      // Arrow bounce
      gsap.to(arrowRef.current, {
        x: 3,
        duration: 0.5,
        ease: 'power1.inOut',
        repeat: -1,
        yoyo: true,
      });

      // Chevron bounce
      gsap.to(chevronDownRef.current, {
        y: 2.5,
        duration: 0.8,
        ease: 'power1.inOut',
        repeat: -1,
        yoyo: true,
      });

      // Hold phase 2
      tl.to({}, { duration: 1 });

      // Phase 2 → scroll sections
      tl.to(content2Ref.current, { opacity: 0, duration: 0.5 }).to(
        overlayRef.current,
        { opacity: 0.95, duration: 0.5 },
        '<'
      );

      /* ━━━ Scroll sections: fade-in reveals ━━━ */
      const fadeSections = document.querySelectorAll('.about-fade-section');
      fadeSections.forEach((section) => {
        gsap.from(section, {
          opacity: 0,
          y: 60,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 70%',
            end: 'top 35%',
            toggleActions: 'play none none reverse',
          },
        });
      });

      setIsReady(true);
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // ScrollTrigger refresh on viewport height change
  useEffect(() => {
    if (viewportHeight && isHeroPinned && !isReturningRef.current) {
      const timeoutId = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [viewportHeight, isHeroPinned]);

  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    router.prefetch('/product?category=all');
  }, [router]);

  return (
    <div ref={containerRef} className="lg:hidden">
      {/* ═══════════════════════════════════════
          HERO — Pinned cinematic section
         ═══════════════════════════════════════ */}
      <div
        ref={heroRef}
        className="relative w-full overflow-hidden about-grain"
        style={{
          height: viewportHeight ? `${viewportHeight}px` : '100dvh',
        }}
      >
        {/* Background — Phase 1 */}
        <div
          ref={phase1BgRef}
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('${AWS_S3_DOMAIN}images/about/mobile/gwana_about_01.webp')`,
          }}
        />

        {/* Background — Phase 2 */}
        <div
          ref={phase2BgRef}
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('${AWS_S3_DOMAIN}images/about/mobile/gwana_about_02.webp')`,
            opacity: 0,
          }}
        />

        {/* Dark overlay */}
        <div ref={overlayRef} className="absolute inset-0 bg-black" style={{ opacity: 0.35 }} />

        {/* ── Phase 1 content ── */}
        <div
          ref={content1Ref}
          className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-8"
        >
          {/* Gold vertical line */}
          <div
            ref={phase1LineRef}
            className="w-px h-14 bg-gradient-to-b from-transparent via-gold-400 to-gold-400/30 mb-6 origin-top"
          />

          {/* Overline */}
          <div
            ref={phase1OverlineRef}
            className="text-[10px] tracking-[0.3em] text-gold-300/90 mb-6 uppercase font-medium"
            style={{ opacity: 0 }}
          >
            Since 1994
          </div>

          {/* Title */}
          <h1
            ref={phase1TitleRef}
            className="font-family-serif text-[42px] leading-[1] tracking-[-0.01em] mb-10"
            style={{ opacity: 0 }}
          >
            From Hadong,
            <br />
            with Care
          </h1>

          {/* Subtitle */}
          <p
            ref={phase1Sub1Ref}
            className="text-[16px] leading-relaxed text-white/80 tracking-wider mb-3"
            style={{ opacity: 0 }}
          >
            관아수제차는 1994년부터
            <br />
            하동에서 차를 만들어 왔습니다.
          </p>
          <p
            ref={phase1Sub2Ref}
            className="text-[15px] leading-relaxed text-white/60 tracking-wider"
            style={{ opacity: 0 }}
          >
            빠르게 변화하는 흐름 속에서도
            <br />
            차와 함께한 시간이 만든
            <br />
            자신만의 방식을 지켜오고 있습니다.
          </p>
        </div>

        {/* ── Phase 2 content ── */}
        <div
          ref={content2Ref}
          className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-8"
        >
          <div
            ref={phase2OverlineRef}
            className="text-[10px] tracking-[0.3em] text-gold-300/80 mb-5 uppercase font-medium"
            style={{ opacity: 0 }}
          >
            Heritage
          </div>

          <h2
            ref={phase2TitleRef}
            className="text-[20px] leading-snug mb-8 tracking-wider"
            style={{ opacity: 0 }}
          >
            농약이나 화학비료에 의존하지 않고
            <br />
            오직 자연 그대로 기른 찻잎
          </h2>

          <p
            ref={phase2TextRef}
            className="text-[17px] leading-relaxed text-white/70 tracking-wider mb-16"
            style={{ opacity: 0 }}
          >
            세대를 거쳐 이어온 기준으로
            <br />
            자연과 전통을 지켜온 차.
            <br />
            <span className="block mt-4 text-white/50">
              하동의 자연과 계절의 흐름을
              <br />차 한 잔에 담았습니다.
            </span>
          </p>

          <button
            ref={phase2ButtonRef}
            className="flex items-center gap-3 group"
            style={{ opacity: 0 }}
            onClick={(e) => {
              const button = e.currentTarget;
              gsap.to(button, {
                scale: 0.8,
                duration: 0.1,
                yoyo: true,
                repeat: 1,
                ease: 'power2.inOut',
                onComplete: () => {
                  router.push('/product?category=all');
                },
              });
            }}
          >
            <span className="text-[15px] tracking-wider border-b border-white/30 pb-1">
              제품 보러가기
            </span>
            <div ref={arrowRef}>
              <ArrowRight className="w-4 h-4 text-gold-400" />
            </div>
          </button>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1">
          <div ref={chevronDownRef}>
            <ChevronDown className="w-7 h-7 text-white/50" strokeWidth={2.5} />
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════
          SCROLL SECTIONS — Content below hero
         ═══════════════════════════════════════ */}
      <div
        className="transition-opacity duration-300"
        style={{ opacity: isReady ? 1 : 0 }}
      >
        {/* ── Section: Heritage (계절을 기준으로 한 차) ── */}
        <div
          className="about-grain"
          style={{ background: 'linear-gradient(180deg, #0a0a0a 0%, #000000 100%)' }}
        >
          <div className="max-w-lg mx-auto px-6 py-20">
            <section className="about-fade-section text-center">
              {/* Gold line */}
              <div className="flex justify-center mb-6">
                <div className="w-px h-10 bg-gradient-to-b from-transparent via-gold-400 to-gold-400/30" />
              </div>
              <div className="text-[10px] tracking-[0.3em] text-gold-400/70 uppercase mb-4 font-medium">
                Heritage
              </div>
              <h2 className="text-[24px] font-semibold text-white mb-8 tracking-wide">
                계절을 기준으로 한 차
              </h2>
              <div className="space-y-2 text-[15px] text-white/60 leading-loose tracking-wider">
                <p>차는 계절에 따라 달라집니다.</p>
                <p>봄에는 녹차를 만들고,</p>
                <p>여름 · 가을 · 겨울에는</p>
                <p>계절에 어울리는 대용차를 준비합니다.</p>
                <p className="pt-3 text-white/40">자연의 흐름에 맞춰</p>
                <p className="text-white/40">무리하지 않는 방식을 지켜갑니다.</p>
              </div>
            </section>

            {/* Image */}
            <section className="about-fade-section mt-12">
              <div className="relative">
                <Image
                  src={`${AWS_S3_DOMAIN}images/about/web/about_web_2_1.webp`}
                  alt="계절의 차"
                  width={480}
                  height={580}
                  className="w-full h-auto object-cover"
                  sizes="(max-width: 768px) 90vw, 480px"
                />
                {/* Small circle image */}
                <div className="absolute -bottom-8 -right-2 w-24 h-24">
                  <Image
                    src={`${AWS_S3_DOMAIN}images/about/web/about_web_2_2.webp`}
                    alt="찻잎 클로즈업"
                    width={120}
                    height={120}
                    className="w-full h-full object-cover rounded-full ring-3 ring-brand-900/80"
                    sizes="96px"
                  />
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* ── Section: Philosophy (사람과 사람을 잇는 마음) ── */}
        <div className="bg-warm-50">
          <div className="max-w-lg mx-auto px-6 py-20">
            <section className="about-fade-section">
              {/* Two images side by side */}
              <div className="flex gap-3 mb-12">
                <div className="flex-1 overflow-hidden">
                  <Image
                    src={`${AWS_S3_DOMAIN}images/about/web/about_web_3_1.webp`}
                    alt="차를 마시는 사람"
                    width={250}
                    height={175}
                    className="w-full h-auto object-cover"
                    sizes="45vw"
                  />
                </div>
                <div className="flex-1 overflow-hidden mt-6">
                  <Image
                    src={`${AWS_S3_DOMAIN}images/about/web/about_web_3_2.webp`}
                    alt="차를 따르는 모습"
                    width={250}
                    height={175}
                    className="w-full h-auto object-cover"
                    sizes="45vw"
                  />
                </div>
              </div>
            </section>

            <section className="about-fade-section text-center">
              {/* Decorative rule */}
              <div className="about-hr mb-10">
                <span className="text-gold-400/50 text-sm font-family-serif">✦</span>
              </div>

              <div className="text-[10px] tracking-[0.25em] text-brand-400 uppercase mb-3 font-medium">
                Philosophy
              </div>
              <h2 className="text-[22px] font-semibold text-brand-900 mb-8 tracking-wide">
                사람과 사람을 잇는 마음
              </h2>
              <div className="space-y-2 text-[14px] text-brand-600 leading-loose tracking-wider">
                <p>관아수제차는</p>
                <p>사람과 사람 사이의 정을</p>
                <p>소중히 여깁니다.</p>
                <p className="pt-2 text-brand-400">차 한 잔이 대화를 만들고</p>
                <p className="text-brand-400">인연을 이어주는 매개가 되기를</p>
                <p className="text-brand-400">바랍니다.</p>
              </div>
            </section>
          </div>
        </div>

        {/* ── Section: Experience (찻집에서 경험하는 티코스) ── */}
        <div className="bg-white">
          <div className="max-w-lg mx-auto px-6 py-20">
            <section className="about-fade-section">
              {/* Three images in a staggered row */}
              <div className="flex gap-2 mb-12">
                <div className="flex-1 overflow-hidden">
                  <Image
                    src={`${AWS_S3_DOMAIN}images/about/web/about_web_4_1.webp`}
                    alt="티코스 1"
                    width={200}
                    height={150}
                    className="w-full h-auto object-cover"
                    sizes="30vw"
                  />
                </div>
                <div className="flex-1 overflow-hidden mt-4">
                  <Image
                    src={`${AWS_S3_DOMAIN}images/about/web/about_web_4_2.webp`}
                    alt="티코스 2"
                    width={200}
                    height={150}
                    className="w-full h-auto object-cover"
                    sizes="30vw"
                  />
                </div>
                <div className="flex-1 overflow-hidden mt-8">
                  <Image
                    src={`${AWS_S3_DOMAIN}images/about/web/about_web_4_3.webp`}
                    alt="티코스 3"
                    width={200}
                    height={150}
                    className="w-full h-auto object-cover"
                    sizes="30vw"
                  />
                </div>
              </div>
            </section>

            <section className="about-fade-section text-center">
              <div className="about-hr mb-10">
                <span className="text-gold-400/50 text-sm font-family-serif">✦</span>
              </div>

              <div className="text-[10px] tracking-[0.25em] text-brand-400 uppercase mb-3 font-medium">
                Experience
              </div>
              <h2 className="text-[22px] font-semibold text-brand-900 mb-8 tracking-wide">
                찻집에서 경험하는 티코스
              </h2>
              <div className="space-y-2 text-[14px] text-brand-600 leading-loose tracking-wider">
                <p>한국차를 천천히 경험할 수 있는</p>
                <p>티코스를 운영하고 있습니다.</p>
                <p className="pt-2 text-brand-400">차를 처음 접하는 분도</p>
                <p className="text-brand-400">부담 없이 즐길 수 있도록</p>
                <p className="text-brand-400">구성합니다.</p>
              </div>
            </section>
          </div>
        </div>

        {/* ── Section: Garden (차밭에서 보내는 소풍) ── */}
        <div className="bg-brand-50">
          <div className="max-w-lg mx-auto px-6 py-20">
            <section className="about-fade-section">
              <div className="flex gap-3 mb-12">
                <div className="flex-1 overflow-hidden">
                  <Image
                    src={`${AWS_S3_DOMAIN}images/about/web/about_web_5_1.webp`}
                    alt="차밭 풍경"
                    width={250}
                    height={175}
                    className="w-full h-auto object-cover"
                    sizes="45vw"
                  />
                </div>
                <div className="flex-1 overflow-hidden mt-5">
                  <Image
                    src={`${AWS_S3_DOMAIN}images/about/web/about_web_5_2.webp`}
                    alt="차밭 소풍"
                    width={250}
                    height={175}
                    className="w-full h-auto object-cover"
                    sizes="45vw"
                  />
                </div>
              </div>
            </section>

            <section className="about-fade-section text-center">
              <div className="about-hr mb-10">
                <span className="text-gold-400/50 text-sm font-family-serif">✦</span>
              </div>

              <div className="text-[10px] tracking-[0.25em] text-brand-400 uppercase mb-3 font-medium">
                Tea Field
              </div>
              <h2 className="text-[22px] font-semibold text-brand-900 mb-8 tracking-wide">
                차밭에서 보내는 소풍
              </h2>
              <div className="space-y-2 text-[14px] text-brand-600 leading-loose tracking-wider">
                <p>하동의 차밭을 천천히 걸으며</p>
                <p>자연 속에서 차를 마시는</p>
                <p>소풍 프로그램을 운영하고 있습니다.</p>
                <p className="pt-2 text-brand-400">차가 자라는 공간에서의 경험이</p>
                <p className="text-brand-400">차를 조금 더 가깝게</p>
                <p className="text-brand-400">만들어주기를 바랍니다.</p>
              </div>
            </section>
          </div>
        </div>

        {/* ── Closing Section ── */}
        <div className="relative about-grain">
          <div className="relative w-full min-h-[70vh]">
            <Image
              src={`${AWS_S3_DOMAIN}images/about/web/about_web_6.webp`}
              alt="하동 차밭"
              fill
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/30" />

            <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-8">
              <section className="about-fade-section">
                {/* Gold line */}
                <div className="flex justify-center mb-6">
                  <div className="w-px h-10 bg-gradient-to-b from-transparent via-gold-400 to-gold-400/30" />
                </div>

                <h2 className="font-family-serif text-[32px] tracking-wider mb-10 leading-tight">
                  From Hadong,
                  <br />
                  with Care
                </h2>

                <div className="space-y-2 text-[14px] text-white/75 leading-relaxed tracking-wider">
                  <p>관아수제차는</p>
                  <p>화려함보다 편안함을,</p>
                  <p>강한 인상보다 오래 남는 여운을</p>
                  <p>생각합니다.</p>
                </div>

                <div className="mt-10 space-y-2 text-[15px] text-white/90 leading-relaxed tracking-wider">
                  <p>손이 자주 가는 이유가 있는 차,</p>
                  <p>사람과 사람을 이어주는 차를</p>
                  <p>오늘도 하동에서 만들고 있습니다.</p>
                </div>

                {/* Gold line bottom */}
                <div className="flex justify-center mt-10">
                  <div className="w-px h-10 bg-gradient-to-t from-transparent via-gold-400 to-gold-400/30" />
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutMobileView;
