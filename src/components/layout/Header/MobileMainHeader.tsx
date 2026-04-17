import dynamic from 'next/dynamic';
import Image from 'next/image';

import { ChevronLeft, MenuIcon } from 'lucide-react';

import CartButton from '@/components/layout/Header/CartButton';
import { AWS_S3_DOMAIN } from '@/constants';
import { useControllerContext, useStateContext } from '@/context/headerContext';

// SSR 비활성화로 import
const Navigation = dynamic(() => import('@/components/layout/Navigation'), {
  ssr: false,
});

const MobileMainHeader = () => {
  const { modileHeaderStyle, pathname, cartCount, menuGroup, isMenuOpen } = useStateContext();
  const { goBackWithTransitions, goHome, goToCartPage, toggleMenu, goToLoginPage } =
    useControllerContext();

  return (
    <>
      <header className={modileHeaderStyle}>
        <div className="relative flex items-center justify-between px-4 h-full">
          <button
            onClick={goBackWithTransitions}
            className="hover:bg-brand-100 rounded-lg transition-colors duration-200 z-10"
            aria-label="뒤로가기"
          >
            <ChevronLeft size={24} className="text-brand-900" />
          </button>

          {/* 로고 - 절대 중앙 */}
          <a
            onClick={goHome}
            className="absolute left-1/2 -translate-x-1/2 pt-1 cursor-pointer"
            aria-label="홈으로 이동"
          >
            {pathname === '/about' && (
              <Image
                src={`${AWS_S3_DOMAIN}images/logo/gwana_logo_1.webp`}
                alt="관아수제차"
                width={120}
                height={80}
                priority
              />
            )}
            {pathname !== '/about' && (
              <Image
                src={`${AWS_S3_DOMAIN}images/logo/gwana_logo_2.webp`}
                alt="관아수제차"
                width={80}
                height={20}
                priority
              />
            )}
          </a>

          {/* 우측 아이콘들 */}
          <div className="flex items-center gap-3 z-10">
            <CartButton
              count={cartCount}
              onClick={goToCartPage}
              variant={pathname === '/about' ? 'light' : pathname === '/' ? 'ghost' : 'default'}
            />
            <button
              className="relative py-1 hover:bg-brand-100/60 rounded-lg transition-colors duration-200"
              onClick={toggleMenu}
              aria-label="메뉴 열기"
            >
              <MenuIcon
                size={22}
                className={`${pathname === '/about' ? 'text-white drop-shadow-[0_0_2px_rgba(0,0,0,0.5)]' : 'text-brand-900'}`}
              />
            </button>
          </div>
        </div>
      </header>
      <Navigation
        isMenuOpen={isMenuOpen}
        moveToLoginPage={goToLoginPage}
        toggleMenu={toggleMenu}
        menuGroup={menuGroup}
      />
    </>
  );
};

export default MobileMainHeader;
