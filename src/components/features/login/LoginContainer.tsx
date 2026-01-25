'use client';

import Image from 'next/image';

import { AWS_S3_DOMAIN } from '@/constants';

const LoginContainer = () => {
  const onKakaoLogin = async () => {
    window.location.replace(`${process.env.NEXT_PUBLIC_API_BASE_URL}/oauth2/authorization/kakao`);
  };

  /**
   * TODO: 네이버 로그인 구현
   */
  const onNaverLogin = async () => {
    console.log('네이버 로그인');
  };

  /**
   * TODO: 구글 로그인 구현
   */
  // const onGoogleLogin = async () => {
  //   console.log('구글 로그인');
  // };

  return (
    <>
      {/* 메인 컨텐츠 */}
      <div className="flex bg-white flex-col items-center px-6 w-full max-w-[500px] mx-auto flex-1 overflow-hidden border-x border-gray-100">
        {/* 로고 */}
        <div className="mt-20 flex-shrink-0">
          <Image
            src={`${AWS_S3_DOMAIN}images/logo/gwana_logo_2.webp`}
            width={320}
            height={130}
            alt="관아수제차"
            className="object-contain h-auto w-[240px]"
          />
        </div>

        {/* 하단 영역 */}
        <div className="w-full mt-auto mb-6 sm:mb-8 md:mb-10 flex-shrink-0">
          {/* 안내 문구 */}
          <div className="text-center mb-6 sm:mb-6">
            <p className="text-sm sm:text-base text-gray-700">간편하게 로그인하고</p>
            <p className="text-sm sm:text-base text-gray-700 font-semibold">
              다양한 혜택을 받아보세요!
            </p>
          </div>

          {/* 소셜 로그인 버튼들 */}
          <div className="w-full space-y-2.5 sm:space-y-3">
            {/* 카카오 로그인 */}
            <button
              onClick={onKakaoLogin}
              className="w-full h-[50px] sm:h-[56px] px-4 sm:px-6 rounded-xl font-semibold text-sm sm:text-base transition-all flex items-center justify-center gap-2 sm:gap-3 bg-[#FEE500] hover:bg-[#FDD835] text-gray-900 border border-gray-300"
            >
              <Image
                src={`${AWS_S3_DOMAIN}images/socialLoginLogo/kakao_logo.webp`}
                width={24}
                height={24}
                alt="카카오"
                className="w-5 h-5 sm:w-6 sm:h-6"
              />
              <span>카카오로 3초 만에 시작하기</span>
            </button>

            {/* 네이버 로그인 */}
            <button
              onClick={onNaverLogin}
              className="w-full h-[50px] sm:h-[56px] px-4 sm:px-6 rounded-xl font-semibold text-sm sm:text-base transition-all flex items-center justify-center gap-2 sm:gap-3 bg-[#03C75A] hover:bg-[#02B350] text-white border border-gray-300"
            >
              <Image
                src={`${AWS_S3_DOMAIN}images/socialLoginLogo/naver_logo.png`}
                width={25}
                height={25}
                alt="네이버"
                className="w-5 h-5 sm:w-6 sm:h-6"
              />
              <span>네이버로 계속하기</span>
            </button>

            {/* 구글 로그인 */}
            {/* <button
              onClick={onGoogleLogin}
              className="w-full h-[50px] sm:h-[56px] px-4 sm:px-6 rounded-xl font-semibold text-sm sm:text-base transition-all flex items-center justify-center gap-2 sm:gap-3 bg-white hover:bg-gray-50 text-gray-900 border border-gray-300"
            >
              <Image
                src="/images/chrome_logo.webp"
                width={20}
                height={20}
                alt="Google"
                className="w-4 h-4 sm:w-5 sm:h-5"
              />
              <span>Google로 계속하기</span>
            </button> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginContainer;
