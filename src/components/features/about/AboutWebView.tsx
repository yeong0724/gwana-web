'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { AWS_S3_DOMAIN } from '@/constants';

gsap.registerPlugin(ScrollTrigger);

const AboutWebView = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  /* ── Hero refs ── */
  const heroRef = useRef<HTMLElement>(null);
  const heroBgRef = useRef<HTMLDivElement>(null);
  const heroLineRef = useRef<HTMLDivElement>(null);
  const heroOverlineRef = useRef<HTMLDivElement>(null);
  const heroTitleRef = useRef<HTMLHeadingElement>(null);
  const heroSub1Ref = useRef<HTMLDivElement>(null);
  const heroSub2Ref = useRef<HTMLDivElement>(null);

  /* ── Heritage refs ── */
  const heritageRef = useRef<HTMLElement>(null);
  const heritageYearRef = useRef<HTMLDivElement>(null);
  const heritageImgRef = useRef<HTMLDivElement>(null);
  const heritageCircleRef = useRef<HTMLDivElement>(null);
  const heritageTextRef = useRef<HTMLDivElement>(null);

  /* ── Philosophy refs ── */
  const philoRef = useRef<HTMLElement>(null);
  const philoTitleRef = useRef<HTMLDivElement>(null);
  const philoBodyRef = useRef<HTMLDivElement>(null);
  const philoImg1Ref = useRef<HTMLDivElement>(null);
  const philoImg2Ref = useRef<HTMLDivElement>(null);

  /* ── Experience refs ── */
  const expRef = useRef<HTMLElement>(null);
  const expTitleRef = useRef<HTMLDivElement>(null);
  const expBodyRef = useRef<HTMLDivElement>(null);
  const expImg1Ref = useRef<HTMLDivElement>(null);
  const expImg2Ref = useRef<HTMLDivElement>(null);
  const expImg3Ref = useRef<HTMLDivElement>(null);

  /* ── Garden refs ── */
  const gardenRef = useRef<HTMLElement>(null);
  const gardenImg1Ref = useRef<HTMLDivElement>(null);
  const gardenImg2Ref = useRef<HTMLDivElement>(null);
  const gardenTextRef = useRef<HTMLDivElement>(null);

  /* ── Closing refs ── */
  const closingRef = useRef<HTMLElement>(null);
  const closingTextRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       *  HERO — cinematic entry
       * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
      const heroEls = [
        heroLineRef.current,
        heroOverlineRef.current,
        heroTitleRef.current,
        heroSub1Ref.current,
        heroSub2Ref.current,
      ];

      gsap.set(heroEls, { opacity: 0, y: 40 });
      gsap.set(heroLineRef.current, { scaleY: 0 });

      const entryTl = gsap.timeline({ delay: 0.4 });
      entryTl
        .to(heroLineRef.current, {
          opacity: 1,
          scaleY: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
        })
        .to(
          heroOverlineRef.current,
          { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
          '-=0.5'
        )
        .to(
          heroTitleRef.current,
          { opacity: 1, y: 0, duration: 1.2, ease: 'power2.out' },
          '-=0.4'
        )
        .to(
          heroSub1Ref.current,
          { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
          '-=0.6'
        )
        .to(
          heroSub2Ref.current,
          { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
          '-=0.5'
        );

      // Background slow zoom on scroll
      gsap.to(heroBgRef.current, {
        scale: 1.15,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });

      // Hero content fade-out on scroll
      gsap.fromTo(
        heroEls,
        { opacity: 1, y: 0 },
        {
          opacity: 0,
          y: -60,
          ease: 'none',
          scrollTrigger: {
            trigger: heroRef.current,
            start: '25% top',
            end: '65% top',
            scrub: 0.5,
          },
        }
      );

      /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       *  HERITAGE — 1994 story
       * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
      if (heritageRef.current) {
        // Large year watermark
        gsap.fromTo(
          heritageYearRef.current,
          { y: 80, opacity: 0 },
          {
            y: 0,
            opacity: 0.06,
            scrollTrigger: {
              trigger: heritageRef.current,
              start: 'top 80%',
              end: 'top 20%',
              scrub: 1.5,
            },
          }
        );

        // Image — curtain reveal (clip-path)
        gsap.fromTo(
          heritageImgRef.current,
          { clipPath: 'inset(0 0 100% 0)' },
          {
            clipPath: 'inset(0 0 0% 0)',
            ease: 'power3.out',
            scrollTrigger: {
              trigger: heritageRef.current,
              start: 'top 65%',
              end: 'top 15%',
              scrub: 2,
            },
          }
        );

        // Circle image — scale + fade
        gsap.fromTo(
          heritageCircleRef.current,
          { scale: 0.6, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: heritageRef.current,
              start: 'top 50%',
              end: 'top 10%',
              scrub: 2,
            },
          }
        );

        // Text stagger
        if (heritageTextRef.current) {
          gsap.fromTo(
            Array.from(heritageTextRef.current.children),
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              stagger: 0.12,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: heritageTextRef.current,
                start: 'top 80%',
                end: 'top 40%',
                scrub: 1,
              },
            }
          );
        }
      }

      /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       *  PHILOSOPHY — heart & connection
       * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
      if (philoRef.current) {
        // Images parallax from sides
        gsap.fromTo(
          philoImg1Ref.current,
          { x: -120, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: philoRef.current,
              start: 'top 70%',
              end: 'top 25%',
              scrub: 1.5,
            },
          }
        );

        gsap.fromTo(
          philoImg2Ref.current,
          { x: 120, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: philoRef.current,
              start: 'top 70%',
              end: 'top 25%',
              scrub: 1.5,
            },
          }
        );

        // Title
        gsap.fromTo(
          philoTitleRef.current,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: philoTitleRef.current,
              start: 'top 85%',
              end: 'top 55%',
              scrub: 1,
            },
          }
        );

        // Body
        gsap.fromTo(
          philoBodyRef.current,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: philoBodyRef.current,
              start: 'top 85%',
              end: 'top 55%',
              scrub: 1,
            },
          }
        );
      }

      /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       *  EXPERIENCE — tea course
       * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
      if (expRef.current) {
        // Images stagger from bottom
        const expImgs = [expImg1Ref.current, expImg2Ref.current, expImg3Ref.current];
        gsap.fromTo(
          expImgs,
          { y: 80, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.15,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: expRef.current,
              start: 'top 70%',
              end: 'top 25%',
              scrub: 1.5,
            },
          }
        );

        // Text
        gsap.fromTo(
          expTitleRef.current,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: expTitleRef.current,
              start: 'top 85%',
              end: 'top 55%',
              scrub: 1,
            },
          }
        );

        gsap.fromTo(
          expBodyRef.current,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: expBodyRef.current,
              start: 'top 85%',
              end: 'top 55%',
              scrub: 1,
            },
          }
        );
      }

      /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       *  GARDEN — tea field picnic
       * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
      if (gardenRef.current) {
        gsap.fromTo(
          gardenImg1Ref.current,
          { x: -100, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: gardenRef.current,
              start: 'top 70%',
              end: 'top 30%',
              scrub: 1.5,
            },
          }
        );

        gsap.fromTo(
          gardenImg2Ref.current,
          { x: 100, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: gardenRef.current,
              start: 'top 70%',
              end: 'top 30%',
              scrub: 1.5,
            },
          }
        );

        gsap.fromTo(
          gardenTextRef.current,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: gardenTextRef.current,
              start: 'top 85%',
              end: 'top 50%',
              scrub: 1.5,
            },
          }
        );
      }

      /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       *  CLOSING — final statement
       * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
      if (closingRef.current) {
        gsap.fromTo(
          closingTextRef.current,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: closingRef.current,
              start: 'top 60%',
              end: 'top 20%',
              scrub: 1.5,
            },
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="hidden lg:block w-full -mt-[60px]">
      {/* ═══════════════════════════════════════
          SECTION 1 — HERO (sticky, cinematic)
         ═══════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="sticky top-0 w-full h-screen min-h-[700px] z-0 overflow-hidden about-grain"
      >
        {/* Background image + zoom */}
        <div ref={heroBgRef} className="absolute inset-0 scale-100 will-change-transform">
          <Image
            src={`${AWS_S3_DOMAIN}images/about/web/about_web_1.png`}
            alt="하동 차밭 전경"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
        </div>

        {/* Hero content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-6">
          {/* Gold vertical line */}
          <div
            ref={heroLineRef}
            className="w-px h-20 bg-gradient-to-b from-transparent via-gold-400 to-gold-400/30 mb-8 origin-top"
          />

          {/* Overline */}
          <div
            ref={heroOverlineRef}
            className="text-[14px] tracking-[0.35em] text-gold-300/90 mb-8 uppercase font-medium"
          >
            Since 1994 · Hadong, Korea
          </div>

          {/* Main title */}
          <h1
            ref={heroTitleRef}
            className="font-family-serif text-[clamp(48px,5.5vw,80px)] leading-[0.95] tracking-[-0.02em] mb-12"
          >
            From Hadong,
            <br />
            with Care
          </h1>

          {/* Subtitle */}
          <div
            ref={heroSub1Ref}
            className="space-y-1.5 text-[clamp(16px,1.4vw,22px)] text-white/80 leading-relaxed tracking-widest"
          >
            <p>관아수제차는 1994년부터</p>
            <p>하동에서 차를 만들어 왔습니다.</p>
          </div>

          <div
            ref={heroSub2Ref}
            className="mt-10 space-y-1.5 text-[clamp(16px,1.4vw,22px)] text-white/70 leading-relaxed tracking-widest"
          >
            <p>빠르게 변화하는 흐름 속에서도</p>
            <p>차와 함께한 시간이 만든</p>
            <p>자신만의 방식을 지켜오고 있습니다.</p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          SECTION 2 — HERITAGE (dark, 1994)
         ═══════════════════════════════════════ */}
      <section
        ref={heritageRef}
        className="relative w-full min-h-[50vw] z-10 flex items-center overflow-hidden"
        style={{ background: 'linear-gradient(180deg, #2C1B10 0%, #1a1008 100%)' }}
      >
        {/* Large year watermark */}
        <div
          ref={heritageYearRef}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-family-serif text-[clamp(200px,22vw,350px)] text-white/5 select-none pointer-events-none leading-none tracking-[-0.05em]"
        >
          1994
        </div>

        <div className="relative w-full min-h-[600px] flex items-center max-w-[1300px] mx-auto px-12">
          {/* Image — left side with clip-path reveal */}
          <div className="w-[45%]">
            <div ref={heritageImgRef} className="relative w-full">
              <div className="overflow-hidden">
                <Image
                  src={`${AWS_S3_DOMAIN}images/about/web/about_web_2_1.webp`}
                  alt="계절의 차"
                  width={480}
                  height={580}
                  className="w-full h-auto object-cover"
                  sizes="40vw"
                />
              </div>
              {/* Circle image */}
              <div
                ref={heritageCircleRef}
                className="absolute w-[9vw] min-w-[120px] -bottom-[2vw] -right-[1vw] z-10"
              >
                <Image
                  src={`${AWS_S3_DOMAIN}images/about/web/about_web_2_2.webp`}
                  alt="찻잎 클로즈업"
                  width={220}
                  height={220}
                  className="w-full h-auto object-cover rounded-full ring-4 ring-brand-900/50"
                  sizes="9vw"
                />
              </div>
            </div>
          </div>

          {/* Text — right side */}
          <div
            ref={heritageTextRef}
            className="w-[45%] ml-auto about-stagger"
          >
            {/* Gold accent line */}
            <div className="w-12 h-px bg-gold-400/60 mb-6" />
            <div className="text-[11px] tracking-[0.25em] text-gold-400/80 uppercase mb-4 font-medium">
              Heritage
            </div>
            <div className="font-semibold text-white mb-8 text-[clamp(20px,2.2vw,36px)] leading-snug tracking-wide">
              계절을 기준으로 한 차
            </div>
            <div className="space-y-2 text-white/70 leading-loose text-[clamp(14px,1.1vw,20px)] tracking-wider">
              <p>차는 계절에 따라 달라집니다.</p>
              <p>봄에는 녹차를 만들고,</p>
              <p>여름 · 가을 · 겨울에는</p>
              <p>계절에 어울리는 대용차를 준비합니다.</p>
              <p className="pt-3 text-white/50">자연의 흐름에 맞춰</p>
              <p className="text-white/50">무리하지 않는 방식을 지켜갑니다.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          SECTION 3 — PHILOSOPHY (light, warm)
         ═══════════════════════════════════════ */}
      <section
        ref={philoRef}
        className="relative w-full z-10 overflow-hidden bg-warm-50"
      >
        {/* Images row */}
        <div className="flex justify-center gap-8 pt-28 pb-12 px-12 max-w-[1200px] mx-auto">
          <div ref={philoImg1Ref} className="flex-1 max-w-[480px] overflow-hidden">
            <Image
              src={`${AWS_S3_DOMAIN}images/about/web/about_web_3_1.webp`}
              alt="차를 마시는 사람"
              width={500}
              height={350}
              className="w-full h-auto object-cover hover:scale-[1.03] transition-transform duration-700"
              sizes="(max-width: 1200px) 45vw, 480px"
            />
          </div>
          <div ref={philoImg2Ref} className="flex-1 max-w-[480px] overflow-hidden mt-12">
            <Image
              src={`${AWS_S3_DOMAIN}images/about/web/about_web_3_2.webp`}
              alt="차를 따르는 모습"
              width={500}
              height={350}
              className="w-full h-auto object-cover hover:scale-[1.03] transition-transform duration-700"
              sizes="(max-width: 1200px) 45vw, 480px"
            />
          </div>
        </div>

        {/* Text area with decorative rule */}
        <div className="max-w-[800px] mx-auto pb-28 px-8">
          {/* Decorative horizontal rule */}
          <div className="about-hr my-14">
            <span className="text-gold-400/60 text-lg font-family-serif">✦</span>
          </div>

          <div ref={philoTitleRef} className="text-center mb-10">
            <div className="text-[11px] tracking-[0.25em] text-brand-400 uppercase mb-4 font-medium">
              Philosophy
            </div>
            <h2 className="text-[clamp(26px,2.5vw,38px)] font-semibold text-brand-900 tracking-wide">
              사람과 사람을 잇는 마음
            </h2>
          </div>

          <div
            ref={philoBodyRef}
            className="text-center space-y-2 text-[clamp(15px,1.2vw,19px)] text-brand-600 leading-loose tracking-wider"
          >
            <p>관아수제차는 사람과 사람 사이의 정을 소중히 여깁니다.</p>
            <p>차는 혼자 마시기도 하지만,</p>
            <p>대부분의 시간은 누군가와 함께 나누게 됩니다.</p>
            <p className="pt-2 text-brand-400">차 한 잔이 대화를 만들고</p>
            <p className="text-brand-400">인연을 이어주는 매개가 되기를 바랍니다.</p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          SECTION 4 — EXPERIENCE (tea course)
         ═══════════════════════════════════════ */}
      <section ref={expRef} className="relative w-full z-10 bg-white">
        {/* Three images — staggered from bottom */}
        <div className="flex justify-center gap-6 pt-28 px-12 max-w-[1200px] mx-auto">
          <div ref={expImg1Ref} className="flex-1 overflow-hidden">
            <Image
              src={`${AWS_S3_DOMAIN}images/about/web/about_web_4_1.webp`}
              alt="티코스 1"
              width={360}
              height={280}
              className="w-full h-auto object-cover hover:scale-[1.03] transition-transform duration-700"
              sizes="(max-width: 1200px) 30vw, 360px"
            />
          </div>
          <div ref={expImg2Ref} className="flex-1 overflow-hidden mt-8">
            <Image
              src={`${AWS_S3_DOMAIN}images/about/web/about_web_4_2.webp`}
              alt="티코스 2"
              width={360}
              height={280}
              className="w-full h-auto object-cover hover:scale-[1.03] transition-transform duration-700"
              sizes="(max-width: 1200px) 30vw, 360px"
            />
          </div>
          <div ref={expImg3Ref} className="flex-1 overflow-hidden mt-16">
            <Image
              src={`${AWS_S3_DOMAIN}images/about/web/about_web_4_3.webp`}
              alt="티코스 3"
              width={360}
              height={280}
              className="w-full h-auto object-cover hover:scale-[1.03] transition-transform duration-700"
              sizes="(max-width: 1200px) 30vw, 360px"
            />
          </div>
        </div>

        {/* Text */}
        <div className="max-w-[800px] mx-auto pt-16 pb-28 px-8">
          <div className="about-hr my-14">
            <span className="text-gold-400/60 text-lg font-family-serif">✦</span>
          </div>

          <div ref={expTitleRef} className="text-center mb-10">
            <div className="text-[11px] tracking-[0.25em] text-brand-400 uppercase mb-4 font-medium">
              Experience
            </div>
            <h2 className="text-[clamp(26px,2.5vw,38px)] font-semibold text-brand-900 tracking-wide">
              찻집에서 경험하는 티코스
            </h2>
          </div>

          <div
            ref={expBodyRef}
            className="text-center space-y-2 text-[clamp(15px,1.2vw,19px)] text-brand-600 leading-loose tracking-wider"
          >
            <p>한국차를 천천히 경험할 수 있는 티코스를 운영하고 있습니다.</p>
            <p>계절에 따라 준비한 차와 다식을 통해</p>
            <p>차의 맛뿐 아니라</p>
            <p>차가 만들어지는 배경과 이야기를 함께 전합니다.</p>
            <p className="pt-2 text-brand-400">차를 처음 접하는 분도</p>
            <p className="text-brand-400">부담 없이 즐길 수 있도록 구성합니다.</p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          SECTION 5 — GARDEN (tea field picnic)
         ═══════════════════════════════════════ */}
      <section
        ref={gardenRef}
        className="relative w-full z-10 overflow-hidden bg-brand-50"
      >
        {/* Images */}
        <div className="flex justify-center gap-10 pt-28 pb-8 px-12 max-w-[1100px] mx-auto">
          <div ref={gardenImg1Ref} className="flex-1 max-w-[480px] overflow-hidden">
            <Image
              src={`${AWS_S3_DOMAIN}images/about/web/about_web_5_1.webp`}
              alt="차밭 풍경"
              width={500}
              height={350}
              className="w-full h-auto object-cover hover:scale-[1.03] transition-transform duration-700"
              sizes="(max-width: 1100px) 45vw, 480px"
            />
          </div>
          <div ref={gardenImg2Ref} className="flex-1 max-w-[480px] overflow-hidden mt-10">
            <Image
              src={`${AWS_S3_DOMAIN}images/about/web/about_web_5_2.webp`}
              alt="차밭 소풍"
              width={500}
              height={350}
              className="w-full h-auto object-cover hover:scale-[1.03] transition-transform duration-700"
              sizes="(max-width: 1100px) 45vw, 480px"
            />
          </div>
        </div>

        {/* Text */}
        <div ref={gardenTextRef} className="max-w-[800px] mx-auto pb-28 px-8">
          <div className="about-hr my-14">
            <span className="text-gold-400/60 text-lg font-family-serif">✦</span>
          </div>

          <div className="text-center mb-10">
            <div className="text-[11px] tracking-[0.25em] text-brand-400 uppercase mb-4 font-medium">
              Tea Field
            </div>
            <h2 className="text-[clamp(26px,2.5vw,38px)] font-semibold text-brand-900 tracking-wide">
              차밭에서 보내는 소풍
            </h2>
          </div>

          <div className="text-center space-y-2 text-[clamp(15px,1.2vw,19px)] text-brand-600 leading-loose tracking-wider">
            <p>하동의 관아수제차 차밭을 천천히 걸으며</p>
            <p>자연 속에서 차를 마시는</p>
            <p>차밭 소풍 프로그램을 운영하고 있습니다.</p>
            <p className="pt-2 text-brand-400">차가 자라는 공간에서의 경험이</p>
            <p className="text-brand-400">차를 조금 더 가깝게 만들어주기를 바랍니다.</p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          SECTION 6 — CLOSING (cinematic)
         ═══════════════════════════════════════ */}
      <section ref={closingRef} className="relative z-10 w-full about-grain">
        <div className="relative w-full min-h-[70vh]">
          <Image
            src={`${AWS_S3_DOMAIN}images/about/web/about_web_6.webp`}
            alt="하동 차밭"
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/30" />

          <div
            ref={closingTextRef}
            className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-6"
          >
            {/* Gold line */}
            <div className="w-px h-12 bg-gradient-to-b from-transparent via-gold-400 to-gold-400/30 mb-8" />

            <h2 className="font-family-serif text-[clamp(32px,3.5vw,52px)] tracking-wider mb-14 leading-tight">
              From Hadong, with Care
            </h2>

            <div className="space-y-2 text-[clamp(15px,1.3vw,21px)] text-white/80 leading-relaxed tracking-wider">
              <p>관아수제차는</p>
              <p>화려함보다 편안함을,</p>
              <p>강한 인상보다 오래 남는 여운을 생각합니다.</p>
            </div>

            <div className="mt-12 space-y-2 text-[clamp(16px,1.4vw,22px)] text-white/90 leading-relaxed tracking-wider">
              <p>손이 자주 가는 이유가 있는 차,</p>
              <p>사람과 사람을 이어주는 차를</p>
              <p>오늘도 하동에서 만들고 있습니다.</p>
            </div>

            {/* Gold line bottom */}
            <div className="w-px h-12 bg-gradient-to-t from-transparent via-gold-400 to-gold-400/30 mt-12" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutWebView;
