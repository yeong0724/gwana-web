'use client';

import { usePathname } from 'next/navigation';

const Footer = () => {
  const pathname = usePathname();
  const isProductDetail = pathname.startsWith('/product/');

  return (
    <footer
      className={`relative z-[60] w-full bg-brand-50 border-t border-brand-200/60 min-h-[200px] py-8 ${isProductDetail ? 'pb-18' : ''}`}
    >
      <div className="mx-auto px-6 max-w-7xl">
        {/* 웹 뷰 */}
        <address className="hidden md:flex flex-col space-y-4 text-sm text-warm-700 not-italic">
          <div className="flex flex-wrap flex-col items-center gap-2.5 leading-relaxed text-[15px]">
            <div>
              <span className="font-semibold text-brand-800 mr-1.5">상호명: 관아수제차</span>
              <span className="text-warm-500">(TEL: 0507-1462-8041)</span>
            </div>
            <div>
              <span className="font-semibold text-brand-800 mr-1.5">대표자: 김정옥</span>
              <span className="text-warm-500">(mobile: 010-5334-7785 / E-mail: rud0243@naver.com)</span>
            </div>
            <div>
              <span className="font-semibold text-brand-800">
                주소: 경남 하동군 화개면 목압길 24-2 (1층 관아수제차)
              </span>
            </div>
            <div>
              <span className="font-semibold text-brand-800">사업자등록번호: 613-19-89889</span>
            </div>
            <div className="mt-2">
              <span className="text-warm-400 text-[13px]">
                Copyright &copy; Gwana Tea House. All rights reserved.
              </span>
            </div>
          </div>
        </address>

        {/* 모바일 뷰 */}
        <address className="md:hidden flex flex-col space-y-4 text-warm-700 not-italic">
          <div className="flex flex-wrap flex-col items-center gap-2 leading-relaxed text-[13px]">
            <div className="flex items-center">
              <span className="font-semibold text-brand-800">상호명: 관아수제차</span>
              <span className="mx-1.5 text-brand-200">|</span>
              <span className="font-semibold text-brand-800">대표자: 김정옥 (010-5334-7785)</span>
            </div>
            <div className="flex items-center">
              <span className="font-medium text-warm-600">E-mail: rud0243@naver.com</span>
              <span className="mx-1.5 text-brand-200">|</span>
              <span className="font-medium text-warm-600">TEL: 0507-1462-8041</span>
            </div>
            <div>
              <span className="font-medium text-warm-600">
                주소: 경남 하동군 화개면 목압길 24-2 (1층 관아수제차)
              </span>
            </div>
            <div>
              <span className="font-medium text-warm-600">사업자등록번호: 613-19-89889</span>
            </div>
            <div className="flex flex-col items-center mt-2">
              <span className="text-warm-400 text-[12px]">Copyright &copy; Gwana Tea House.</span>
              <span className="text-warm-400 text-[12px]">All rights reserved.</span>
            </div>
          </div>
        </address>
      </div>
    </footer>
  );
};

export default Footer;
