'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { AWS_S3_DOMAIN } from '@/constants';

// GSAP 플러그인 등록
gsap.registerPlugin(ScrollTrigger);

const AboutWebView = () => {
  // 히어로 섹션 애니메이션용 refs
  const heroImageRef = useRef<HTMLDivElement>(null);
  const heroTitleRef = useRef<HTMLHeadingElement>(null);
  const heroText1Ref = useRef<HTMLDivElement>(null);
  const heroText2Ref = useRef<HTMLDivElement>(null);

  // 스크롤 애니메이션용 refs
  const heroSectionRef = useRef<HTMLElement>(null);
  const section2Ref = useRef<HTMLElement>(null);

  // 섹션2 애니메이션용 refs
  const section2Img1Ref = useRef<HTMLDivElement>(null);
  const section2Img2Ref = useRef<HTMLDivElement>(null);
  const section2TextRef = useRef<HTMLDivElement>(null);

  // 섹션3 애니메이션용 refs
  const section3Ref = useRef<HTMLElement>(null);
  const section3Img1Ref = useRef<HTMLDivElement>(null);
  const section3Img2Ref = useRef<HTMLDivElement>(null);
  const section3TextRef = useRef<HTMLDivElement>(null);

  // 섹션4 애니메이션용 refs
  const section4Ref = useRef<HTMLElement>(null);
  const section4ImgRef = useRef<HTMLDivElement>(null);
  const section4TextRef = useRef<HTMLDivElement>(null);

  // 섹션5 애니메이션용 refs
  const section5Ref = useRef<HTMLElement>(null);
  const section5Img1Ref = useRef<HTMLDivElement>(null);
  const section5Img2Ref = useRef<HTMLDivElement>(null);
  const section5TextRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const heroElements = [heroTitleRef.current, heroText1Ref.current, heroText2Ref.current];

      // 초기 상태 설정
      gsap.set([heroImageRef.current, ...heroElements], {
        opacity: 0,
        y: 30,
      });

      // 진입 애니메이션 (순차적으로 타다닥 등장)
      const entryTl = gsap.timeline();

      entryTl.to(heroImageRef.current, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power2.out',
        delay: 0.3,
      });

      entryTl.to(
        heroElements,
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: 'power2.out',
        },
        '-=0.7'
      );

      // 스크롤 시 히어로 텍스트 페이드아웃/인 (scrub으로 양방향 작동)
      if (heroSectionRef.current && section2Ref.current) {
        heroElements.forEach((el, index) => {
          gsap.fromTo(
            el,
            { opacity: 1, y: 0 },
            {
              opacity: 0,
              y: -30,
              ease: 'none',
              immediateRender: false, // 진입 애니메이션이 먼저 실행되도록 즉시 렌더링 비활성화
              scrollTrigger: {
                trigger: section2Ref.current,
                start: 'top 65%',
                end: 'top 65%',
                scrub: 0.5,
              },
              delay: index * 0.05, // 타다닥 효과를 위한 약간의 딜레이
            }
          );
        });
      }

      // 섹션2 애니메이션
      if (section2Ref.current) {
        // 이미지1: 좌측에서 나타남
        gsap.fromTo(
          section2Img1Ref.current,
          { opacity: 0, x: -200 },
          {
            opacity: 1,
            x: 0,
            duration: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: section2Ref.current,
              start: 'top 60%', // 더 아래에서 시작
              end: 'top 20%', // 더 위에서 끝 → 스크롤 구간이 길어짐
              scrub: 2, // 값을 높이면 더 부드럽게
            },
          }
        );

        // 이미지2: 하단에서 나타남
        gsap.fromTo(
          section2Img2Ref.current,
          { opacity: 0, y: 100 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: section2Ref.current,
              start: 'top 60%', // 이미지1보다 약간 늦게 시작
              end: 'top 20%',
              scrub: 2,
            },
          }
        );

        // 텍스트: 사라락 페이드인 효과
        gsap.fromTo(
          section2TextRef.current,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: section2Ref.current,
              start: 'top 55%',
              end: 'top 25%',
              scrub: 0.8,
            },
          }
        );
      }

      // 섹션3 애니메이션: 이미지 좌우에서, 텍스트 스르륵
      if (section3Ref.current) {
        // 이미지1: 좌측에서 나타남
        gsap.fromTo(
          section3Img1Ref.current,
          { opacity: 0, x: -150 },
          {
            opacity: 1,
            x: 0,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: section3Ref.current,
              start: 'top 70%',
              end: 'top 30%',
              scrub: 1.5,
            },
          }
        );

        // 이미지2: 우측에서 나타남
        gsap.fromTo(
          section3Img2Ref.current,
          { opacity: 0, x: 150 },
          {
            opacity: 1,
            x: 0,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: section3Ref.current,
              start: 'top 70%',
              end: 'top 30%',
              scrub: 1.5,
            },
          }
        );

        // 텍스트: 스르륵 페이드인
        gsap.fromTo(
          section3TextRef.current,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: section3TextRef.current,
              start: 'top 85%',
              end: 'top 50%',
              scrub: 1.5,
            },
          }
        );
      }

      // 섹션4 애니메이션: 이미지, 텍스트 모두 스르륵 나타남
      if (section4Ref.current) {
        // 이미지들: 스르륵 페이드인
        gsap.fromTo(
          section4ImgRef.current,
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: section4Ref.current,
              start: 'top 70%',
              end: 'top 35%',
              scrub: 1.5,
            },
          }
        );

        // 텍스트: 스르륵 페이드인
        gsap.fromTo(
          section4TextRef.current,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: section4TextRef.current,
              start: 'top 85%',
              end: 'top 50%',
              scrub: 1.5,
            },
          }
        );
      }

      // 섹션5 애니메이션: 이미지 좌우에서, 텍스트 스르륵
      if (section5Ref.current) {
        // 이미지1: 좌측에서 나타남
        gsap.fromTo(
          section5Img1Ref.current,
          { opacity: 0, x: -150 },
          {
            opacity: 1,
            x: 0,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: section5Ref.current,
              start: 'top 70%',
              end: 'top 30%',
              scrub: 1.5,
            },
          }
        );

        // 이미지2: 우측에서 나타남
        gsap.fromTo(
          section5Img2Ref.current,
          { opacity: 0, x: 150 },
          {
            opacity: 1,
            x: 0,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: section5Ref.current,
              start: 'top 70%',
              end: 'top 30%',
              scrub: 1.5,
            },
          }
        );

        // 텍스트: 스르륵 페이드인
        gsap.fromTo(
          section5TextRef.current,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: section5TextRef.current,
              start: 'top 85%',
              end: 'top 50%',
              scrub: 1.5,
            },
          }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="hidden lg:block w-full -mt-[60px]">
      {/* ===== 섹션 1: 히어로 (sticky로 고정) =====  */}
      <section ref={heroSectionRef} className="sticky top-0 w-full h-screen min-h-[600px] z-0">
        <div ref={heroImageRef} className="absolute inset-0" style={{ opacity: 0 }}>
          <Image
            src={`${AWS_S3_DOMAIN}images/about/web/about_web_1.png`}
            alt="From Hadong, with Care"
            fill
            className="object-cover"
            priority
          />
          {/* 이미지 위 음영 오버레이 */}
          <div className="absolute inset-0 bg-black/25" />
        </div>
        <div className="absolute inset-0 flex flex-col items-center pt-[25vh] text-white text-center">
          <div
            ref={heroTitleRef}
            className="text-[56px] mb-16 font-family-cormorant"
            style={{ opacity: 0 }}
          >
            From Hadong
          </div>
          <div
            ref={heroText1Ref}
            className="space-y-1 text-[28px] mb-[10px] tracking-widest"
            style={{ opacity: 0 }}
          >
            <p>관아수제차는 1994년부터</p>
            <p>하동에서 차를 만들어 왔습니다.</p>
          </div>
          <div
            ref={heroText2Ref}
            className="mt-12 space-y-1 text-[28px] mb-[10px] tracking-widest"
            style={{ opacity: 0 }}
          >
            <p>빠르게 변화하는 흐름보다</p>
            <p>차와 함께 살아온 시간 속에서</p>
            <p>자신만의 방식을 지켜오고 있습니다.</p>
          </div>
        </div>
      </section>

      {/* ===== 섹션 2: 계절을 기준으로 한 차 (일자형으로 덮어나감) ===== */}
      <section
        ref={section2Ref}
        className="relative w-full min-h-[48vw] bg-[#f5f5f5] z-10 flex items-center"
      >
        <div className="relative w-full min-h-[500px]">
          {/* 이미지 영역 - 좌측에서 35% 위치 */}
          <div
            className="absolute"
            style={{
              left: '25%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          >
            <div ref={section2Img1Ref} className="relative w-[30vw]">
              <Image
                src={`${AWS_S3_DOMAIN}images/about/web/about_web_2_1.webp`}
                alt="계절의 차"
                width={480}
                height={580}
                className="w-full h-auto object-cover rounded-md shadow-lg"
              />
              {/* 원형 이미지 - 이미지1의 오른쪽 하단 꼭지점에 원의 정중앙 배치 */}
              <div ref={section2Img2Ref} className="absolute w-[12vw] -bottom-[6vw] -right-[6vw]">
                <Image
                  src={`${AWS_S3_DOMAIN}images/about/web/about_web_2_2.webp`}
                  alt="찻잎 클로즈업"
                  width={220}
                  height={220}
                  className="w-full h-auto object-cover rounded-full shadow-lg"
                />
              </div>
            </div>
          </div>

          {/* 텍스트 영역 - 우측에서 30% 위치 (좌측에서 70%) */}
          <div
            ref={section2TextRef}
            className="absolute tracking-widest"
            style={{
              left: '70%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          >
            <div className="font-bold text-gray-900 mb-7 text-[18px] lg:text-[26px] xl:text-[30px] 2xl:text-[34px] ">
              계절을 기준으로 한 차
            </div>
            <div className="space-y-1 text-gray-700 leading-loose text-[16px] lg:text-[16px] xl:text-[18px] 2xl:text-[24px]">
              <p>차는 계절에 따라 달라집니다.</p>
              <p>봄에는 녹차를 만들고,</p>
              <p>여름 · 가을 · 겨울에는</p>
              <p>계절에 어울리는 대용차를 준비합니다.</p>
              <p>자연의 흐름에 맞춰</p>
              <p>지금 만들 수 있는 차를 만들며</p>
              <p>무리하지 않는 방식을 지켜갑니다.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 섹션 3: 사람과 사람을 잇는 마음 ===== */}
      <section
        ref={section3Ref}
        className="relative w-full min-h-screen bg-white z-10 overflow-hidden flex flex-col justify-center"
      >
        {/* 이미지 영역 */}
        <div className="flex justify-center gap-20 py-20 px-12">
          <div ref={section3Img1Ref}>
            <Image
              src={`${AWS_S3_DOMAIN}images/about/web/about_web_3_1.webp`}
              alt="차를 마시는 사람"
              width={500}
              height={350}
              className="object-cover rounded-md"
            />
          </div>
          <div ref={section3Img2Ref}>
            <Image
              src={`${AWS_S3_DOMAIN}images/about/web/about_web_3_2.webp`}
              alt="차를 따르는 모습"
              width={500}
              height={350}
              className="object-cover rounded-md"
            />
          </div>
        </div>

        {/* 텍스트 영역 - 회색 배경 */}
        <div ref={section3TextRef} className="w-full bg-[#f5f5f5] py-20 tracking-wider">
          <div className="text-center">
            <h2 className="text-[32px] font-bold text-gray-900 mb-8">사람과 사람을 잇는 마음</h2>
            <div className="space-y-1 text-[18px] text-gray-700 leading-loose">
              <p>관아수제차는 사람과 사람 사이의 정을 소중히 여깁니다.</p>
              <p>차는 혼자 마시기도 하지만,</p>
              <p>대부분의 시간은 누군가와 함께 나누게 됩니다.</p>
              <p>차 한 잔이 대화를 만들고</p>
              <p>인연을 이어주는 매개가 되기를 바랍니다.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 섹션 4: 찻집에서 경험하는 티코스 ===== */}
      <section
        ref={section4Ref}
        className="relative w-full min-h-screen bg-white z-10 flex flex-col justify-center"
      >
        {/* 이미지 3개 */}
        <div ref={section4ImgRef} className="flex justify-center pt-10 gap-12 px-12 mb-16">
          <Image
            src={`${AWS_S3_DOMAIN}images/about/web/about_web_4_1.webp`}
            alt="티코스 1"
            width={360}
            height={280}
            className="object-cover rounded-md"
          />
          <Image
            src={`${AWS_S3_DOMAIN}images/about/web/about_web_4_2.webp`}
            alt="티코스 2"
            width={360}
            height={280}
            className="object-cover rounded-md"
          />
          <Image
            src={`${AWS_S3_DOMAIN}images/about/web/about_web_4_3.webp`}
            alt="티코스 3"
            width={360}
            height={280}
            className="object-cover rounded-md"
          />
        </div>

        {/* 텍스트 영역 */}
        <div ref={section4TextRef} className="text-center bg-[#f5f5f5] py-20 tracking-wider">
          <h2 className="text-[32px] font-bold text-gray-900 mb-8">찻집에서 경험하는 티코스</h2>
          <div className="space-y-1 text-[18px] text-gray-700 leading-loose">
            <p>한국차를 천천히 경험할 수 있는 티코스를 운영하고 있습니다.</p>
            <p>계절에 따라 준비한 차와 다식을 통해</p>
            <p>차의 맛뿐 아니라</p>
            <p>차가 만들어지는 배경과 이야기를 함께 전합니다.</p>
            <p>차를 처음 접하는 분도</p>
            <p>부담 없이 즐길 수 있도록 구성합니다.</p>
          </div>
        </div>
      </section>

      {/* ===== 섹션 5: 차밭에서 보내는 소풍 ===== */}
      <section
        ref={section5Ref}
        className="relative w-full min-h-screen bg-white z-10 overflow-hidden flex flex-col justify-center"
      >
        {/* 이미지 영역 */}
        <div className="flex justify-center gap-20 py-10 px-12">
          <div ref={section5Img1Ref}>
            <Image
              src={`${AWS_S3_DOMAIN}images/about/web/about_web_5_1.webp`}
              alt="차밭 풍경"
              width={500}
              height={350}
              className="object-cover rounded-md"
            />
          </div>
          <div ref={section5Img2Ref}>
            <Image
              src={`${AWS_S3_DOMAIN}images/about/web/about_web_5_2.webp`}
              alt="차밭 소풍"
              width={500}
              height={350}
              className="object-cover rounded-md"
            />
          </div>
        </div>

        {/* 텍스트 영역 - 회색 배경 */}
        <div ref={section5TextRef} className="w-full bg-[#f5f5f5] py-20 tracking-wider">
          <div className="text-center">
            <h2 className="text-[32px] font-bold text-gray-900 mb-8">차밭에서 보내는 소풍</h2>
            <div className="space-y-1 text-[18px] text-gray-700 leading-loose">
              <p>하동의 관아수제차 차밭을 천천히 걸으며</p>
              <p>자연 속에서 차를 마시는</p>
              <p>차밭 소풍 프로그램을 운영하고 있습니다.</p>
              <p>차가 자라는 공간에서의 경험이</p>
              <p>차를 조금 더 가깝게 만들어주기를 바랍니다.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 섹션 6: 마무리 히어로 ===== */}
      <section className="relative z-10 flex flex-col items-center justify-center bg-white py-10">
        <div className="relative w-full">
          <Image
            src={`${AWS_S3_DOMAIN}images/about/web/about_web_6.webp`}
            alt="From Hadong, with Care"
            width={3000}
            height={1080}
            unoptimized={true}
            className="w-full h-auto"
          />
          <div className="absolute inset-0 bg-black/25" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center tracking-widest">
            <h1 className="text-[45px] tracking-wider mb-16 font-family-cormorant">
              From Hadong, with Care
            </h1>
            <div className="space-y-1 text-[20px] leading-relaxed">
              <p>관아수제차는</p>
              <p>화려함보다 편안함을,</p>
              <p>강한 인상보다 오래 남는 여운을 생각합니다.</p>
            </div>
            <div className="mt-12 space-y-1 text-[22px] leading-relaxed">
              <p>손이 자주 가는 이유가 있는 차,</p>
              <p>사람과 사람을 이어주는 차를</p>
              <p>오늘도 하동에서 만들고 있습니다.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutWebView;
