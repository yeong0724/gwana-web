'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, ChevronDown } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const AboutContainer = () => {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const content1Ref = useRef<HTMLDivElement>(null);
  const content2Ref = useRef<HTMLDivElement>(null);

  // Phase 1 개별 요소들
  const phase1TitleRef = useRef<HTMLHeadingElement>(null);
  const phase1Text1Ref = useRef<HTMLParagraphElement>(null);
  const phase1LogoRef = useRef<HTMLDivElement>(null);
  const phase1Text2Ref = useRef<HTMLParagraphElement>(null);

  // Phase 2 개별 요소들
  const phase2TitleRef = useRef<HTMLHeadingElement>(null);
  const phase2SubtitleRef = useRef<HTMLParagraphElement>(null);
  const phase2IconsRef = useRef<HTMLDivElement>(null);
  const phase2HeadingRef = useRef<HTMLHeadingElement>(null);
  const phase2TextRef = useRef<HTMLParagraphElement>(null);
  const phase2ButtonRef = useRef<HTMLButtonElement>(null);

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

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: heroRef.current,
          start: window.innerWidth >= 1024 ? 'top 94px' : '',
          end: '+=400%', // 더 길게 (순차 등장 시간 확보)
          pin: true,
          scrub: 0.5,
          // markers: true,
        },
      });

      // ===== Phase 1 → 2 전환 =====
      // 처음에는 잠시 대기 (이미 등장해 있으므로)
      tl.to({}, { duration: 1 });

      tl.to(content1Ref.current, {
        opacity: 0,
        duration: 0.5,
      }).to(
        overlayRef.current,
        {
          opacity: 0.75,
          duration: 0.5,
        },
        '<'
      );

      // ===== Phase 2: 두 번째 컨텐츠 순차 등장 =====
      gsap.set(
        [
          phase2TitleRef.current,
          phase2SubtitleRef.current,
          phase2IconsRef.current,
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
        .to(phase2SubtitleRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.5,
        })
        .to(phase2IconsRef.current, {
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

      // 페이즈 2 유지 시간 (내용을 보고 버튼을 클릭할 시간 확보)
      tl.to({}, { duration: 2 });

      // ===== Phase 2 → 3: 한꺼번에 페이드아웃 =====
      tl.to(content2Ref.current, {
        opacity: 0,
        duration: 0.5,
      }).to(
        overlayRef.current,
        {
          opacity: 0.9,
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
            start: 'top 85%',
            end: 'top 20%', // 이 지점을 벗어나면 reverse
            toggleActions: 'play none none reverse',
          },
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="">
      {/* ===== 히어로 섹션 ===== */}
      <div
        ref={heroRef}
        className="relative h-screen lg:h-[calc(100dvh-94px)] w-full overflow-hidden"
      >
        {/* 배경 이미지 */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('/images/gwana_about_01.webp')`,
          }}
        />

        {/* 어두운 오버레이 */}
        <div ref={overlayRef} className="absolute inset-0 bg-black" style={{ opacity: 0.5 }} />

        {/* 첫 번째 컨텐츠 */}
        <div
          ref={content1Ref}
          className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-6"
        >
          <h1 ref={phase1TitleRef} className="text-5xl md:text-7xl font-bold text-emerald-400 mb-6">
            관아수제차
          </h1>
          <p ref={phase1Text1Ref} className="text-lg md:text-xl max-w-xl leading-relaxed mb-8">
            Tea from Hadong, calmly brewed
          </p>
          <p ref={phase1Text2Ref} className="text-lg md:text-xl max-w-xl leading-relaxed mb-8">
            하동의 자연과 계절의 흐름을
            <br />차 한 잔에 담았습니다.
          </p>
          <div ref={phase1LogoRef} className="flex items-center justify-center mb-8">
            <span className="text-emerald-400 text-3xl">🦚</span>
          </div>
        </div>

        {/* 두 번째 컨텐츠 */}
        <div
          ref={content2Ref}
          className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-6"
        >
          <h2 ref={phase2TitleRef} className="text-3xl md:text-5xl font-bold mb-4">
            지리산 깊은 골짜기에
            <br />
            시작된 관아수제차
          </h2>

          <p ref={phase2SubtitleRef} className="text-xl italic mb-8 opacity-70">
            What we can do
          </p>

          <div ref={phase2IconsRef} className="flex gap-4 mb-6">
            <div className="flex items-center justify-center">
              <span className="text-2xl">🦚</span>
            </div>
          </div>

          <h3 ref={phase2HeadingRef} className="text-xl font-semibold mb-8">
            농약이나 화학비료에 의존하지 않고 <br /> 오직 자연 그대로 기른 찻잎
          </h3>

          <p ref={phase2TextRef} className="text-sm max-w-md leading-relaxed opacity-80 mb-8">
            세대를 거쳐 이어온 기준으로
            <br />
            자연과 전통을 지켜온 차를 만듭니다.
            <br />
            설명보다 여운이 남고,
            <br />
            속도보다 호흡이 먼저인 차
            <br />
            이것이 관아가 차를 바라보는 가장 맑은 방식입니다.
          </p>

          <button
            ref={phase2ButtonRef}
            className="flex items-center gap-3 group"
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
              <div className="absolute -z-10 top-1/2 left-[-18px] -translate-y-1/2 w-10 h-10 rounded-full bg-zinc-700/80" />
              Go to Shop
            </span>
            <div className="">
              <ArrowRight className="w-5 h-5 text-white" />
            </div>
          </button>
        </div>

        {/* 스크롤 인디케이터 */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          {/* <span className="text-white/50 text-xs font-light tracking-widest uppercase">Scroll</span> */}
          <ChevronDown className="w-8 h-8 text-white/70 animate-bounce" strokeWidth={3} />
        </div>
      </div>

      {/* ===== 흰 배경 섹션 ===== */}
      <div className="bg-white min-h-screen">
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

export default AboutContainer;
