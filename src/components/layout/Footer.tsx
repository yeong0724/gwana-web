'use client';

const Footer = () => {
  return (
    <footer className="relative z-[60] w-full bg-[#F9F9F9] border-t border-gray-200 min-h-[200px] py-8 pb-18 lg:pb-8">
      <div className="mx-auto px-6 max-w-7xl">
        <div className="hidden md:flex flex-col space-y-4 text-sm text-gray-700">
          {/* 첫 번째 줄: 사업자 정보 */}
          <div className="flex flex-wrap flex-col items-center gap-2 leading-relaxed text-[15px]">
            <div>
              <span className="font-bold mr-[5px]">상호명: 관아수제차</span>
              <span>(TEL: 0507-1462-8041)</span>
            </div>
            <div>
              <span className="font-bold mr-[5px]">대표자: 김정옥</span>
              <span>(mobile: 010-5334-7785 / E-mail: rud0243@naver.com)</span>
            </div>
            <div>
              <span className="font-bold">
                주소: 경남 하동군 화개면 목압길 24-2 (1층 관아수제차)
              </span>
            </div>
            <div>
              <span className="font-bold">사업자등록번호: 613-19-89889</span>
            </div>
            <div>
              <span className="text-gray-500">
                Copyright © Ganna Tea House. All rights reserved.
              </span>
            </div>
          </div>
        </div>
        <div className="md:hidden flex flex-col space-y-4 text-sm text-gray-700">
          {/* 첫 번째 줄: 사업자 정보 */}
          <div className="flex flex-wrap flex-col items-start gap-2 leading-relaxed text-[15px]">
            <div className="flex flex-col items-start">
              <span className="font-bold mr-[5px]">상호명: 관아수제차</span>
              <span className="font-bold mr-[5px]">대표자: 김정옥</span>
            </div>
            <div className="flex flex-col items-start">
              <span>mobile: 010-5334-7785</span>
              <span>E-mail: rud0243@naver.com</span>
              <span>TEL: 0507-1462-8041</span>
            </div>
            <div>
              <span className="font-bold">
                주소: 경남 하동군 화개면 목압길 24-2 (1층 관아수제차)
              </span>
            </div>
            <div>
              <span className="font-bold">사업자등록번호: 613-19-89889</span>
            </div>
            <div className="flex flex-col items-start">
              <span className="text-gray-500">Copyright © Ganna Tea House.</span>
              <span className="text-gray-500">All rights reserved.</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
