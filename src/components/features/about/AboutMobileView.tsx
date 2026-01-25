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
  const heroRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const content1Ref = useRef<HTMLDivElement>(null);
  const content2Ref = useRef<HTMLDivElement>(null);

  // 모바일 브라우저 UI 숨김/표시에 따른 동적 높이 추적
  const [viewportHeight, setViewportHeight] = useState<number | null>(null);
  const [isHeroPinned, setIsHeroPinned] = useState(true); // 히어로 섹션이 핀된 상태인지
  const isKakaoRef = useRef(false); // 카카오 인앱 브라우저 여부
  const isReturningRef = useRef(false); // onEnterBack으로 돌아오는 중인지

  const updateViewport = useCallback(() => {
    // 히어로 섹션 핀이 끝났으면 더 이상 업데이트하지 않음
    if (!isHeroPinned) return;

    // visualViewport가 있으면 사용 (더 정확함), 없으면 innerHeight
    const height = window.visualViewport?.height ?? window.innerHeight;
    setViewportHeight(height);
  }, [isHeroPinned]);

  useEffect(() => {
    // 카카오 인앱 브라우저 감지 (클라이언트에서만)
    isKakaoRef.current = /KAKAOTALK/i.test(navigator.userAgent);

    // 히어로 섹션 핀이 끝났으면 리스너 등록하지 않음
    if (!isHeroPinned) return;

    // 초기 높이 설정
    updateViewport();

    // resize 이벤트 리스너
    window.addEventListener('resize', updateViewport);

    // visualViewport API 지원 시 추가 (모바일 브라우저 UI 변화 감지)
    const visualViewport = window.visualViewport;
    if (visualViewport) {
      visualViewport.addEventListener('resize', updateViewport);
    }

    // 카카오 인앱에서는 scroll 이벤트에서도 높이 체크 (빠른 스크롤 시 visualViewport 이벤트 누락 대응)
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
        if (scrollThrottleTimer) {
          clearTimeout(scrollThrottleTimer);
        }
      }
    };
  }, [updateViewport, isHeroPinned]);

  // Phase 1 개별 요소들
  const phase1BgRef = useRef<HTMLDivElement>(null);
  const phase1TitleRef = useRef<HTMLHeadingElement>(null);
  const phase1Text1Ref = useRef<HTMLParagraphElement>(null);
  const phase1LogoRef = useRef<HTMLDivElement>(null);
  const phase1Text2Ref = useRef<HTMLParagraphElement>(null);

  // Phase 2 개별 요소들
  const phase2BgRef = useRef<HTMLDivElement>(null);
  const phase2TitleRef = useRef<HTMLHeadingElement>(null);
  const phase2HeadingRef = useRef<HTMLHeadingElement>(null);
  const phase2TextRef = useRef<HTMLParagraphElement>(null);
  const phase2ButtonRef = useRef<HTMLButtonElement>(null);
  const arrowRef = useRef<HTMLDivElement>(null);
  const chevronDownRef = useRef<HTMLDivElement>(null);

  const carouselTrackRef = useRef<HTMLDivElement>(null);
  const whiteSectionRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // ===== Phase 1: 첫 번째 컨텐츠 등장 (자동) =====
      // 초기 상태 설정
      gsap.set(
        [
          phase1TitleRef.current,
          phase1Text1Ref.current,
          phase1LogoRef.current,
          phase1Text2Ref.current,
        ],
        {
          opacity: 0,
          y: 30,
        }
      );

      // 진입 애니메이션 (스크롤과 별개로 실행)
      gsap.to(
        [
          phase1TitleRef.current,
          phase1Text1Ref.current,
          phase1LogoRef.current,
          phase1Text2Ref.current,
        ],
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.2,
          ease: 'power2.out',
          delay: 0.3,
        }
      );

      const track = carouselTrackRef.current;

      if (track) {
        // 트랙 너비의 절반만큼 이동 (복제된 이미지들 때문에)
        const totalWidth = track.scrollWidth / 4;
        gsap.fromTo(
          track,
          { x: 0 },
          {
            x: -totalWidth,
            duration: 45,
            ease: 'none',
            repeat: -1,
          }
        );
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: heroRef.current,
          start: window.innerWidth >= 1024 ? 'top 94px' : '',
          end: '+=400%', // 더 길게 (순차 등장 시간 확보)
          pin: true,
          scrub: 0.5,
          // markers: true,
          onLeave: () => setIsHeroPinned(false), // 핀 종료 시 동적 높이 추적 중단
          onEnterBack: () => {
            // 카카오 인앱에서 돌아올 때 잠시 refresh 차단
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

      // ===== Phase 1 → 2 전환 =====
      // 처음에는 잠시 대기 (이미 등장해 있으므로)
      tl.to({}, { duration: 1 });

      tl.to(content1Ref.current, {
        opacity: 0,
        duration: 0.8,
        ease: 'power2.inOut',
      })
        .to(
          phase1BgRef.current,
          {
            opacity: 0,
            duration: 2,
            ease: 'power1.inOut',
          },
          '<'
        )
        .to(
          overlayRef.current,
          {
            opacity: 0.4,
            duration: 2,
            ease: 'power1.inOut',
          },
          '<'
        )
        .to(
          phase2BgRef.current,
          {
            opacity: 1,
            duration: 2,
            ease: 'power1.inOut',
          },
          '<'
        );

      // ===== Phase 2: 두 번째 컨텐츠 순차 등장 =====
      gsap.set(
        [
          phase2TitleRef.current,
          phase2HeadingRef.current,
          phase2TextRef.current,
          phase2ButtonRef.current,
        ],
        {
          opacity: 0,
          y: 30,
        }
      );

      tl.to(phase2TitleRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.5,
      })
        .to(phase2HeadingRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.5,
        })
        .to(phase2TextRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.5,
        })
        .to(phase2ButtonRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.5,
        });

      // ArrowRight 미세 바운스 애니메이션
      gsap.to(arrowRef.current, {
        x: 3,
        duration: 0.5,
        ease: 'power1.inOut',
        repeat: -1,
        yoyo: true,
      });

      // ChevronDown 미세 바운스 애니메이션
      gsap.to(chevronDownRef.current, {
        y: 2.5,
        duration: 0.8,
        ease: 'power1.inOut',
        repeat: -1,
        yoyo: true,
      });

      // 페이즈 2 유지 시간 (내용을 보고 버튼을 클릭할 시간 확보)
      tl.to({}, { duration: 1 });

      // ===== Phase 2 → 3: 한꺼번에 페이드아웃 =====
      tl.to(content2Ref.current, {
        opacity: 0,
        duration: 0.5,
      }).to(
        overlayRef.current,
        {
          opacity: 0.95,
          duration: 0.5,
        },
        '<'
      );

      // ===== 흰 배경 섹션: 각 섹션별 순차 등장 =====
      const fadeSections = document.querySelectorAll('.fade-section');

      fadeSections.forEach((section) => {
        gsap.from(section, {
          opacity: 0,
          y: 60,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 65%',
            end: 'top 35%', // 이 지점을 벗어나면 reverse
            toggleActions: 'play none none reverse',
          },
        });
      });

      // GSAP 초기화 완료 후 흰 배경 섹션 표시
      setIsReady(true);
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // viewport 높이 변경 시 ScrollTrigger 업데이트 (히어로 핀 중일 때만)
  // 카카오 인앱에서 onEnterBack 직후에는 refresh 생략 (스크롤 튀김 방지)
  useEffect(() => {
    if (viewportHeight && isHeroPinned && !isReturningRef.current) {
      if (!isReturningRef.current) {
        const timeoutId = setTimeout(() => {
          ScrollTrigger.refresh();
        }, 100);

        return () => clearTimeout(timeoutId);
      } else {
        ScrollTrigger.refresh();
      }
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
      {/* ===== 히어로 섹션 ===== */}
      <div
        ref={heroRef}
        className="relative w-full overflow-hidden"
        style={{
          height: viewportHeight ? `${viewportHeight}px` : '100dvh',
        }}
      >
        {/* 배경 이미지 - Phase 1 */}
        <div
          ref={phase1BgRef}
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('${AWS_S3_DOMAIN}images/about/mobile/gwana_about_01.webp')`,
          }}
        />

        {/* 배경 이미지 - Phase 2 (페이드인) */}
        <div
          ref={phase2BgRef}
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('${AWS_S3_DOMAIN}images/about/mobile/gwana_about_02.webp')`,
            opacity: 0,
          }}
        />

        {/* 어두운 오버레이 */}
        <div ref={overlayRef} className="absolute inset-0 bg-black" style={{ opacity: 0.3 }} />

        {/* 첫 번째 컨텐츠 */}
        <div
          ref={content1Ref}
          className="absolute inset-0 flex flex-col items-center justify-center text-white text-center"
        >
          <div ref={phase1TitleRef} style={{ opacity: 0 }}>
            <Image
              src={`${AWS_S3_DOMAIN}images/about/mobile/gwana_about_03.png`}
              alt="관아수제차"
              className="w-[280px] lg:w-[350px] mb-[150px]"
              style={{
                filter:
                  'drop-shadow(1px 0 0 white) drop-shadow(-1px 0 0 white) drop-shadow(0 1px 0 white) drop-shadow(0 0 1px white)',
              }}
              width={100}
              height={100}
            />
          </div>
          <p
            ref={phase1Text1Ref}
            className="text-3xl md:text-5xl font-bold m-10"
            style={{ opacity: 0 }}
          >
            지리산 깊은 골짜기에
            <br />
            시작된 관아수제차
          </p>
          <p
            ref={phase1Text2Ref}
            className="text-[18px] md:text-xl max-w-xl leading-relaxed text-center"
            style={{ opacity: 0 }}
          >
            관아의 차는 지리산 화개동천의 깊은 골짜기 <br /> 무제갓 1만여평 야생 차밭에서
            자라납니다.
          </p>
        </div>

        {/* 두 번째 컨텐츠 */}
        <div
          ref={content2Ref}
          className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-6"
        >
          <h3 ref={phase2TitleRef} className="text-[20px] md:text-5xl mb-10" style={{ opacity: 0 }}>
            농약이나 화학비료에 의존하지 않고 <br /> 오직 자연 그대로 기른 찻잎
          </h3>

          <h4 ref={phase2HeadingRef} className="text-[20px] mb-10" style={{ opacity: 0 }}>
            세대를 거쳐 이어온 기준으로
            <br />
            자연과 전통을 지켜온 차.
          </h4>

          <p
            ref={phase2TextRef}
            className="text-[20px] max-w-md leading-relaxed opacity-80 mb-20"
            style={{ opacity: 0 }}
          >
            하동의 자연과 계절의 흐름을 <br />차 한 잔에 담았습니다.
          </p>

          <button
            ref={phase2ButtonRef}
            className="flex items-center gap-3 group text-center"
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
            <span className="text-[18px] relative">
              <div className="absolute -z-10 top-1/2 left-[-18px] -translate-y-1/2 w-10 h-10 rounded-full bg-gray-700/100" />
              Go to Shop
            </span>
            <div ref={arrowRef} className="">
              <ArrowRight className="w-5 h-5 text-white" />
            </div>
          </button>
        </div>

        {/* 스크롤 인디케이터 */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <div ref={chevronDownRef}>
            <ChevronDown className="w-8 h-8 text-white/70" strokeWidth={3} />
          </div>
        </div>
      </div>

      {/* ===== 흰 배경 섹션 ===== */}
      <div
        ref={whiteSectionRef}
        className="bg-white min-h-screen transition-opacity duration-300"
        style={{ opacity: isReady ? 1 : 0 }}
      >
        <div className="max-w-4xl mx-auto px-6 py-20">
          <section className="fade-section mb-20">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Section 1 Title</h2>
            <p className="text-gray-600 leading-relaxed text-lg min-h-40 border-2 border-gray-300"></p>
          </section>

          <section className="fade-section mb-20">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Section 2 Title</h2>
            <p className="text-gray-600 leading-relaxed text-lg min-h-40 border-2 border-gray-300"></p>
          </section>

          <section className="fade-section mb-20">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Section 3 Title</h2>
            <p className="text-gray-600 leading-relaxed text-lg min-h-40 border-2 border-gray-300"></p>
          </section>

          <section className="fade-section mb-20">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Section 4 Title</h2>
            <p className="text-gray-600 leading-relaxed text-lg min-h-40 border-2 border-gray-300"></p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AboutMobileView;
